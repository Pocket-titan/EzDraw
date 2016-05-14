const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const socketIo = require('socket.io')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackConfig = require('./webpack.config.js')

const app = express()
const server = http.createServer(app)
const io = socketIo(server)

app.use(express.static('./production'))
// app.use(webpackDevMiddleware(webpack(webpackConfig)))
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/', (req, res) => {
  const Body = req.body.Body
  const From = req.body.From
  const message = {
    body: Body,
    from: From.slice(8),
  }
  console.log('message:', message)
  io.emit('message', message)
})

io.on('connection', socket => {
  socket.on('message', body => {
    socket.broadcast.emit('message', {
      body,
      from: socket.id.slice(8),
    })
  })
})

server.listen(3000)
