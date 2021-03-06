import React, {Component} from 'react';

import { ChatBar } from "./ChatBar.jsx";
import { MessageList } from "./MessageList.jsx";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentUser: '',
      onlineUsers: 0,
      messages: []
    };

    this.onNewMessage = this.onNewMessage.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    const ws = null;
  }

  onNewMessage(content) {
    if (!content.username) { content.username = 'Anonymous' };
    content['type'] = 'postMessage';
    this.ws.send(JSON.stringify(content));
  }

  onNameChange(name) {
    const nameChange = {type: 'postNotification', notification: `${this.state.currentUser} has changed their name to ${name}` }
    this.setState({ currentUser: name});
    this.ws.send(JSON.stringify(nameChange));
  }

  componentDidMount() {
    this.ws = new WebSocket('ws://localhost:3001');
    this.ws.addEventListener('open', () => {
    });
    this.ws.addEventListener('message', (msg) => {
      const newMessage = JSON.parse(msg.data);

      switch (newMessage.type) {
        case 'incomingMessage':
          this.setState({ messages: this.state.messages.concat(newMessage)});
          break;
        case 'incomingNotification':
          this.setState({ messages: this.state.messages.concat(newMessage)});
          break;
        case 'newClient':
          this.setState({ onlineUsers: newMessage.onlineUsers });
          break;
        case 'lostClient':
          this.setState({ onlineUsers: newMessage.onlineUsers });
      }
    });
  }

  render() {

    const {currentUser, messages, onlineUsers, userColor} = this.state;

    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
          <p className="online-users">{onlineUsers} users online</p>
        </nav>
        <MessageList messages= { messages }/>
        <ChatBar currentUser= { currentUser } onSend={ this.onNewMessage } nameChange={ this.onNameChange } />
      </div>
    );
  }
}

export default App;