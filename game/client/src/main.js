import * as PIXI from 'pixi.js-legacy';
import '/style/index.css'
import Server from './Server.js'
import Boss from './Boss.js'

PIXI.settings.MIPMAP_MODES = PIXI.MIPMAP_MODES.OFF;
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const app = new PIXI.Application({
    width: innerWidth,
    height: innerHeight,
    antialias: false,
    transparent: false,
    resolution: 1,
    resizeTo: window
});

document.body.appendChild(app.view);



class Game {
    constructor() {
        this.settings = {
            width: 1000,
            height: 1000,
        }

        this.camera = {
            x: 1,
            y: 1,
            s: 1,
            w: 1,
            score: 0,
            target: {
                x: 1,
                y: 1,
                s: 1
            }
        }

        this.mouse = {
            x: 0,
            y: 0
        }

        addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        this.players = new Object();
        this.server = new Server(this);

        this.background = PIXI.TilingSprite.from("/tile.jpg", {
            width: this.settings.width,
            height: this.settings.height
        });
        this.background.width = this.settings.width;
        this.background.height = this.settings.height;
        console.log(this.background)
        app.stage.addChild(this.background);

        this.bossFrames = [];

        PIXI.Assets.load('/boss.json').then(() => {
            for (let i = 0; i < 3; i++) {
                // magically works since the spritesheet was loaded with the pixi loader
                this.bossFrames.push(PIXI.Texture.from(`pixil-frame-${i}.png`));
            }
        });

        app.ticker.add((delta) => {
            if (this.players.hasOwnProperty(this.ownerID)) {
                this.camera.target.x = this.players[this.ownerID].x;
                this.camera.target.y = this.players[this.ownerID].y;
            }

            this.camera.x = this.camera.x + (this.camera.target.x - this.camera.x) * 0.1;
            this.camera.y = this.camera.y + (this.camera.target.y - this.camera.y) * 0.1;

            app.stage.pivot.set(this.camera.x, this.camera.y);
            app.stage.scale.set(this.camera.s)
            app.stage.position.set(innerWidth / 2, innerHeight / 2)

            for (const player in this.players) {
                this.players[player].__update(delta);
            }
        })

    }

    addBoss(id, x, y, width, height) {
        const boss = new Boss(this.bossFrames, id, x, y, width, height);
        this.players[id] = boss;
        app.stage.addChild(boss);
        console.log(this.players)
        return boss;
    }

    addPlayer({
        id,
        x,
        y,
        width,
        height
    }) {
        const player = this.addBoss(id, x, y, width, height);
        return player;
    }
}

new Game()