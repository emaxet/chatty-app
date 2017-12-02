const express      = require('express');
const uuidv4       = require('uuid/v4');
const SocketServer = require('ws').Server;

const PORT = 3001;

const server = express()
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));


const clients = [];
const wss = new SocketServer({ server });

wss.on('connection', (ws) => {
  randomColor = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
  ws._socket.userColor = randomColor;
  clients.push(ws);
  const newUser = {type: 'newClient', onlineUsers: clients.length};
  clients.forEach((client) => {
    if (client.readyState === ws.OPEN) {
          client.send(JSON.stringify(newUser));
    }
  });

  ws.on('message', function incoming(message) {
    const newMessage = JSON.parse(message);

    if (newMessage.type === 'postNotification') {
      newMessage.type = 'incomingNotification';
      newMessage['id'] = uuidv4();
      clients.forEach((client) => {
        if (client.readyState === ws.OPEN) {
          client.send(JSON.stringify(newMessage));
        }
      });
    } else if (newMessage.type === 'postMessage') {
      newMessage.type = 'incomingMessage';
      newMessage['id'] = uuidv4();
      newMessage['color'] = ws._socket.userColor;
      clients.forEach((client) => {
        if (client.readyState === ws.OPEN) {
          client.send(JSON.stringify(newMessage));
        }
      });
    }
  });

  ws.on('close', (event) => {

    const closingClient = clients.filter(client => client._socket.destroyed);
    const index = clients.indexOf(closingClient);
    clients.splice(index, 1);
    clients.forEach((client) => {
      const lostUser = {type: 'lostClient', onlineUsers: clients.length};
      if (client.readyState === ws.OPEN) {
        client.send(JSON.stringify(lostUser));
      }
    });
  });
});