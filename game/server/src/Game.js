const Player = require("./Player")
const Boss = require("./Boss")
const Bound = require("./Bound")

class Game {
    constructor() {
        this.settings = {
            width: 70 * 41,
            height: 70 * 11,
        }
        this.players = new Array();

        setInterval(() => {
            this.update();
            this.sendUpdate();
        }, 40)

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
                let px = player.x;
                let py = player.y;
                let pw = player.type === "bound" ? player.width * 2 : player.width;
                let ox = other.x;
                let oy = other.y;
                let ow = other.type === "bound" ? other.width * 2 : other.width;
                if (Math.sqrt(Math.pow(px - ox, 2) + Math.pow(py - oy, 2)) <= pw / 2 + ow / 2) {
                    this.resolveCollision(player, other);
                }
            })
        })
    }



    resolveCollision(a, b) {
        if (a.ignoreCollisions || b.ignoreCollisions) return;

        a.ignoreCollisions = true;
        b.ignoreCollisions = true;

        let dx = a.x - b.x;
        let dy = a.y - b.y;

        let ar = a.width >= a.height ? a.width / 2 : a.height / 2;
        let br = b.width >= b.height ? b.width / 2 : b.height / 2;

        let d = Math.sqrt(dx * dx + dy * dy);

        let m = ar + br - d;

        if (m <= 0) return;
        if (d === 0) d = 1, dx = 1, dy = 0;
        else dx /= d, dy /= d;

        let sar = ar * ar;
        let sbr = br * br;

        let M = sar + sbr;
        let aM = sbr / M;
        let bM = sar / M;
        //bouge les collisions

        a.velocity.x += dx * m * aM * 2;
        a.velocity.y += dy * m * aM * 2;
        b.velocity.x -= dx * m * bM * 2;
        b.velocity.y -= dy * m * bM * 2;

        a.health -= b.strength
        b.health -= a.strength
    }

    update() {
        this.players.forEach(player => {
            player.update();
            player.ignoreCollisions = false;
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