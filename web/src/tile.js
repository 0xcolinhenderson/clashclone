export class Tile {
    constructor(col, row, width, height) {
        this.col = col;
        this.row = row;
        this.width = width;
        this.height = height;
        this.defaultColor = "transparent";
        this.hoverColor = "rgba(0, 255, 0, 0.5)";
        this.currentColor = this.defaultColor;
    }

    draw(ctx, x, y) {
        ctx.fillStyle = this.currentColor;
        ctx.fillRect(x, y, this.width, this.height);
        ctx.strokeStyle = "grey";
        ctx.lineWidth = 0.1;
        ctx.strokeRect(x, y, this.width, this.height);
    }

    isHovered(mouseX, mouseY, x, y) {
        return (
            mouseX >= x &&
            mouseX <= x + this.width &&
            mouseY >= y &&
            mouseY <= y + this.height
        );
    }

    onHover() {
        this.currentColor = this.hoverColor;
    }

    onClick() {
        console.log(`Tile clicked at (${this.col}, ${this.row})`);
        this.currentColor = "rgba(255, 0, 0, 0.5)";
    }

    reset() {
        this.currentColor = this.defaultColor;
    }

}
