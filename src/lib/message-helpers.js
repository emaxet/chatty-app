module.exports = {
  imageFinder: function(props) {
    const messageData = {};
    if (props.message.content){
      const imageRE = /(.png|.jpg|.gif|.jpeg)/;
      const array = props.message.content.split(" ");
      array.forEach((word) => {
        if (imageRE.test(word)) {
          const index = array.indexOf(word);
          array.splice(index, 1);
          messageData['content'] = array.join(" ");
          messageData['image'] = word;
        }
      });
  }
  return messageData;
  }
}
