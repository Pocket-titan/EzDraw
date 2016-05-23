import { map } from 'lodash'
import fs from 'fs'
import socketIO from 'socket.io'

//Local server to test: run "npm run server"
let io = socketIO(3040)

//The Game Part

let lobby = 'Lobby'
//Initially, there are no users, and there is no game
let users = []
let currentGame = null
let words = fs.readFileSync('./words.txt', 'utf8').split('\n')

let rankUsers = users =>
  users.slice()
  .sort((a, b) => b.score - a.score)

let updateUsers = () => {
  let sortedUsers = rankUsers(users)
  // let userScores = mapValues(users, user => user.score)
  let newUsers = users.map(user => {
    let index = sortedUsers.findIndex(sortedUser => sortedUser === user)
    user.position = index + 1
    return user
  })
  users = newUsers
  io.sockets.in(lobby).emit('newUsers', users)
}

let giveRandomLetter = () => {
  //We store the indexes of the given letters in an array, and here we filter out the indexes
  //of the letters we have already given
  let wordIndexes = map(currentGame.word, (letter, index) => index)
  let unguessedIndexes = wordIndexes.filter(letterIndex => {
    let indexInGuessed = currentGame.lettersGiven.findIndex(givenLetterIndex => letterIndex === givenLetterIndex)
    //If its not in lettersGiven, keep it, otherwise discard it
    return indexInGuessed === -1 ? true : false
  })
  let randomLetterIndex = unguessedIndexes[Math.floor(Math.random() * unguessedIndexes.length)]
  currentGame.lettersGiven = [...currentGame.lettersGiven, randomLetterIndex]
  io.sockets.in(lobby).emit('freeLetterIndex', {index: randomLetterIndex, letter: currentGame.word[randomLetterIndex]})
}

let getRandomWord = () => {
  let randomWord = words[Math.floor(Math.random() * words.length)]
  return randomWord
}

let game = {
  currentUserList: [],
}

let startNewGame = () => {
  //Initiate the countdown
  io.sockets.in(lobby).emit('countdown')

  // Take things from game object and transform them
  let [nextUser, ...nextUserList] =
    game.currentUserList.length === 0
    ? game.currentUserList
    : rankUsers(users)

  // Update them for the new game
  game = {
    currentUserList: nextUserList,
  }

  //Make a new game
  let NewGame = new Game(nextUser)
  currentGame = NewGame
  //After the countdown is done
  setTimeout(() => {
    //Only execute if enough Users
    if (currentGame) {
      //Start the timer
      currentGame.startTimer()
      //Emit the artist
      io.sockets.in(lobby).emit('artist', currentGame.artist)
      //Emit the word to guess
      io.sockets.in(lobby).emit('word', currentGame.word)
      //Emit the artist in a chat message
      io.sockets.in(lobby).emit('message', {
        body: currentGame.artist.username + ' is going to draw!',
        //Optional server prop (gets own special style :D)
        server: true,
      })
      //Give the artist an artist property
      let artistIndex = users.findIndex(user => user.username === currentGame.artist.username)
      users[artistIndex].artist = true
      updateUsers()
    }
  }, 3000)
}

function Game(artist) {
  //Map usernames
  this.artist = artist
  this.word = getRandomWord()
  this.lettersGiven = []
  this.time = 90
  // this.drawing = []
  this.timer = null
  this.startTimer = () => {
      io.sockets.in(lobby).emit('time', this.time)
      this.timer = setInterval(() => {
        this.time = this.time - 1
        io.sockets.in(lobby).emit('time', this.time)
        if (this.time === 0) {
          this.endGame()
        }
        //How many letters you're gonna get
        let amountOfLetters = Math.floor(this.word.length / 3)
        let atInterval = Math.floor(90 / (amountOfLetters + 1))
        if (this.time % atInterval === 0 && this.time !== 0 && this.time !== 90) {
          giveRandomLetter()
        }
      }, 1000)
  }
  this.endGame = function() {
    //Everyone can see the word now
    io.sockets.in(lobby).emit('showWord', currentGame.word)
    currentGame = null
    clearInterval(this.timer)
    io.sockets.in(lobby).emit('endGame')
    //If there are enough users after 5 seconds, start a new game
    setTimeout(() => {
      io.sockets.in(lobby).emit('clearCanvas')
      io.sockets.in(lobby).emit('clearSpecialMessage')
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
  socket.on('approveUsername', username => {
    let index = users.findIndex(user => user.username === username)
    if (index === -1) {
      socket.emit('usernameApproved', username)
    }
    else {
      socket.emit('usernameDisapproved')
    }
  })
  socket.on('draw', drawArgs => {
    if (currentGame) {
      //Add to array to serve the drawing to new joiners
      // saving the drawing is too performance-heavy
      // currentGame.drawing = [...currentGame.drawing, drawArgs]
      socket.broadcast.emit('draw', drawArgs)
    }
  })

  socket.on('addUser', username => {
    socket.username = username
    socket.join(lobby)
    socket.room = lobby
    let me = {username, score: 0, guessed: false, position: users.length + 1, artist: false }
    users = [...users, me]
    updateUsers()

    if (currentGame) {
      socket.emit('word', currentGame.word)
      socket.emit('specialMessage', 'Wait for the next turn')
      // saving the drawing is too performance-heavy
      // socket.emit('draw', currentGame.drawing)
    }
    else if (!currentGame) {
      if (users.length < 2) {
        socket.emit('specialMessage', 'Not enough players')
      }
    }

    //If someone joined and there is no new game, start a new one (after 10sec to not interfere with perhaps existing timeout)
    setTimeout(() => {
      if (users.length > 1 && !currentGame) {
        io.sockets.in(lobby).emit('clearCanvas')
        io.sockets.in(lobby).emit('clearSpecialMessage')
        //Set guessed and artist of everyone to false
        users = map(users, user => {
          return { ...user, guessed: false, artist: false }
        })
        updateUsers()
        startNewGame()
      }
    }, 2000)
  })

  socket.on('disconnect', data => {
    let index = users.findIndex(user => user.username === socket.username)
    let ourUser = users[index]
    //Find ourselves in the users array && remove us
    if (index !== -1) {
      users.splice(index, 1)
      updateUsers()
    }
    //If we're the artist
    if (currentGame && index !== -1) {
      if (currentGame.artist.username === ourUser.artist) {
        io.sockets.in(lobby).emit('specialMessage', 'The artist has left the game')
        currentGame.endGame()
      }
      else if (users.length < 2) {
        io.sockets.in(lobby).emit('specialMessage', 'Not enough players')
        currentGame.endGame()
      }
    }
    //Goodbye cruel world
    socket.leave(lobby)
  })

  socket.on('message', message => {
    if (currentGame) {
      //If we guess the word and are not the artist ourselves
      if (message.body.toLowerCase() === currentGame.word.toLowerCase() && currentGame.artist.username !== socket.username) {
        let index = users.findIndex(user => user.username === socket.username)
        //Update our score (if we havent guessed the word already)
        if (index !== -1 && !users[index].guessed) {
          users[index].score = users[index].score + currentGame.calculateScore()
          //We guessed it!
          users[index].guessed = true
          socket.emit('showWord', currentGame.word)
          socket.emit('playWinSound')
          socket.emit('specialMessage', currentGame.word)
          //Let them know, this will give them a star
          updateUsers()
          //If everyone guessed it, terminate the game
          if (users.filter(user => user.guessed).length === users.length - 1) {
            currentGame.endGame()
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
