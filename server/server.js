const axios = require('axios')
const next = require('next')
const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({
  dev
})
const nextHandler = nextApp.getRequestHandler()

let port = 3000;

io.on('connection', socket => {
  console.log('IO connected');
  // socket.emit({
  //   message: 'Welcome to LyreByrd'
  // })
  socket.on('chat message', (msg) => {
    console.log('message: ', msg);
    io.emit('chat message', msg);
  })
})

nextApp.prepare().then(() => {

  app.get('*', (req, res) => {
    return nextHandler(req, res);
  })

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`*=* Listening on http://localhost:${port} *=*`)
  })
})