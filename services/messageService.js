const playersModel = require('../models/playersModel')

class MessageService {
    onChangeDirection(newDirection, socket) {
        const player = playersModel.getPlayerDataBySocket(socket);

        const currentDirection = player.direction;

        switch (newDirection) {
            case 1: // up
                if (currentDirection !== 3)
                    player.direction = newDirection;
                break;

            case 2: // right
            if (currentDirection !== 4)
                player.direction = newDirection;
                break;

            case 3: // down
            if (currentDirection !== 1)
                player.direction = newDirection;
                break;

            case 4: // left
            if (currentDirection !== 2)
                player.direction = newDirection;
                break;
        }
    }
}

module.exports = new MessageService
