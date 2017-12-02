const express       = require('express');
const uuidv4        = require('uuid/v4');
const SocketServer  = require('ws').Server;
const serverHelpers = require('./lib/ws-server-helpers.js');

const PORT = 3001;

const server = express()
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));


const clients = [];
const wss = new SocketServer({ server });

wss.on('connection', (ws) => {
  serverHelpers.initializeClient(ws, clients, (newUser) => {
    clients.forEach((client) => {
      if(client.readyState === 1) {
        client.send(JSON.stringify(newUser));
      }
    });
  });

  ws.on('message', function incoming(message) {
    const newMessage = JSON.parse(message);

    switch (newMessage.type) {
      case 'postNotification':
        serverHelpers.broadcastNotification(newMessage, uuidv4, () => {
          clients.forEach((client) => {
            if(client.readyState === 1) {
              client.send(JSON.stringify(newMessage));
            }
          });
        });
        break;
      case 'postMessage':
        serverHelpers.broadcastMessage(newMessage, uuidv4, ws, () => {
          clients.forEach((client) => {
            if(client.readyState === 1) {
              client.send(JSON.stringify(newMessage));
            }
          });
        });
    }

  });

  ws.on('close', (event) => {
    serverHelpers.closeClientConnection(clients, ws, serverHelpers.broadcastClientDisconnect);
  });
});