const Entity = require("./Entity");

class Bound extends Entity {
    constructor(options) {
        super(options);
        this.width = options.width;
        this.height = options.height;
        this.x = options.x;
        this.y = options.y;
        this.type = "bound";
        this.shape = "circle";
    }

    update() {
    }
}

module.exports = Bound;