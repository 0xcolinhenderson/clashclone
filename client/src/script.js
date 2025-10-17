import { Game } from "./Game/game.js";
import { ServerInterface } from "./connection/ServerInterface.js";
import { QueueHandler } from "./connection/QueueHandler.js";
import { MatchmakingInterface } from "./connection/Matchmaking.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const game = new Game(ctx);

const server = new ServerInterface();
const mm = new MatchmakingInterface();
const qh = new QueueHandler(server, mm);
