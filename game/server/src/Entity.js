class Entity {
    static ID = 0
    constructor(options) {
        this.game = options.game;
        this.id = Entity.ID++;
        this.updated = Date.now();
        this.keyState  = ""
        this.mouse = {
            x: 0,
            y: 0
        }
        this.type = "";

        this.velocity = {
            x: 0,
            y: 0
        }
        this._x = Math.random() * this.game.settings.width;
        this._y = Math.random() * this.game.settings.height;
        this.width = 100;
        this.height = 100;
        this.isNew = true;
        this.health = 100;
        this.strength = 10;
        this.shape = "";
        this.ignoreCollisions = false;
    }

    update() {
        this.updateMouse();
        this.checkCollisions();
        this.checkDeath();
    }

    updateMouse() {
        /*const angle = Math.atan2(this.mouse.y - this.y, this.mouse.x - this.x);
        this.velocity.x += Math.cos(angle) * 10 * this.speed;
        this.velocity.y += Math.sin(angle) * 10 * this.speed;*/

        this.x += this.velocity.x;
        this.y += this.velocity.y;

        this.velocity.x *= 0.8;
        this.velocity.y *= 0.8;
    }

    checkDeath() {
        if (this.health <= 0) {
            this.repawn()
        }
    }

    repawn() {
        this.health = 100;
        this.x = Math.random() * this.game.settings.width;
        this.y = Math.random() * this.game.settings.height;

    }

    onCollision(entity) {
        this.health -= entity.strength;
    }

    checkCollisions() {
        if (this.x < 0) {
            this.x = 0; + this.width;
        }

        if (this.x > this.game.settings.width - this.width) {
            this.x = this.game.settings.width - this.width;
        }

        if (this.y < 0) {
            this.y = 0 - 1;
        }

        if (this.y > this.game.settings.height - this.height) {
            this.y = this.game.settings.height - this.height;
        }
    }

    get x() {
        return this._x;
    }

    set x(value) {
        this._x = value;
    }

    get y() {
        return this._y;
    }

    set y(value) {
        this._y = value;
    }

    getPacket() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            keyState: this.keyState,
            type: this.type,
            health: this.health,
            name: "Player"
        }
    }
}

module.exports = Entity;