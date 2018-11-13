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

// console.log('pub', pub);

let port = process.env.PORT || 3000;

// redis
// adapter.pubClient.on('error', function () {
//   console.log('error on redis pub *+*+*+*')
// });

// adapter.subClient.on('error', function () {
//   console.log('error on redis pub *+*+*+*')
// });




//socket.io
const users = {};
const messages = {};
io.on('connection', socket => {

  //sends online users on connection
  socket.emit('online users', users);
  // pub.hgetall('users', (err, obj) => {
  //   if (err) {
  //     console.log('error getting users', err)
  //   } else {
  //     console.dir(obj)
  //   }
  // })
  // sub.get('users', (err, data) => {
    // if (data) {
    //   console.log('users data from redis', data)
    // }
  // })

  //sends message
  socket.on('chat message', (msg) => {
    console.log('chat msg :', msg);
    pub.rpush('messages', JSON.stringify(msg));
    io.emit('chat message', msg);
  })

  //adds new user on connection
  socket.on('user connected', (username) => {
    
    // console.log('online clients: ', online);
    // console.log('user connected: ', username, 'on socket: ', socket.id);

    //sets socket.username from client provided username string
    socket.username = username;
    //adds a key to users object
    users[socket.id] = username;
    //sends users object to redis
    pub.hmset(`users ${username}`, 'username', JSON.stringify(username), 'socket-id', JSON.stringify(socket.id));
    // console.log('users are: ', users);
    io.emit('user connected', users)
    io.emit('chat message', {user: 'connected', message: `Welcome ${username}!`})
  })

  //updates and emits users on disconnect 
  socket.on('disconnect', () => {
    // console.log('disconnected socket ', socket.id)
    // console.log('users disconnected 1', users, 'online sockets: ', online);

    //gets username of disconnected socket
    username = socket.username;
    //deletes user
    delete users[socket.id]
    // io.sockets.connected[socket.id].disconnect()
    // console.log('user disconnected 2', users, 'online sockets: ', online);
    // pub.hdel(`users ${username}`, JSON.stringify(users));
    socket.emit('user disconnected', users)
    if (username) {
      io.emit('chat message', {user: 'disconnected', message:`Goodbye ${username}!`})
    }
  })
})



//next.js
nextApp.prepare().then(() => {

  app.get('*', (req, res) => {
    return nextHandler(req, res);
  })

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`>> Listening on http://localhost:${port}`)
  })
})