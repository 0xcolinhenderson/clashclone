export class PlayerConnection {
    constructor(username, serverInterface) {
        this.username = username;
        this.valid = false;
        this.serverInterface = serverInterface;
    }

    async verifyPlayer() {
        const valid = await this.serverInterface.verifyUser(this.username);
        this.valid = valid;
        await this.generateId();
        return true;
    }

    async generateId() {
        this.id = await this.serverInterface.getId();
    }
}