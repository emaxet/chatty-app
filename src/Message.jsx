import React from "react";

import MessageHelper from "./lib/message-helpers.js";

export class Message extends React.Component {

  render() {

    const messageData = MessageHelper.imageFinder(this.props);

    if (!this.props.message.notification) {
      if (Object.keys(messageData).length) {
        return (
          <div>
            <div className="message">
              <span style={{ color: this.props.message.color }} className="message-username">{ this.props.message.username }</span><span className="message-content">{ messageData.content }</span>
            </div>
            <div className="chatImage">
              <img src={ messageData.image } />
            </div>
          </div>
        );
      } else {
        return (
          <div className="message">
            <span style={{ color: this.props.message.color }} className="message-username">{ this.props.message.username }</span><span className="message-content">{ this.props.message.content }</span>
          </div>
        );
      }
    } else {
      return (
        <div className="message system">{ this.props.message.notification }</div>
      );
    }
  }
}