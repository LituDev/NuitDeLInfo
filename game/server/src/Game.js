const Player = require("./Player")
const Boss = require("./Boss")

class Game {
    constructor() {
        this.settings = {
            width: 1000,
            height: 1000,
        }
        this.players = new Array();

        setInterval(() => {
            this.update();
            this.sendUpdate();
        }, 5000 / 60)

        this.players.push(new Boss({
            game: this
        }))
    }

    addPlayer(ws) {
        const player = new Player({
            game: this,
            ws
        })
        this.players.push(player)
        return player
    }

    checkCollisions() {
        this.players.forEach(player => {
            this.players.forEach(other => {
                if (player.id === other.id) return;
                if (player.shape === "rectangle" && other.shape === "rectangle") {
                    if (player.x < other.x + other.width &&
                        player.x + player.width > other.x &&
                        player.y < other.y + other.height &&
                        player.y + player.height > other.y) {
                        // collision detected!
                        console.log("rectangle");
                    }
                } else if (player.shape === "circle" && other.shape === "circle") {
                    if (Math.sqrt(Math.pow(player.x - other.x, 2) + Math.pow(player.y - other.y, 2)) < player.width / 2 + other.width / 2) {
                        console.log("circle")
                    }
                } else if ((player.shape === "rectangle" && other.shape === "circle") || (player.shape === "circle" && other.shape === "rectangle")) {
                    if (player.x < other.x + other.width &&
                        player.x + player.width > other.x &&
                        player.y < other.y + other.height &&
                        player.y + player.height > other.y) {
                        console.log("rect/circle");
                    }
                }

            })
        })
    }

    update() {
        this.players.forEach(player => {
            player.update();
        })

        this.checkCollisions();
    }

    sendUpdate() {
        this.players.forEach(player => {
            if (player.type == "player") player.sendUpdate();
        })
    }

    removePlayer(player) {
        this.players.splice(this.players.indexOf(player), 1);
    }

}

module.exports = Game;