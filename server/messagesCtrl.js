let allMessages = [];

module.exports = {
  getAllMessages: (req, res) => {
    res.status(200).send(allMessages);
  },
  createMessage: (req, res) => {
    let newMessage = {
      username: req.body.username,
      message: req.body.message
    };
    allMessages.push(newMessage);
    res.status(200).send(allMessages);
  }
};
