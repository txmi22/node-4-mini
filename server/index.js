require('dotenv').config();
const express = require('express');
      session = require('express-session'),
      {SERVER_PORT, SESSION_SECRET} = process.env,
      ctrl = require('./messagesCtrl'),
      app = express();
      
app.use(express.json());
app.use(session({
    resave: false,
    saveUninitiliazed: false,
    secret: SESSION_SECRET,
    cookie: {maxAge: 1000 * 60 * 60}
}));

app.use((req, res, next) => {
    let badWords = ['knucklehead', 'jerk', 'internet explorer'];
    if (req.body.message) {
      for (let i = 0; i < badWords.length; i++) {
        let regex = new RegExp(badWords[i], 'g');
        req.body.message = req.body.message.replace(regex, '****');
      }
      next();
    } else {
      next();
    }
  });

//ENDPOINTS
app.get('/api/messages', ctrl.getAllMessages);
app.post('/api/message', ctrl.createMessage);

app.get('/api/messages/history', ctrl.history)
      
const port = SERVER_PORT;
app.listen(port, () => console.log(`Server on ${port}`));