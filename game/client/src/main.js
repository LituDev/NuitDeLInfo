import * as Phaser from 'phaser';
import '/style/index.css'

function preload() {
    //this.load.setBaseURL('https://labs.phaser.io');

    //this.load.image('sky', 'assets/skies/space3.png');
    //this.load.image('logo', 'assets/sprites/phaser3-logo.png');
    //this.load.image('red', 'assets/particles/red.png');
}

function create() {}

const GameConfig = {
    type: Phaser.AUTO,
    width: innerWidth,
    height: innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 0
            }
        }
    },
    scene: {
        preload: preload,
        create: create
    }
};

export class Game extends Phaser.Game {
    constructor(config) {
        super(config);
    }
}

window.addEventListener('load', () => {
    // Expose `_game` to allow debugging, mute button and fullscreen button
    window._game = new Game(GameConfig);
});