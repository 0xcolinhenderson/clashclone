import { PlayerConnection } from "./PlayerConnection.js";

export class QueueHandler {
  constructor(serverInterface, matchmakingInterface) {
    this.serverInterface = serverInterface;
    this.matchmakingInterface = matchmakingInterface;
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

      const username = this.usernameInput.value.trim();
      this.player = new PlayerConnection(username, this.serverInterface);

      try {
        const isVerified = await this.player.verifyPlayer();
        console.log("Verification result: ", isVerified);
        if (isVerified) {
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
        } else {
          alert("Username is already taken. Please choose another one.");
          this.setFormDisabled(false);
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
