const connectionService = require('../services/connectionService')

class ConnectionController {
    onConnection(connectionDetails, socket) {
        connectionService.onConnection(connectionDetails, socket)
    }

    onDisconnection(socket) {
        connectionService.onDisconnection(socket)
    }
}

module.exports = new ConnectionController
