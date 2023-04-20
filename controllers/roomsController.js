const roomsService = require('../services/roomsService')

class RoomsController {
    onGetRooms(req, res) {
        return roomsService.onGetRooms(req, res)
    }

    onDisconnection(socket) {
        roomsService.onDisconnection(socket)
    }
}

module.exports = new RoomsController
