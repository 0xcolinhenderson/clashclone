import { Game } from "./game.js";
//import { QueueHandler } from "./connection.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const game = new Game(ctx);
