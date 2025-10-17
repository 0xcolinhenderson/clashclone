import { Game } from "./Game/game.js";
import { ServerInterface } from "./Connection/ServerInterface.js";
import { QueueHandler } from "./Connection/QueueHandler.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const game = new Game(ctx);

const server = new ServerInterface();
const qh = new QueueHandler(server);
