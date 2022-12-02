export default class Server {
    constructor(game) {
        this.game = game
        this.ws = new WebSocket('ws://localhost:9001');
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

    onMessage({data}) {
        
        data = JSON.parse(data);
        switch(data.type) {
            case "init":
                this.onInit(data);
                break;
            case "update":
                this.onUpdate(data);
                break;
        }

        this.sendMouse();
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

    onInit(data) {
        this.game.settings.width = data.width;
        this.game.settings.height = data.height;
        this.game.ownerID = data.id;
        console.log(data.id)
        console.log("init")
    }

    onUpdate(data) {
        data.players.forEach(player => {
            if (!this.game.players.hasOwnProperty(player.id)) {
                this.game.addPlayer(player);
            }

            this.game.players[player.id].updated = Date.now();
            this.game.players[player.id].nx = player.x;
            this.game.players[player.id].ny = player.y;
            this.game.players[player.id].ox = this.game.players[player.id].x;
            this.game.players[player.id].oy = this.game.players[player.id].y;
        })
    }
}