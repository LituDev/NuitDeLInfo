const uWS = require("uWebSockets.js");

class Server {
    constructor(game) {
        this.game = game;
        new uWS.App().ws("/*", {
            compression: uWS.DEDICATED_COMPRESSOR_128KB,
            maxPayloadLength: 16 * 1024 * 1024,
            idleTimeout: 60 * 10,
            upgrade: (res, req, ctx) => {
                res.upgrade({
                        req
                    }, req.getHeader('sec-websocket-key'), req.getHeader('sec-websocket-protocol'),
                    req.getHeader('sec-websocket-extensions'), ctx)
            },
            open: ws => this.onConnection(ws),
            message: (ws, message, isBinary) => this.onMessage(ws, message, isBinary),
            close: (ws, code, message) => this.onClose(ws, code, message),
            ping: ws => ws.end(1003, "Unexpected message format"),
            pong: ws => ws.end(1003, "Unexpected message format")
        }).listen(9001, (listenSocket) => {

            if (listenSocket) {
              console.log('Listening to port 9001');
            }
            
        });
    }

    onConnection(ws) {
        //console.log(ws.send)
        const player = this.game.addPlayer(ws);
        ws.connection = player;
    }

    onMessage(ws, message, isBinary) {
        const buffer = Buffer.from(message);
        const string = buffer.toString();
        ws.connection.onMessage(string);
    }

    onClose(ws, code, message) {
        this.game.removePlayer(ws.connection);
    }
}

module.exports = Server;