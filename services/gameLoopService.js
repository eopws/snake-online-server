const playersModel = require('../models/playersModel');
const applesModel = require('../models/applesModel');
const roomsModel = require('../models/roomsModel');
const randomInt = require('../utils/randomizer');
const config   = require('../gameConfig');

class GameLoopService {
    iterate() {
        for (const roomId in roomsModel.getAllRooms()) {
            const playersInRoom = roomsModel.getPlayersInRoom(roomId);
            const players       = [];
            const playerSockets = [];

            for (let playerSocket of playersInRoom) {
                // socket is converted to a string
                players.push(playersModel.getPlayerDataBySocket(playerSocket));
                playerSockets.push(playerSocket);
            }

            for (const playerIndex in players) {
                const playerSocket = playerSockets[playerIndex];
                const player       = players[playerIndex];

                this._updatePlayerPosition(player);

                player.trail.push({x: player.px, y: player.py, color: config.pc});

                // limiter
                if (player.trail.length > player.trailLength) {
                    player.trail.shift();
                }

                // eaten
                if (player.trail.length > player.trailLength) {
                    player.trail.shift();
                }

                // self collision check
                if (this._checkSelfCollision(player) && player.trail.length === player.trailLength) {
                    player.trailLength = 10;

                    for (let i = 0; i < player.trail.length; i++) {
                        player.trail[i].color = 'red';
                    }
                }

                const collidedPlayer = this._checkOtherPlayersCollision(player, players);

                if (collidedPlayer) {
                    collidedPlayer.trailLength = 10;
                    player.trailLength = 10;

                    const longestTrail = Math.max(collidedPlayer.trail.length, player.trail.length);

                    for (let i = 0; i < longestTrail; i++) {
                        if (player.trail[i])
                            player.trail[i].color = 'red';

                        if (collidedPlayer.trail[i])
                            collidedPlayer.trail[i].color = 'red';
                    }
                }

                const apples = applesModel.getAllApples(roomId);

                for (let i = 0; i < apples.length; i++) {
                    const apple = apples[i];

                    if (
                        player.px < (apple.x + config.pw)
                        && player.px + config.pw > apple.x
                        && player.py < (apple.y + config.ph)
                        && player.py + config.ph > apple.y
                    ) {
                        applesModel.deleteApple(i, roomId);
                        player.trailLength += 20;
                    }
                }

                if (apples.length < 50) {
                    const apple = this._spawnApple();
                    applesModel.addApple(apple, roomId);
                }

                const message = {
                    type: 'loop',
                    data: {
                        players,
                        apples,
                    }
                }

                playerSocket.send(JSON.stringify(message));
            }
        }
    }

    _checkOtherPlayersCollision(playerToCheck, players) {
        for (let playerId in players) {
            if (players[playerId] === playerToCheck) {
                continue;
            }

            const player = players[playerId];

            for (let part of player.trail) {
                if (
                    playerToCheck.px < (part.x + config.pw)
                    && playerToCheck.px + config.pw > part.x
                    && playerToCheck.py < (part.y + config.ph)
                    && playerToCheck.py + config.ph > part.y
                ) {
                    return player;
                }
            }
        }

        return null;
    }

    _checkSelfCollision(player) {
        const trail      = player.trail;
        const { px, py } = player;

        for (let i = trail.length - 20; i >= 0; i--) {
            if (
                px < (trail[i].x + config.pw)
                && px + config.pw > trail[i].x
                && py < (trail[i].y + config.ph)
                && py + config.ph > trail[i].y
            ) {
                return true;
            }
        }

        return false;
    }

    _updatePlayerPosition(player) {
        const velocity = player.velocity;

        switch (player.direction) {
            case 1: // up
                player.py -= velocity;
                break;
    
            case 2: // right
                player.px += velocity;
                break;
    
            case 3: // down
                player.py += velocity;
                break;
    
            case 4: // left
                player.px -= velocity;
                break;
        }

        // X coord teleport
        if (player.px > config.worldW) {
            player.px = 0;
        } else if (player.px < 0) {
            player.px = config.worldW;
        }

        // Y coord teleport
        if (player.py > config.worldH) {
            player.py = 0;
        } else if (player.py < 0) {
            player.py = config.worldH;
        }
    }

    _spawnApple() {
        return {
            x: randomInt(config.aw, config.worldW) - config.aw,
            y: randomInt(config.ah, config.worldH) - config.ah,
            color: config.ac
        };
    }
}

module.exports = new GameLoopService
