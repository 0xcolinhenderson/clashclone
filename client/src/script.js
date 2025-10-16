import { Game } from "./game.js";
import { ServerInterface, QueueHandler } from "./connection.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const game = new Game(ctx);

const server = new ServerInterface();
const qh = new QueueHandler(server);
