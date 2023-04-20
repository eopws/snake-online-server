

class ApplesModel {
    constructor() {
        this._apples = {};
    }

    addApple(appleInfo, roomId) {
        if (!appleInfo.x || !appleInfo.y || !appleInfo.color) {
            return false;
        }

        if (!this._apples[roomId]) {
            this._apples[roomId] = [];
        }

        this._apples[roomId].push(appleInfo);
    }

    getAllApples(roomId) {
        return this._apples[roomId] ?? [];
    }

    deleteApple(index, roomId) {
        this._apples[roomId]?.splice(index, 1);
    }
}

module.exports = new ApplesModel
