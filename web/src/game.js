import { Tile } from "./tile.js";

// game class to hold bullshit
export class Game {
    constructor(ctx) {
        // inital shenanigans
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        // dont hardcode this pls juist freakin make constants file or display driver
        this.aspect_ratio = 9 / 16;
        this.rows = 32;
        this.cols = 18;

        this.tiles = [];

        // keep our wrapper sized right, everytime client changes window resize it
        this.resize = this.resize.bind(this);
        window.addEventListener("resize", this.resize);

        this.canvas.addEventListener("mousemove", (e) => this.handleMouse(e));
        this.canvas.addEventListener("click", (e) => this.handleClick(e));
        this.resize();
    }

    resize() {
        const wrapper = document.getElementById("canvas-wrapper");
        const { clientWidth, clientHeight } = wrapper;

        let width = clientWidth;
        let height = clientWidth / this.aspect_ratio;

        // this is vibe coded but works
        if (height > clientHeight) {
            height = clientHeight;
            width = height * this.aspect_ratio;
        }

        this.canvas.width = width;
        this.canvas.height = height;

        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;

        this.tileWidth = width / this.cols;
        this.tileHeight = height / this.rows;

        this.createTiles();
        this.draw();
    }

    createTiles() {
        this.tiles = [];
        for (let row = 0; row < this.rows; row++) {
            const rowTiles = [];
            for (let col = 0; col < this.cols; col++) {
                rowTiles.push(new Tile(col, row, this.tileWidth, this.tileHeight));
            }
            this.tiles.push(rowTiles);
        }
    }

    handleMouse(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        this.tiles.forEach((row) => row.forEach((tile) => tile.reset()));

        this.tiles.forEach((row, r) =>
            row.forEach((tile, c) => {
                const x = c * this.tileWidth;
                const y = r * this.tileHeight;
                if (tile.isHovered(mouseX, mouseY, x, y)) {
                    tile.onHover();
                }
            })
        );

        this.draw();
    }

    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const mouseX = (e.clientX - rect.left) * scaleX;
        const mouseY = (e.clientY - rect.top) * scaleY;

        const col = Math.floor(mouseX / this.tileWidth);
        const row = Math.floor(mouseY / this.tileHeight);

        // bounds check
        if (col < 0 || col >= this.cols || row < 0 || row >= this.rows) return;

        const tile = this.tiles[row][col];
        // call the tile click handler
        if (tile) {
            tile.onClick();
        }

        this.draw();
    }

    draw() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.tiles.forEach((row, r) =>
            row.forEach((tile, c) => {
                const x = c * this.tileWidth;
                const y = r * this.tileHeight;
                tile.draw(ctx, x, y);
            })
        );
    }

}


