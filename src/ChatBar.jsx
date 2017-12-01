import React, {Component} from 'react';

export class ChatBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      content: ''
    };
    this.onSend = this.onSend.bind(this);
    this.nameChange = this.nameChange.bind(this);
  }

  onSend(event) {
    if (event.charCode == 13) {
      this.messageData = {
        content: event.target.value,
        username: event.target.previousSibling.value
      }
      this.props.onSend(this.messageData);
      event.target.value = "";
    }
  }

  nameChange(event) {

    if (event.charCode == 13) {
      this.newName = event.target.value;
      this.props.nameChange(this.newName);
    }
  }

  render() {

    return (
      <footer className="chatbar">
        <input onKeyPress={ this.nameChange } className="chatbar-username" placeholder="Your Name (Optional)" defaultValue={ this.props.currentUser } />
        <input onKeyPress ={ this.onSend } className="chatbar-message" placeholder="Type a message and hit ENTER" />
      </footer>
    );
  }
}