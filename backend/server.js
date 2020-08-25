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


/*
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cookieSession = require('cookie-session')
const readline = require('readline');
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const fs = require("fs");

app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(cookieParser());

let room = ['channel1']
let count = 0;
let $ipsConnected = [];

io.on('connection', function (socket) {
  let $ipAddress = socket.handshake.address;

  socket.emit('room', {room: room})

  socket.on('create', function(room) {
    socket.join(room);
  });

  if (!$ipsConnected.hasOwnProperty($ipAddress)) {
    $ipsConnected[$ipAddress] = 1;
    count++;
    socket.emit('counter', {count: count});
  }
  console.log("client is connected");
  socket.on('disconnect', function () {
    if ($ipsConnected.hasOwnProperty($ipAddress)) {
      delete $ipsConnected[$ipAddress];
      count--;
      socket.emit('counter', {count: count});
    }
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html', '');
  console.log(io.sockets.rooms)
})

app.get('/channel1', (req, res) => {
  res.render('channel1')

    //socket.on()
});

app.post('/create_channel', (req, res) => {
  let channelName = req.body.channel_name
  room.push(channelName)
  res.redirect('/')
})

app.get('/room/:room', (req, res) => {
  let room = '/' + req.params.room
  /*io.of(room).on('connection', function (socket) {
    socket.broadcast.emit('teeeeeeee')
  });
  io.sockets.in();
})


http.listen(4242, () => {
  console.log('listening on 4242');
});
*/

