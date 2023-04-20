const messageService       = require('../services/messageService');
const connectionController = require('./connectionController')

class MessageController {
    onMessage(message, socket) {
        switch (message.type) {
            case 'changeDirection': {
                messageService.onChangeDirection(message.data, socket);
                break;
            }

            case 'connection': {
                connectionController.onConnection(message.data, socket);
            }
        }
    }
}

module.exports = new MessageController
