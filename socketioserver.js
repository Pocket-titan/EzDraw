import socketIO from 'socket.io'
import { map } from 'lodash'

let io = socketIO(3001)
let lobby = 'Lobby'
//Initially, there are no users, and there is no game
let users = []
let currentGame = null

let updateUsers = () => {
  io.sockets.in(lobby).emit('newUsers', users)
}

let sortUsers = () => {
  users.sort((a,b) => {
    return a.score > b.score ? -1 : 1
  })
  let newUsers = map(users, user => {
    let index = users.findIndex(userInArr => {
      if (userInArr === user) {return true}
    })
    return {...user, position: index + 1}
  })
  users = newUsers
  updateUsers()
}

let startNewGame = () => {
  let NewGame = new Game()
  currentGame = NewGame
  io.sockets.in(lobby).emit('artist', currentGame.artist)
  io.sockets.in(lobby).emit('word', currentGame.word)
  io.sockets.in(lobby).emit('message', {
    body: currentGame.artist.username + ' is going to draw!',
    user: 'Server',
    style: {color: 'red'},
  })
  let artistIndex = users.findIndex(user => user.username === currentGame.artist.username)
  users[artistIndex].artist = true
  updateUsers()
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
    io.sockets.in(lobby).emit('message', {
      body: 'Game is ending!',
      user: 'Server',
      style: {color: 'red'},
    })
    currentGame = null
    clearInterval(this.timer)
    io.sockets.in(lobby).emit('endGame')
    //If there are enough users, start a new game after 5 seconds
    setTimeout(() => {
      io.sockets.in(lobby).emit('clearCanvas')
      //Set guessed and artist of everyone to false
      users = map(users, user => {
        return { ...user, guessed: false, artist: false }
      })
      updateUsers()
      if (users.length > 1 && !currentGame) {startNewGame()}
    }, 10000)
  }
  this.calculateScore = function() {
    return this.time
  }
}

io.on('connection', socket => {
  socket.join(lobby)
  let myUsername = null

  socket.on('draw', drawArgs => {
    if (currentGame) {
      //Add to array to serve the drawing to new joiners
      // saving the drawing is too performance-heavy
      // currentGame.drawing = [...currentGame.drawing, drawArgs]
      socket.broadcast.emit('draw', drawArgs)
    }
  })

  socket.on('addUser', username => {
    users = [...users, {username, score: 0, guessed: false, position: users.length + 1, artist: false }]
    myUsername = username
    updateUsers()

    //Serve the new user our currentGame info, if there is a game
    if (currentGame) {
      socket.emit('word', currentGame.word)
      // saving the drawing is too performance-heavy
      // socket.emit('draw', currentGame.drawing)
    }

    //If someone joined and there is no new game, start a new one (after 10sec to not interfere with perhaps existing timeout)
    if (!currentGame) {
      setTimeout(() => {
        if (users.length > 1) {
          startNewGame()
        }
      }, 10000)
    }
  })

  socket.on('disconnect', data => {
    let index = users.findIndex(el => {
      if (el.username === myUsername) {return true}
    })
    if (index !== -1) {users.splice(index, 1)}
    sortUsers()
    if (users.length < 2) {
      if (currentGame) {
        currentGame.endGame()
      }
    }
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
            socket.emit('showWord', currentGame.word)
            //Let them know, this will give them a star
            sortUsers()
            //If everyone guessed it, terminate the game
            if (users.filter(user => user.guessed).length === users.length - 1) {
              currentGame.endGame()
            }
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
