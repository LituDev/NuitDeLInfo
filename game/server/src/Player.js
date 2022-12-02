const Entity = require("./Entity");

class Player extends Entity {
    constructor(options) {
        super(options);
        this.ws = options.ws;
        this.type = "player";
        this.speed = 1;
        this.shape = "rectangle";
        this.width = 50;
        this.height = 100;
        this.state = "idle";
        this.name = "Player";
    }

    sendInit() {
        //console.log("Sending init");
        this.send(JSON.stringify({
            type: "init",
            id: this.id,
            width: this.game.width,
            height: this.game.height,
        }))
    }

    sendUpdate() {
        if (this.isNew) {
            this.sendInit();
            this.isNew = false;
        }

        this.send(JSON.stringify({
            type: "update",
            players: this.game.players.map(player => player.getPacket())
        }))

        switch (this.keyState) {
            case "ArrowUp":
                this.velocity.y -= 5;
                this.velocity.x = 0;
                break;
            case "ArrowDown":
                this.velocity.y += 5;
                this.velocity.x = 0;
                break;
            case "ArrowLeft":
                this.velocity.x -= 5;
                this.velocity.y = 0;
                break;
            case "ArrowRight":
                this.velocity.x += 5;
                this.velocity.y = 0;
                break;
        }
    }

    send(message) {
        //console.log("Sending message : " + message);
        if (this.ws) {
            this.ws.send(message);
        }
    }

    onMessage(message) {

        message = JSON.parse(message);

        //console.log("Message received : " + message);

        switch (message.type) {
            /*case "mouse":
                this.onMouse(message);
                break;
            */
            case 'keyboard':
                this.onKeyboard(message);
        }
    }

    onKeyboard(message) {
        this.keyState = message.state
        this.name = message.name;
    }

    onMouse(message) {
        this.mouse.x = message.x;
        this.mouse.y = message.y;
    }
}

module.exports = Player;