import { map } from 'lodash'
import fs from 'fs'
import socketIO from 'socket.io'

console.log('trying to run server...')

// Local server to test: run "npm run server"
let io = socketIO(process.env.PORT || 3040)

let rooms = []
// Users is only used to check for existing usernames
let users = []
let lobby = 'Lobby'
let words = fs.readFileSync('./words.txt', 'utf8').split('\n')

// Game logic

// Getting a random word for a Game
let getRandomWord = () => {
  let randomWord = words[ Math.floor(Math.random() * words.length) ]
  return randomWord
}

// Rank the users
let rankUsers = xs =>
  xs.slice()
  .sort((a,b) => b.score - a.score)

// Creating a new game
let createNewGame = (players, artist) => {
  let Game = {
    time: 90,
    players,
    scoreFactor: 1,
    lettersGiven: [],
    word: getRandomWord(),
    artist: artist,
  }
  return Game
}

io.on('listening', () => {
  console.log('Server accepting connections')
})

io.on('connection', socket => {
  //Autojoin lobby, a general purpose room for creating & joining a room
  socket.join(lobby)

  // Choose username
  socket.on('approveUsername', newUsername => {
    let index = users.map(user => user.username).findIndex(username => username === newUsername)

    // If no user exists with this username, approve it
    if (index === -1) {
      //Emit them their approved username and the current rooms
      socket.emit('usernameApproved', newUsername)
      updateUsers()
      let newUser = {
        username: newUsername,
      }
      socket.user = newUser
      users = [...users, newUser]
    }
    // If there is a user with that username, disapprove it
    else {
      socket.emit('usernameDisapproved')
    }
  })

  // Update the users in the lobby
  let updateUsers = () => {
    io.sockets.in(lobby).emit('rooms', rooms)
    rooms.forEach(room => {
      let sortedUsers = rankUsers(room.users)
      room.users = sortedUsers
      io.sockets.in(room.roomName).emit('users', room.users)
    })
  }

  // Joining a room
  let joinRoom = newRoomName => {
    let newRoomIndex = rooms.map(room => room.roomName).findIndex(roomName => roomName === newRoomName)
    let newRoom = rooms[newRoomIndex]
    socket.join(newRoom.roomName)
    socket.roomName = newRoom.roomName
    let roomUser = {
      ...socket.user,
      score: 0,
      guessed: false,
    }
    newRoom.users = [...newRoom.users, roomUser]
    updateUsers()
  }

  // Getting a random letter as a hint
  let giveRandomLetter = (roomName, game) => {
    //We store the indexes of the given letters in an array, and here we filter out the indexes
    //of the letters we have already given
    let wordIndexes = map(game.word, (letter, index) => index)
    let unguessedIndexes = wordIndexes.filter(letterIndex => {
      let indexInGuessed = game.lettersGiven.findIndex(givenLetterIndex => letterIndex === givenLetterIndex)
      //If its not in lettersGiven, keep it, otherwise discard it
      return indexInGuessed === -1 ? true : false
    })
    let randomLetterIndex = unguessedIndexes[Math.floor(Math.random() * unguessedIndexes.length)]
    return randomLetterIndex
  }

  // Create a room
  socket.on('approveRoomName', newRoomName => {
    let index = rooms.map(room => room.roomName).findIndex(roomName => roomName === newRoomName)
    if (index === -1) {
      socket.emit('roomNameApproved', newRoomName)

      // Create the new room
      let newRoom = {
        roomName: newRoomName,
        users: [],
        currentGame: null,
        nextUp: [],
        startGame() {
          // Here we start a Game
          // First we do a countdown of 3 seconds
          io.sockets.in(this.roomName).emit('countdown')
          // TODO group clearCanvas and clearSpecialMessage into a 'cleanup' event
          io.sockets.in(this.roomName).emit('clearCanvas')
          io.sockets.in(this.roomName).emit('clearSpecialMessage')

          // Update users to get rid of the stars / artists
          this.users = this.users.map(user => {
            return {
              ...user,
              guessed: false,
            }
          })
          updateUsers()

          // Create a new game
          if (this.nextUp.length === 0) {
            this.nextUp = rankUsers(this.users)
          }
          let [currentUser, ...nextUp] = this.nextUp
          this.currentGame = createNewGame(this.users, currentUser)
          this.nextUp = nextUp

          //Do this after the countdown has finished
          // But only if therre is still a game
          setTimeout(() => {
            if (!this.currentGame) {
              return;
            }
            //How many letters you're gonna get
            let amountOfLetters = Math.floor(this.currentGame.word.length / 3)
            let atInterval = Math.floor(90 / (amountOfLetters + 1))

            // Start the timer
            let timer = setInterval(() => {
              if (this.currentGame) {
                io.sockets.in(this.roomName).emit('time', this.currentGame.time)
                this.currentGame.time = this.currentGame.time - 1
                if (this.currentGame.time % atInterval === 0 && this.currentGame.time !== 0 && this.currentGame.time !== 90) {
                  let randomLetterIndex = giveRandomLetter(this.roomName, this.currentGame)
                  this.currentGame.lettersGiven = [...this.currentGame.lettersGiven, randomLetterIndex]
                  let freeLetter = {
                    letter: this.currentGame.word[randomLetterIndex],
                    index: randomLetterIndex,
                  }
                  io.sockets.in(this.roomName).emit('freeLetter', freeLetter)
                }
                if (this.currentGame.time < 0) {
                  this.endGame()
                }
              }
              else {
                clearInterval(timer)
              }
            }, 1000)

            // Emit the artist and word
            io.sockets.in(this.roomName).emit('startGame', {
              artist: this.currentGame.artist,
              word: this.currentGame.word,
            })

            // Send the artist in a chat messages
            io.sockets.in(this.roomName).emit('message', {
              body: this.currentGame.artist.username + ' is going to draw!',
              //Optional server prop (gets own special style :D)
              server: true,
            })
          }, 3000)
        },
        endGame() {
          this.currentGame = null
          io.sockets.in(this.roomName).emit('endGame')
          setTimeout(() => {
            if (this.users.length > 1 && !this.currentGame) {
              this.startGame()
            }
          }, 10000)
        },
      }
      rooms = [...rooms, newRoom]

      // Join it
      joinRoom(newRoomName)
    }
    else {
      socket.emit('roomNameDisapproved')
    }
  })

  // On client request to join, not creation
  socket.on('joinRoom', newRoomName => {
    let roomIndex = rooms.map(room => room.roomName).findIndex(roomName => roomName === newRoomName)
    if (roomIndex !== -1) {
      joinRoom(newRoomName)
    }
    let room = rooms[roomIndex]
    if (room.currentGame) {
      io.sockets.in(room.roomName).emit('specialMessage', 'Wait for the next turn')
    }
    setTimeout(() => {
      if (room.users.length > 1 && !room.currentGame) {
        room.startGame()
      }
    }, 3000)
  })

  // Leaving a room
  let leaveRoom = () => {
    let currentRoomIndex = rooms.map(room => room.roomName).findIndex(roomName => roomName === socket.roomName)
    let currentRoom = rooms[currentRoomIndex]
    let ourIndex = currentRoom.users.map(user => user.username).findIndex(username => username === socket.user.username)
    currentRoom.users.splice(ourIndex, 1)
    // If we are the last one in the room
    if (currentRoom.users.length === 0) {
      rooms.splice(currentRoomIndex, 1)
    }
    // If we are leaving an active game and the remaining users.length < 2
    if (currentRoom.currentGame && currentRoom.users.length < 2) {
      io.sockets.in(currentRoom.roomName).emit('specialMessage', 'Not enough players')
      currentRoom.endGame()
    }
    socket.leave(socket.roomName)
  }

  // Process messages
  socket.on('message', message => {
    let currentRoomIndex = rooms.map(room => room.roomName).findIndex(roomName => roomName === socket.roomName)
    let currentRoom = rooms[currentRoomIndex]

    // If our message matches the current word
    if (currentRoom.currentGame) {
      if (message.body.toLowerCase() === currentRoom.currentGame.word.toLowerCase()) {
        // And we're NOT the artist AND we haven't guessed the word yet
        let ourIndex = currentRoom.users.map(user => user.username).findIndex(username => username === socket.user.username)
        let ourUser = currentRoom.users[ourIndex]
        if (currentRoom.currentGame.artist.username !== socket.user.username && !ourUser.guessed) {
          // We guessed it!
          // Calculate guesser score
          ourUser.score = ourUser.score + Math.round(currentRoom.currentGame.time / currentRoom.currentGame.scoreFactor)
          currentRoom.currentGame.scoreFactor = currentRoom.currentGame.scoreFactor + 1
          // Give the artist some points too for drawing well
          let artistIndex = currentRoom.users.map(user => user.username).findIndex(username => username === currentRoom.currentGame.artist.username)
          // Artist gets more score if more users guess, inverse of scoreFactor for guessers
          currentRoom.users[artistIndex].score = currentRoom.users[artistIndex].score + Math.round(currentRoom.currentGame.time * currentRoom.currentGame.scoreFactor / 7)
          // Set guessed to true
          ourUser.guessed = true
          // Let the user know they guessed it (show the word && gives star && plays sound)
          updateUsers()
          // This also results in a 'specialMessage' of currentGame.word
          socket.emit('guessed', currentRoom.currentGame.word)
          // If everyone guessed it (except the artist), end the game
          let guessers = currentRoom.users.filter(user => user.guessed ? true : false)
          if (guessers.length === currentRoom.currentGame.players.length - 1) {
            currentRoom.endGame()
          }
        }
        // If we are the artist, don't do anything (we don't allow spoiling the word)
      }
      else {
        io.sockets.in(socket.roomName).emit('message', {
          body: message.body,
          user: message.user,
        })
      }
    }
    else {
      io.sockets.in(socket.roomName).emit('message', {
        body: message.body,
        user: message.user,
      })
    }
  })

  // On draw
  socket.on('draw', drawArgs => {
    let currentRoomIndex = rooms.map(room => room.roomName).findIndex(roomName => roomName === socket.roomName)
    let currentRoom = rooms[currentRoomIndex]
    if (currentRoom.currentGame) {
      // Send drawArgs to everyone but me (no double-drawing)
      socket.broadcast.to(currentRoom.roomName).emit('draw', drawArgs)
    }
  })

  // On disconnect
  // SOMETHING IS GOING WRONG HERE AND I DON'T KNOW WHAT
  socket.on('disconnect', data => {
    // If we never even entered a username
    if (!socket.user) {
      return;
    }
    let ourIndex = users.map(user => user.username).findIndex(username => username === socket.user.username)
    // Only remove our user if it is found in our userlist
    if (ourIndex !== -1) {
        users.splice(ourIndex, 1)
    }
    if (socket.roomName) {
      console.log(socket.roomName, "has disconnected")
      leaveRoom()
    }
    updateUsers()
  })
})

console.log('Listening on :3040')
