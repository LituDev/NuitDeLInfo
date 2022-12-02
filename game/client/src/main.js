import * as PIXI from 'pixi.js-legacy';
import '/style/index.css'
import Server from './Server.js'
import Boss from './Boss.js'
import Player from './Player.js'
import Bound from './Bound.js'

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

//app.loader.add('map', 'assets/map.png').load(setup);



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
        this.name = ""

        this.names = {}

        this.controlState = "idle"

        //when i press an arrow, i want to move in that direction and have no delay on repeat

        let first = true;
        addEventListener('keydown', e => {
            if (first) {
                const myAudio = new Audio('final_area.ogg'); 
                if (typeof myAudio.loop == 'boolean')
                {
                    myAudio.loop = true;
                }
                else
                {
                    myAudio.addEventListener('ended', function() {
                        this.currentTime = 0;
                        this.play();
                    }, false);
                }
                myAudio.play();
                first = false
            }
            if (this.interval) return;
            this.interval = setInterval(() => {
                this.controlState = e.key;
                this.server.sendKeyboard();
            }, 100);

        })

        addEventListener('keyup', e => {
            clearInterval(this.interval);
            this.interval = null;
            this.controlState = "idle";
            this.server.sendKeyboard();
        })

        this.ready = false;

        addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        addEventListener('mousedown', (e) => {
            this.mouse.clicked = true;
        });

        this.players = new Object();

        new Promise((resolve, reject) => {
            setInterval(() => {
                if (this.ready) {
                    resolve()
                }
            }, 100)
        }).then(() => {
            this.server = new Server(this);
        })

        this.background = PIXI.Sprite.from("/map.png");
        this.background.width = 70 * 41;
        this.background.height = 70 * 11;
        //this.background.anchor.set(1);
        //this.background.width = this.settings.width;
        //this.background.height = this.settings.height;
        app.stage.addChild(this.background);

        this.bossFrames = [];
        this.faceFrames = [];
        this.backFrames = [];
        this.moveFrames = [];
        this.ready = false;


        PIXI.Assets.load('/face.json').then(() => {
            for (let i = 0; i < 2; i++) {
                this.faceFrames.push(PIXI.Texture.from(`face-${i}.png`));
            }
        }).then(() => {
            PIXI.Assets.load('/move.json').then(() => {
                for (let i = 0; i < 8; i++) {
                    this.moveFrames.push(PIXI.Texture.from(`move${i}.png`));
                }
            }).then(() => {
                PIXI.Assets.load('/dos.json').then(() => {
                    for (let i = 0; i < 2; i++) {
                        this.backFrames.push(PIXI.Texture.from(`dos-${i}.png`));
                    }
                }).then(() => {
                    PIXI.Assets.load('/boss.json').then(() => {
                        for (let i = 0; i < 3; i++) {
                            this.bossFrames.push(PIXI.Texture.from(`pixil-frame-${i}.png`));
                        }
                        this.ready = true;
                    });
                });
            });
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

    addBoss({
        id,
        x,
        y,
        width,
        height,
        mouse
    }) {
        const boss = new Boss(this.bossFrames, id, x, y, width, height);
        this.players[id] = boss;
        app.stage.addChild(boss);
        return boss;
    }

    addPlayer({
        id,
        x,
        y,
        width,
        height,
        mouse
    }) {
        const player = new Player([this.moveFrames, this.backFrames, this.faceFrames], id, x, y, width, height, app, this, mouse);
        this.players[id] = player;
        return player;
    }

    getName(name) {
        if (this.names.hasOwnProperty(name)) {
            return this.names[name];
        } else {
            this.names[name] = app.renderer.generateTexture(new PIXI.Text(name, {
                fontFamily: 'Arial',
                fill: 0xffffff,
                align: 'center'

            }));
            return this.names[name]
        }
    }

    addBound({
        id,
        x,
        y,
        width,
        height
    }) {
        const bound = new Bound(id, x, y, width, height);
        this.players[id] = bound;
        app.stage.addChild(bound);
        return bound;
    }
}

document.getElementById("hud").style.display = "none"
document.getElementById("play").onclick = ()=> {
    new Game()
    document.getElementById("ddd").style.display = "none"
    document.getElementById("hud").style.display = "block"
}