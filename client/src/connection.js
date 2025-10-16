export class ServerInterface {
  constructor() {
    this.socket = new WebSocket("ws://localhost:8080");
    this.requestId = 0;
    this.pendingRequests = new Map();

    this.socket.onopen = () => {
      console.log("WebSocket connection established.");
    };

    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const { requestId, type, ...data } = message;

      if (this.pendingRequests.has(requestId)) {
        const { resolve, reject } = this.pendingRequests.get(requestId);
        this.pendingRequests.delete(requestId);

        if (type.endsWith("Response")) {
          resolve(data);
        } else {
          reject(new Error("Invalid response type: " + type));
        }
      }
    };
  }

  sendRequest(type, payload = {}) {
    return new Promise((resolve, reject) => {
      const requestId = ++this.requestId;
      const message = JSON.stringify({ type, requestId, ...payload });

      this.pendingRequests.set(requestId, { resolve, reject });
      this.socket.send(message);

      setTimeout(() => {
        if (this.pendingRequests.has(requestId)) {
          this.pendingRequests.delete(requestId);
          reject(new Error("Request timed out: " + type));
        }
      }, 5000);
    });
  }

  async getId() {
    const { id } = await this.sendRequest("getId");
    return id;
  }

  async verifyUser(username) {
    console.log("Verifying username with server: ", username);
    const { valid } = await this.sendRequest("verifyUser", { username });
    return valid;
  }
}

export class Player {
  constructor(username, serverInterface) {
    this.username = username;
    this.valid = false;
    this.serverInterface = serverInterface;
  }

  async verifyPlayer() {
    console.log("Verifying user: ", this.username);
    console.log("With server interface: ", this.serverInterface);
    const valid = await this.serverInterface.verifyUser(this.username);
    this.valid = valid;
    await this.generateId();
    return true;
  }

  async generateId() {
    // ask server for a unique id
    console.log("Generating ID...");
    this.id = await this.serverInterface.getId();
  }
}

export class QueueHandler {
  constructor(serverInterface) {
    this.serverInterface = serverInterface;
    this.form = document.getElementById("findGameForm");
    this.usernameInput = this.form.querySelector("input[name='username']");
    this.findingGameUI = document.getElementById("findingGameUI");
    this.submitBtn = document.getElementById("submitBtn");
    this.cancelBtn = document.getElementById("cancelBtn");

    if (!this.form || !this.findingGameUI || !this.cancelBtn) {
      throw new Error("Missing DOM elements!");
    }

    this.form.addEventListener("submit", async (e) => {
      e.preventDefault();
      this.setFormDisabled(true);

      console.log("Form submitted, processing...");

      const username = this.usernameInput.value.trim();
      this.player = new Player(username, this.serverInterface);

      console.log("Submitting form...");

      try {
        const verification = await this.player.verifyPlayer();
        if (verification) {
          console.log(
            "Player verified: ",
            this.player.username,
            " ID: ",
            this.player.id
          );
          this.showFindingGameUI();

          this.serverInterface.socket.send(
            JSON.stringify({
              type: "joinQueue",
              username: this.player.username,
              id: this.player.id,
            })
          );
        }
      } catch (error) {
        console.error("Error verifying player:", error);
        this.setFormDisabled(false);
      }
    });

    this.cancelBtn.addEventListener("click", (e) => {
      this.cancelQueue();
    });
  }

  cancelQueue() {
    if (
      this.player &&
      this.serverInterface?.socket?.readyState === WebSocket.OPEN
    ) {
      this.serverInterface.socket.send(
        JSON.stringify({
          type: "leaveQueue",
          id: this.player.id,
        })
      );
    }

    this.player = null;
    this.resetForm();
  }

  setFormDisabled(disabled) {
    this.usernameInput.disabled = disabled;
    this.submitBtn.disabled = disabled;
  }

  showFindingGameUI() {
    this.form.style.display = "none";
    this.findingGameUI.style.display = "block";
  }

  resetForm() {
    this.form.reset();
    this.setFormDisabled(false);
    this.findingGameUI.style.display = "none";
    this.form.style.display = "block";
  }
}
