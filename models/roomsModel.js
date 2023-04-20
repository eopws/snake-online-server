const uuid = require('uuid');

class RoomsModel {
    constructor() {
        this._rooms = {};
    }

    addRoom() {
        const newRoomId = uuid.v4();

        this._rooms[newRoomId] = [];

        return newRoomId;
    }

    /*
     * add a player to room
     * creates room if it doesn't exist
    */
    addPlayer(socket, roomId = null) {
        if (!this.doesRoomExists(roomId)) {
            roomId = this.addRoom();
        }

        this._rooms[roomId].push(socket);
    }

    getAllRooms() {
        return Object.assign({}, this._rooms);
    }

    getPlayersInRoom(roomId) {
        return this._rooms[roomId];
    }

    /**
     * returns player's room
     */
    getPlayersRoomId(socket) {
        for (const roomId in this._rooms) {
            if (this._rooms[roomId].includes(socket)) {
                return roomId;
            }
        }

        return null;
    }

    doesRoomExists(roomId) {
        return !!this._rooms[roomId];
    }

    deletePlayerBySocket(socket) {
        for (const roomId in this._rooms) {
            const indexOfSocket = this._rooms[roomId].indexOf(socket);

            if (indexOfSocket !== -1) {
                this._rooms[roomId].splice(indexOfSocket, 1);

                if (this._rooms[roomId].length === 0) {
                    delete this._rooms[roomId];
                }

                return roomId;
            }
        }
    }
}

module.exports = new RoomsModel
