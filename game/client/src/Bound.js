import * as PIXI from 'pixi.js-legacy';

export default class Bound extends PIXI.Sprite {
    constructor(id, x, y, width, height, texture) {
        super(PIXI.Texture.WHITE);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.anchor.set(0, 0);
    }

    __update() {

    }
}