const express              = require('express');
const ws                   = require('ws');
const connectionController = require('./controllers/connectionController');
const messageController    = require('./controllers/messageController');
const gameLoopController   = require('./controllers/gameLoopController');
const roomsController      = require('./controllers/roomsController');

const cors = require('cors');
const app  = express();
const port = 5001;

app.use(cors());
app.use(express.json());

app.get('/rooms', roomsController.onGetRooms);

app.listen(port, () => {
    console.log(`HTTP server started on port ${port}`)
})

const wss = new ws.Server({
    port: 5000
}, () => console.log('WebSocket server started on port 5000'));

wss.on('connection', function connection(ws) {
    ws.on('message', (message) => {
        message = JSON.parse(message)

        messageController.onMessage(message, ws)
    })

    ws.on('close', () => {
        connectionController.onDisconnection(ws)
    })
})

setInterval(() => gameLoopController.iterate(), 1000 / 60)
