import socketIO from 'socket.io'
import { mapValues } from 'lodash'

let io = socketIO(3001)
let lobby = 'Lobby'
//Initially, there are no users, and there is no game
let users = []
let currentGame = null

let startNewGame = () => {
  let NewGame = new Game()
  currentGame = NewGame
  io.sockets.in(lobby).emit('artist', currentGame.artist)
  io.sockets.in(lobby).emit('word', currentGame.word)
  io.sockets.in(lobby).emit('message', {
    body: currentGame.artist.username + ' is going to draw!',
    user: 'Server',
  })
}

function Game() {
  this.artist = users[Math.floor(Math.random() * users.length)]
  this.word = 'Bird'
  this.drawing = []
  this.time = 151
  this.timer = setInterval(() => {
    this.time = this.time - 1
    io.sockets.in(lobby).emit('time', this.time)
    if (this.time === 0) {
      this.endGame()
    }
  }, 1000)
  this.endGame = function() {
    currentGame = null
    clearInterval(this.timer)
    io.sockets.in(lobby).emit('endGame')
    //If there are enough users, start a new game after 5 seconds
    setTimeout(() => {
      io.sockets.in(lobby).emit('clearCanvas')
      if (users.length > 1 && !currentGame) {startNewGame()}
    }, 10000)
  }
  this.calculateScore = function() {
    return this.time
  }
}

let updateUsers = () => {
  io.sockets.in(lobby).emit('newUsers', users)
}

io.on('connection', socket => {
  socket.join(lobby)
  let myUsername = null

  socket.on('draw', drawArgs => {
    if (currentGame) {
      //Add to array to serve the drawing to new joiners
      currentGame.drawing = [...currentGame.drawing, drawArgs]
      socket.broadcast.emit('draw', drawArgs)
    }
  })

  socket.on('addUser', username => {
    users = [...users, {username, score: 0, guessed: false}]
    myUsername = username
    updateUsers()

    //If someone joined and there is no new game, start a new one
    if (!currentGame) {
      if (users.length > 1) {
        startNewGame()
      }
    }
  })

  socket.on('disconnect', data => {
    let index = users.findIndex(el => {
      if (el.username === myUsername) {return true}
    })
    users.splice(index, 1)
    if (users.length < 2) {
      io.sockets.in(lobby).emit('message', {
        body: 'Game is ending!',
        user: 'Server',
      })
      if (currentGame) {
        currentGame.endGame()
        currentGame = null
      }
    }
    updateUsers()
    socket.leave(lobby)
  })

  socket.on('message', message => {
    if (currentGame) {
      //If we guess the word and are not the artist ourselves
      if (message.body === currentGame.word) {
        if (currentGame.artist.username !== myUsername) {
          let index = users.findIndex(el => {
            if (el.username === myUsername) {return true}
          })
          //Update our score (if we havent guessed the word already)
          if (!users[index].guessed) {
            users[index].score = users[index].score + currentGame.calculateScore()
            //We guessed it!
            users[index].guessed = true
            updateUsers()
          }
        }
      }
      else {
        io.sockets.in(lobby).emit('message', {
          body: message.body,
          user: message.user,
        })
      }
    }
    else {
      io.sockets.in(lobby).emit('message', {
        body: message.body,
        user: message.user,
      })
    }
  })
})
