<img src="https://s3.amazonaws.com/devmountain/readme-logo.png" width="250" align="right">

# Project Summary

In this project, we will be creating a chat application that will use sessions and custom middleware.

## Setup

- Fork and clone this repository.
- `cd` into the project.
- Run `npm install`.

## Step 1

### Summary

In this step, we'll use `npm` to install `express` and `dotenv` and set up our server file.

### Instructions

- Run `npm install express dotenv`.
- Create a folder called `server`. Within the `server` folder, create the `index.js` file.
- Create a `.env` file in the root folder of your project. Add the property `SERVER_PORT` to your `.env` file and assign it the value of `3005`
- Set up your server file using `express`, `express.json` middleware, and listening on a port.
  - Don't forget to configure `dotenv` to use with your session secret and include your `.env` file in your `.gitignore`.

### Solution

<details>

<summary> <code> server/index.js </code> </summary>

```js
require("dotenv").config();
const express = require("express");

let { SERVER_PORT } = process.env;

const app = express();

app.use(express.json());

app.listen(SERVER_PORT, () => {
  console.log(`Server listening on port ${SERVER_PORT}.`);
});
```

</details>

<details>

<summary><code> .env </code></summary>

```
SERVER_PORT = 3005
```

</details>

## Step 2

### Summary

In this step, we will set up the `proxy` so that all non text/html requests are forwarded on to our node/express server. We'll also set up the `main` property so you can easily start your server with `nodemon`.

### Instructions

- Open your `package.json` file.
- Add the following line.
  - `"proxy": "http://localhost:3005"`
- Add the following line.
  - `"main": "server/index.js"`

### Solution

<details>

<summary> <code> package.json </code> </summary>

```js
...

  "main": "./server/index.js",
  "proxy": "http://localhost:3005"
}
```

</details>

## Step 3

### Summary

In this step, we will set up needed endpoints and create a controller file.

### Instructions

- Create a file called `messagesCtrl.js` in the `server` folder.
- Create a variable called `allMessages`, which is an empty array.
- Export an object using `module.exports`.
  - Add a method called `getAllMessages` that responds with the `allMessages` variable.
- Create a GET endpoint with a path of `/api/messages` and use the `getAllMessages` method as the callback.
  - Don't forget to require the controller file.
- Add another method to the controller file called `createMessage`.
  - A username and message will be sent in the body of the request. Create a new message object with the `username` and `message` properties. Push the new message object into the `allMessages` array.
  - Respond with the updated `allMessages` array.
- Create a POST endpoint with a path of `/api/message` and use the `createMessage` method as the callback.

### Solution

<details>

<summary> <code> index.js </code> </summary>

```js
require("dotenv").config();
const express = require("express");
const messagesCtrl = require("./messagesCtrl");

let { SERVER_PORT } = process.env;

const app = express();
app.use(express.json());

app.get("/api/messages", messagesCtrl.getAllMessages);
app.post("/api/message", messagesCtrl.createMessage);

app.listen(SERVER_PORT, () => {
  console.log(`Server listening on port ${SERVER_PORT}.`);
});

```

</details>

<details>
<summary> <code> messagesCtrl.js </code> </summary>

```js
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
    res.status(200).send(allMessages);
  }
};
```

</details>

## Step 4

### Summary

In this step, we will start making HTTP requests, from our react app to our node/express server, so that we can

1.  get all messages and display them
2.  create a new message

### Instructions

- Open `App.js` and import `axios` at the top of the file.
- Add the `componentDidMount` lifecycle method and make a GET request to your node/express api
  - path: `'/api/messages'`
  - Set state with the response. Update the `allMessages` property on state.
- Find the `createMessage` method and make a post request. Send `this.state.username` and `this.state.message` in the body of the request. Use `username` and `message` property names.
  - path: `'/api/message'`
  - body: `{username: this.state.username, message: this.state.message}`
- Set state with the response (which will be the updated array messages from the server)
  - Update the `allMessages` property.

### Solution

<details>

<summary> <code> App.js </code> </summary>

```js
...
  componentDidMount() {
    axios.get('/api/messages').then(res => {
      this.setState({ allMessages: res.data });
    });
  }

  createMessage() {
    axios
      .post("/api/message", {
        username: this.state.username,
        message: this.state.message
      })
      .then(res => {
        this.setState({
          allMessages: res.data
        });
      });
  }
...
```

</details>

## Step 5

### Summary

In this step, we will set up sessions using the `express-session` library. By using sessions, we will be able to keep track of a message history for each user on our app.

At this point, you should have a working app where you can save your username and send messages.

### Instructions

- Run `npm i express-session`;
- This library is middleware. We need to configure sessions using the built-in express method `app.use()`;
- At the top of `index.js`, require in the library
  - `const session = require('express-session');`
  - In the `.env` file, add a property called `SESSION_SECRET` with an associated value. In the `index.js` file, destructure this value from the `process.env` object.
