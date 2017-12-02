import React, { Component } from "react";

import { Message } from "./Message.jsx";

export class MessageList extends React.Component {

  render() {

    const messages = this.props.messages.map((message) => {
        return <Message key={message.id} message={ message } color={ this.props.userColor } />
      });

    return (
      <main className="messages">
        { messages }
      </main>
    );
  }
}