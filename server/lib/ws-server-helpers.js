module.exports = {

  initializeClient: (ws, clients, cb) => {
    randomColor = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
    ws._socket.userColor = randomColor;
    clients.push(ws);
    const newUser = {type: 'newClient', onlineUsers: clients.length};
    cb(newUser);
  },

  broadcastNotification: (newMessage, uuidv4, cb) => {
    newMessage.type = 'incomingNotification';
    newMessage['id'] = uuidv4();
    cb();
  },

  broadcastMessage: (newMessage, uuidv4, ws, cb) => {
    newMessage.type = 'incomingMessage';
    newMessage['id'] = uuidv4();
    newMessage['color'] = ws._socket.userColor;
    cb();
  },

  closeClientConnection: (clients, ws, cb) => {
    const closingClient = clients.filter(client => client.readyState === 3);
    const index = clients.indexOf(closingClient[0]);
    clients.splice(index, 1);
    cb(clients, ws);
  },

  broadcastClientDisconnect: (clients, ws) => {
    const lostUser = {type: 'lostClient', onlineUsers: clients.length};
    clients.forEach((client) => {
      console.log(client.readyState);
      if (client.readyState === 1) {
        client.send(JSON.stringify(lostUser));
      }
    });
  }
}

