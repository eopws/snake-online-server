const playersModel = require('../models/playersModel');
const randomizer   = require('../utils/randomizer');
const config       = require('../gameConfig');

class ConnectionService {
    onConnection(connectionDetails, socket) {
        const roomId = connectionDetails?.roomId;

        const playerIniData = {
            px: randomizer(0, config.worldW),
            py: randomizer(0, config.worldH),
            direction: 2,
            trailLength: 100,
            trail: [],
            velocity: 3,
        };

        const playerId = playersModel.addPlayer(roomId, socket, playerIniData)

        const message = {
            type: 'initialize',
            data: {
                worldW: config.worldW,
                worldH: config.worldH,
                id: playerId,
            }
        }

        socket.send(JSON.stringify(message));
    }

    onDisconnection(socket) {
        playersModel.deletePlayerBySocket(socket);
    }
}

module.exports = new ConnectionService
