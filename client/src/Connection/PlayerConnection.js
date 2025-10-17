export class PlayerConnection {
  constructor(username, serverInterface) {
    this.username = username;
    this.valid = false;
    this.serverInterface = serverInterface;
  }

  async verifyPlayer() {
    console.log("Verifying player: ", this.username);
    const valid = await this.serverInterface.verifyUser(this.username);
    console.log("Player valid: ", valid);
    this.valid = valid;
    if (!this.valid) return false;
    await this.generateId();
    return true;
  }

  async generateId() {
    this.id = await this.serverInterface.getId();
  }
}