- Configure this top level middleware like this:
  ```js
  app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60
    }
  }))
  ```
  - **secret**: The session secret will add a basic layer of security.
  - **resave**: Forces the session to be saved back to the session store, even if the session was never modified during the request (info from docs).
  - **saveUninitialized**: Forces a session that is "uninitialized" to be saved to the store. A session is uninitialized when it is new but not modified (info from docs).
   - **cookie**: Allows us to customize the seesion cookie. Here we are setting the maximum age of the cookie to 1 hour (*1000* milliseconds in a second, *60* seconds in a minutes, *60* minutes in one hour)

### Solution

<details>

<summary> <code> index.js </code> </summary>

```js
require("dotenv").config();
const express = require("express");
const messagesCtrl = require("./messagesCtrl");
const session = require("express-session");

let { SERVER_PORT, SESSION_SECRET } = process.env;

const app = express();

app.use(express.json());
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

...
```

</details>

<details>

<summary><code>.env</code></summary>

```
SERVER_PORT = 3005
SESSION_SECRET = jfdfjkdslajfdsksuperdupersecretfdjskalfjdsaweifj
```

</details>

## Step 6

### Summary

In this step, we will use sessions to create a message history.

### Instructions

- In the `messagesCtrl.js` file, find the `createMessage` method. We are currently taking all messages that are sent to the server and storing them in the `allMessages` array. In addition to this, we will use the user's current session to store all the messages from the user.
- To access session data, just use the property `req.session`. `req.session` is an object that we can use to store whatever we want. In this case, we want to add a property called `history` that will be an array.
  - _NOTE_: Remember, we have access to the `req.session` object because we are using the `express-session` library.
- We need to initialize the `req.session.history` property if it doesn't already exists on the `req.session` object. Then push the new message object into the `req.session.history` array.

  ```js
    if (req.session.history) {
      req.session.history.push(newMessage);
    } else {
      req.session.history = [];
      req.session.history.push(newMessage);
    }  
  ```

### Solution

<details>

<summary> <code> messagesCtrl.js </code> </summary>

```js
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
  }
};
```

</details>

## Step 7

### Summary

In this step, we will display the user's message history in history modal.

### Instructions

- In the `HistoryModal.js` file, import `axios` and find the `componentDidMount` method.
  - Make a GET request to fetch the message history for the user.
    - path: `'/api/messages/history'`
    - Update the `historyMessages` property with the response.
- Since we don't have an endpoint for the above request, let's go create one.
  - In the `index.js` file, add a GET endpoint with a path of `'/api/messages/history'`.
  - Add a method named `history` to the messages controller.
    - `history` should return all the messages stored on the session.

### Solution

<details>

<summary> <code> HistoryModal.js </code> </summary>

```js
import React, { Component } from 'react';
import axios from 'axios';
import './HistoryModal.css';

export default class HistoryModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      historyMessages: []
    };
  }
  componentDidMount() {
    axios.get("/api/messages/history").then(res => {
      this.setState({
        historyMessages: res.data
      });
    });
  }

...
```

</details>
<details>

<summary> <code> index.js </code> </summary>

```js
...

app.get("/api/messages", messagesCtrl.getAllMessages);
app.get("/api/messages/history", messagesCtrl.history);
app.post("/api/message", messagesCtrl.createMessage);

app.listen(SERVER_PORT, () => {
  console.log(`Server listening on port ${SERVER_PORT}.`);
});

```

</details>
<details>

<summary> <code> messagesCtrl.js </code> </summary>

```js
...
  history: (req, res) => {
    res.status(200).send(req.session.history);
  }
};
```

</details>

## Step 8

### Summary

In this step, we will add in custom middleware. Sometimes you just cannot trust some of the potty mouth people out there in the world. We are going to create middleware that will filter out bad words from our users' messages.

### Instructions

- In `index.js`, add in some top level, custom middleware. If there is a `message` property on the body, write some filter logic to make sure that bad words are removed. Below is an example, but there are different ways to accomplish this.

  - _Note_: the example below is using a regular expression. Regular expressions are patterns used to match character combinations in strings. The regular expression below is searching for our bad words using the 'g' flag, which searches the string gloabally for all instances of our bad words...then replaces them with '\*\*\*\*'.

```js
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
```

## Contributions

If you see a problem or a typo, please fork, make the necessary changes, and create a pull request so we can review your changes and merge them into the master repo and branch.

## Copyright

© DevMountain LLC, 2019. Unauthorized use and/or duplication of this material without express and written permission from DevMountain, LLC is strictly prohibited. Excerpts and links may be used, provided that full and clear credit is given to DevMountain with appropriate and specific direction to the original content.

<p align="center">
<img src="https://s3.amazonaws.com/devmountain/readme-logo.png" width="250">
</p>
