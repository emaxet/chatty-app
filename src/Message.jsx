import React from "react";

export class Message extends React.Component {
  render() {
    console.log("Rendering <Message/>");
    return (
        <div className="message">
          <span style={{color: this.props.color}} className="message-username">{ this.props.message.username }</span><span className="message-content">{ this.props.message.content }</span>
        </div>
    );
  }
}