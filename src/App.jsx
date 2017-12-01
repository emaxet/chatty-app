import React, {Component} from 'react';

import { ChatBar } from "./ChatBar.jsx";
import { MessageList } from "./MessageList.jsx";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentUser: 'Erik',
      userColor: '#000000',
      nameChange: '',
      onlineUsers: 0,
      messages: [],
      notifications: []
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
    const nameChange = {type: 'postNotification', content: `${this.state.currentUser} has changed their name to ${name}` }
    this.setState({ currentUser: name});
    this.ws.send(JSON.stringify(nameChange));
  }

  componentDidMount() {
    this.ws = new WebSocket('ws://localhost:3001');
    this.ws.addEventListener('open', () => {
    });
    this.ws.addEventListener('message', (msg) => {
      const newMessage = JSON.parse(msg.data);
      if (newMessage.type === 'incomingMessage') {
        newMessage['color'] = this.state.userColor;
        this.setState({ messages: this.state.messages.concat(newMessage)});
      } else if (newMessage.type === 'incomingNotification') {
        this.setState({ notifications: this.state.notifications.concat(newMessage)});
      } else if (newMessage.type === 'newClient') {
        this.setState({ onlineUsers: newMessage.onlineUsers, userColor: newMessage.userColor });
      } else if (newMessage.type === 'lostClient') {
        this.setState({ onlineUsers: newMessage.onlineUsers });
      }
    });
  }

  render() {

    const {currentUser, messages, notifications, onlineUsers, userColor} = this.state;

    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
          <p className="online-users">{onlineUsers} users online</p>
        </nav>
        <MessageList messages= { messages } userColor={ messages.color } nameChange={ notifications } />
        <ChatBar currentUser= { currentUser } onSend={ this.onNewMessage } nameChange={ this.onNameChange } />
      </div>
    );
  }
}

export default App;