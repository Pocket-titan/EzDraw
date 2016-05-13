'use-strict'
var http = require('http')
var bodyParser = require('body-parser')
var socketIO = require('socket.io')
var webpack = require('webpack')
var express = require('express')
var webpackDevMiddleware = require( 'webpack-dev-middleware')

var webpackConfig = require('../webpack.config.js')

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

app.use(express.static(__dirname + '/production'))
app.use(webpackDevMiddleware(webpack(webpackConfig)))
app.use(bodyParser.urlencoded({ extended: false }))

io.on('connection', socket => {
  socket.on('message', body => {
    socket.broadcast.emit('message', {
      body,
      //TODO: pick username
      from: socket.id.slice(8),
    })
  })
})

server.listen(3001)
