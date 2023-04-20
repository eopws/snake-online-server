const gameLoopService = require('../services/gameLoopService')

class GameLoopController {
    iterate() {
        gameLoopService.iterate();
    }
}

module.exports = new GameLoopController
