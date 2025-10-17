export class ServerInterface {
    constructor() {
        this.socket = new WebSocket("ws://localhost:8080");
        this.requestId = 0;
        this.pendingRequests = new Map();

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
        const { valid } = await this.sendRequest("verifyUser", { username });
        return valid;
    }
}