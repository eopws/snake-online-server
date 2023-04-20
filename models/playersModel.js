const roomsModel = require('./roomsModel');
const uuid       = require('uuid');

class PlayersModel {
    constructor() {
        this._players = {};
        this._sockets = {};
    }

    addPlayer(roomId, socket, playerIniData = {}) {
        const id = uuid.v4();

        playerIniData.id = id;

        this._players[id] = playerIniData;
        this._sockets[id] = socket;
        roomsModel.addPlayer(socket, roomId);

        return id;
    }

    getAllPlayersData() {
        return this._players;
    }

    getPlayerData(id) {
        return this._players[id];
    }

    getPlayerSocket(id) {
        return this._sockets[id];
    }

    getPlayerDataBySocket(socket) {
        for (const item in this._sockets) {
            if (this._sockets[item] === socket) {
                return this._players[item];
            }
        }
    }

    deletePlayerBySocket(socket) {
        for (const item in this._sockets) {
            if (this._sockets[item] === socket) {
                delete this._sockets[item];
                delete this._players[item];

                roomsModel.deletePlayerBySocket(socket);

                break;
            }
        }
    }
}

module.exports = new PlayersModel
