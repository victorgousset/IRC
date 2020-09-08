const app = require('express')();
const http = require('http').createServer(app);
const cookieSession = require('cookie-session')
const readline = require('readline');
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const fs = require("fs");
const io = require("socket.io")(http, {
  transports: ["websocket", "polling"]
});

let users = {};
let channel = [];

  io.on("connection", client => {
    client.on("username", username => {
      const user = {
        name: username,
        id: client.id
      };
      users[client.id] = user;
      io.emit("connected", user);
      io.emit("users", Object.values(users));
      io.emit("message", {
        text: user.name + " a rejoint la room",
        date: new Date().toISOString(),
        user: users[client.id]
      })
    });

    client.on("send", message => {
      io.emit("message", {
        text: message,
        date: new Date().toISOString(),
        user: users[client.id]
      });
      client.on("newUsername", newUsername => {
        const user = {
          name: newUsername,
          id: client.id
        }
        users[client.id] = user;
        io.emit("users", Object.values(users));
      })
      client.on("newChannel", newChannel => {
        channel.push(newChannel)
        console.log(channel)
      })
    });
  });

  io.on('CreateChannel', ChannelName => {
    console.log(ChannelName)
  })


http.listen(4242, () => {
  console.log("listening on 4242");
});
