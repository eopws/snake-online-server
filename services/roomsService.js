const roomsModel = require('../models/roomsModel');

class RoomsService {
    onGetRooms(req, res) {
        const rooms   = roomsModel.getAllRooms();
        const roomIds = [];

        for (let roomId in rooms) {
            roomIds.push(roomId);
        }

        return res.json(roomIds);
    }
}

module.exports = new RoomsService;
