require('dotenv').config()
const next = require('next')
const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({dev})
const nextHandler = nextApp.getRequestHandler()

const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT;
const REDIS_PASS = process.env.REDIS_PASS;

// // const redis = require('socket.io-redis');
// // io.adapter(redis({ host: REDIS_HOST, port: REDIS_PORT }));

const redis = require('redis').createClient;
const adapter = require("socket.io-redis");

const pub = redis(REDIS_PORT, REDIS_HOST, { auth_pass: REDIS_PASS });
const sub = redis(REDIS_PORT, REDIS_HOST, { auth_pass: REDIS_PASS });
io.adapter(adapter({ pubClient: pub, subClient: sub }));

let port = process.env.PORT || 8000;

//socket.io
// const users = {};
// rooms = [];
// const messages = {};
io.on('connection', socket => {

  //joins room and sets room on socket
  socket.on('join room', room => {
    socket.room = room;
    socket.join(room);
  })

  //on new user connection
  socket.on('user connected', (username) => {
    console.log('user connected :', username, 'on socket :', socket.id, 'in room :', socket.room);
    
    //sets socket.username from client provided username string
    socket.username = username;

    //pushes to redis users in room list
    pub.lpush(`room_${socket.room}`, socket.username);

    //send all users from room to update client online list
    pub.lrange(`room_${socket.room}`, 0, -1, (err, users) => {
      if (err) { console.log(`error getting users from redis: ${err}`) }
      else {
        io.sockets.in(socket.room).emit('update users', users)
      }
    })

    
    pub.lrange(`messages_${socket.room}`, 0, -1, (err, messages) => {
      if (err) { console.log('error getting messages from redis', err) }
      else {
        // console.log('socket.id', socket.id)
        // console.log('messages from redis on user connect inside pub.lrange', messages);
        socket.emit('fetch messages', [...messages])
        // socket.emit('chat message', messages);
      }
    });
  })

  //sends message
  socket.on('chat message', (msg) => {
    let room = msg.host;
    console.log('chat msg :', msg, 'in room:', room);
    io.sockets.in(room).emit('chat message', [JSON.stringify(msg)]);
    pub.rpush(`messages_${room}`, JSON.stringify(msg));
    pub.ltrim(`messages_${room}`, 0, 99);
  })


  //updates and emits users on disconnect 
  socket.on('disconnect', () => {

    //gets username of disconnected socket
    let username = socket.username;
    let room = socket.room;

    //removes user from room list
    pub.lrem(`room_${room}`, -99, username, (err, data) => {
      if (err) { console.log('error in username removal from room :', err) }
      else { console.log(`user: ${username} disconnected from room: ${room }`) }
    })

    //updates new online users list
    pub.lrange(`room_${room}`, 0, -1, (err, users) => {
      if (users.length > 0) {
        if (err) { console.log('error getting users from redis :', err) }
        else { io.sockets.in(room).emit('user disconnected', users) }
      } else {
        //deletes message data if room is empty
        if (err) { console.log('error getting users from redis :', err) }
        else { pub.del(`messages_${room}`) }
      }
    })

    //disconnects socket from room;
    socket.leave(socket.room);
    socket.room = null;
  })
})




//next.js
nextApp.prepare().then(() => {

  app.get('/chat/getChat', (req, res) => {
    console.log(req);
    res.sendFile('webpack.js', {root: `${__dirname}/../.next/static/runtime/`});
  })

  app.get('*', (req, res) => {
    return nextHandler(req, res);
  })

  

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`>> Listening on http://localhost:${port}`)
  })
})