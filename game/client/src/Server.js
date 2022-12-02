export default class Server {
    constructor(game) {
        this.game = game
        this.ws = new WebSocket('ws://localhost:9001');
        this.name = game.player;
        this.ws.onopen = () => {
            this.onConnection();
        }

        this.ws.onmessage = (message) => {
            this.onMessage(message);
        }

    }

    onConnection() {
        console.log("connected")
    }

    onMessage({
        data
    }) {

        data = JSON.parse(data);
        switch (data.type) {
            case "init":
                this.onInit(data);
                break;
            case "update":
                this.onUpdate(data);
                break;
        }
    }

    onClose() {

    }

    sendMouse() {
        this.ws.send(JSON.stringify({
            type: "mouse",
            x: (this.game.mouse.x - innerWidth / 2) / this.game.camera.s + this.game.camera.x,
            y: (this.game.mouse.y - innerHeight / 2) / this.game.camera.s + this.game.camera.y
        }))
    }

    sendSpawn(name) {
        this.ws.send(JSON.stringify({
            type: "spawn",
            name: name
        }))

    }

    sendKeyboard() {
        this.ws.send(JSON.stringify({
            type: "keyboard",
            state: this.game.controlState,
            name: this.name
        }))

        /*this.ws.send(JSON.stringify({
            type: "mouse",
            x: (this.game.mouse.x - innerWidth / 2) / this.game.camera.s + this.game.camera.x,
            y: (this.game.mouse.y - innerHeight / 2) / this.game.camera.s + this.game.camera.y
        }))*/
    }

    onInit(data) {
        this.game.settings.width = data.width;
        this.game.settings.height = data.height;
        this.game.ownerID = data.id;
        console.log("init")
    }

    onUpdate(data) {
        data.players.forEach(player => {
            if (!this.game.players.hasOwnProperty(player.id)) {
                if (player.type == "player") {
                    this.game.addPlayer(player);
                } else if (player.type == "boss") {
                    this.game.addBoss(player);
                } else if (player.type == "bound") {
                    this.game.addBound(player);
                }
            }

            this.game.players[player.id].updated = Date.now();
            this.game.players[player.id].nx = player.x;
            this.game.players[player.id].ny = player.y;
            this.game.players[player.id].width = player.width;
            this.game.players[player.id].name = player.name;
            this.game.players[player.id].health = player.health;
            console.log(player)
            this.game.players[player.id].height = player.height;
            this.game.players[player.id].ox = this.game.players[player.id].x;
            this.game.players[player.id].oy = this.game.players[player.id].y;

            if (player.keyState == "ArrowUp" || player.keyState == "ArrowDown" || player.keyState == "ArrowLeft" || player.keyState == "ArrowRight") {
                this.game.players[player.id].keyState = player.keyState;
            }
        })
    }
}