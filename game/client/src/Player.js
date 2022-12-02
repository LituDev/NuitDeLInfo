import * as PIXI from 'pixi.js-legacy';

export default class Player{
    constructor(frames, id, x, y, width, height, app, game, name) {
        this.move = new PIXI.AnimatedSprite(frames[0]);
        this.back = new PIXI.AnimatedSprite(frames[1]);
        this.face = new PIXI.AnimatedSprite(frames[2]);
        this.keyState = "ArrowRight";
        this.selected = this.move;
        this.game = game;
        this.app = app;
        this.updated = Date.now()
        this.id = id;
        this.x = this.ox = this.nx = x;
        this.y = this.oy = this.ny = y;
        this.selected.width = width;
        this.selected.height = height;
        this.selected.animationSpeed = 0.3;
        this.selected.play();
        this.nameSprite = new PIXI.Sprite(game.getName("Litu"))
        app.stage.addChild(this.nameSprite);        
        app.stage.addChild(this.selected);
    }

    __update() {
        if (this.keyState == "ArrowUp") {
            this.app.stage.removeChild(this.selected);
            this.selected = this.back;
            this.selected.animationSpeed = 0.1;
            this.selected.play();
            this.app.stage.addChild(this.selected);
        } else if (this.keyState == "ArrowRight") {
            this.app.stage.removeChild(this.selected);
            this.selected = this.move;
            this.selected.scale.x = 1;
            this.selected.animationSpeed = 0.1;
            this.selected.play();
            this.app.stage.addChild(this.selected);
        } else if (this.keyState == "ArrowLeft") {
            this.app.stage.removeChild(this.selected);
            this.selected = this.move;
            this.selected.scale.x = -1;
            this.selected.animationSpeed = 0.1;
            this.selected.play();
            this.app.stage.addChild(this.selected);
        } else if (this.keyState == "ArrowDown") {
            this.app.stage.removeChild(this.selected);
            this.selected = this.face;
            this.selected.animationSpeed = 0.1;
            this.selected.play();
            this.app.stage.addChild(this.selected);
        }

        this.nameSprite.x = this.x;
        this.nameSprite.y = this.y - 50;
        this.nameSprite.texture = this.game.getName(this.name)
        

        this.selected.width = this.width;
        this.selected.height = this.height;

            

        const elapasped = Date.now() - this.updated;
        const delta = Math.min(Math.max(elapasped / 200, 0), 1);
        this.selected.x = this.x = this.x + (this.nx - this.x) * delta;
        this.selected.y = this.y = this.y + (this.ny - this.y) * delta;

        console.log(this.game.ownerID, this.id)
        if (this.game.ownerID === this.id) {
            document.getElementById("life-perso").setAttribute("style", `width:${this.health}%`)
        }
    }
}