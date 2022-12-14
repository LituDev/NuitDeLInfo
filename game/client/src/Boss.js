import * as PIXI from 'pixi.js-legacy';

export default class Boss extends PIXI.AnimatedSprite {
    constructor(frames, id, x, y, width, height, mouse) {
        console.log(frames)
        super(frames);
        this.mouse = {x: 0, y: 0};
        this.updated = Date.now()
        this.id = id;
        this.x = this.ox = this.nx = x;
        this.y = this.oy = this.ny = y;
        this.width = width;
        this.height = height;
        this.animationSpeed = 0.3;
        this.play();
        this.anchor.set(0.5, 0);
    }

    __update() {
        const elapasped = Date.now() - this.updated;
        const delta = Math.min(Math.max(elapasped / 200, 0), 1);
        this.x = this.x + (this.nx - this.x) * delta;
        this.y = this.y + (this.ny - this.y) * delta;

        if (this.health === 0) {
            window.open("/index2.html")
        }

        document.getElementById("life-boss").setAttribute("style", `width:${this.health}%`)
    }
}