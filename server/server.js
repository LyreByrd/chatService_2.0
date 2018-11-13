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

// const redis = require('socket.io-redis');
// io.adapter(redis({ host: REDIS_HOST, port: REDIS_PORT }));

const redis = require('redis').createClient;
const adapter = require("socket.io-redis");

const pub = redis(REDIS_PORT, REDIS_HOST, { auth_pass: REDIS_PASS });
const sub = redis(REDIS_PORT, REDIS_HOST, { auth_pass: REDIS_PASS });
io.adapter(adapter({ pubClient: pub, subClient: sub }));

// console.log('adapter', adapter);

let port = process.env.PORT || 3000;

//redis
adapter.pubClient.on('error', function () {
  console.log('error on redis pub *+*+*+*')
});

adapter.subClient.on('error', function () {
  console.log('error on redis pub *+*+*+*')
});



//socket.io
const users = []
io.on('connection', socket => {
  // console.log('io clients ', io.engine.clients)
  const online = Object.keys(io.engine.clients);
  socket.emit('online users', users);
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  })

  socket.on('user connected', (username) => {
    console.log('online clients: ', online);
    console.log('user connected: ', username, 'on socket: ', socket.id);
    users.push([username, socket.id]);
    console.log('users are: ', users);
    io.emit('user connected', users)
  })



  socket.on('disconnect', () => {
    console.log('user disconnected', online);
    io.emit('user disconnected')
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