const Entity = require("./Entity");

class Boss extends Entity {
    constructor(options) {
        super(options);
        this.width = 200;
        this.height = 200;
        this.speed = 0.8;
        this.type = "boss";
        this.shape = "circle";
        this.strength = 20;
    }

    updateTarget() {
        let closest = null;

        if (this.game.players.length > 1) {
            closest = this.game.players[1];

            this.game.players.forEach(player => {
                if (player.id != this.id && player.type == "player") {
                    if (Math.sqrt(Math.pow(player.x - this.x, 2) + Math.pow(player.y - this.y, 2)) < Math.sqrt(Math.pow(closest.x - this.x, 2) + Math.pow(closest.y - this.y, 2))) {
                        closest = player;
                    }
                }
            })

            this.mouse.x = closest.x;
            this.mouse.y = closest.y;
        }

        const angle = Math.atan2(this.mouse.y - this.y, this.mouse.x - this.x);

        this.velocity.x += Math.cos(angle) * this.speed;
        this.velocity.y += Math.sin(angle) * this.speed;
    }

    update() {
        this.updateTarget();
        this.updateMouse();
        this.checkDeath();
        this.checkCollisions();

    }
}

module.exports = Boss;