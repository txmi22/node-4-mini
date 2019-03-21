let allMessages = [];

module.exports = {
  getAllMessages: (req, res) => {
    res.status(200).send(allMessages);
  },
  createMessage: (req, res) => {
    const { username, message } = req.body;
    let newMessage = {
      username,
      message
    };
    allMessages.push(newMessage);

    if (req.session.history) {
      req.session.history.push(newMessage);
    } else {
      req.session.history = [];
      req.session.history.push(newMessage);
    }
    res.status(200).send(allMessages);
  },
  history: (req, res) => {
    res.status(200).send(req.session.history);
  }
};
