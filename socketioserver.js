import socketIO from 'socket.io'
import { mapValues } from 'lodash'

let io = socketIO(3001)
//Initially, there are no users
let users = []

io.on('connection', (socket) => {
  let lobby = 'Lobby'
  socket.join(lobby)
  let myUsername = null

  let updateUsers = () => {
    io.sockets.in(lobby).emit('newUsers', users)
  }

  socket.on('addUser', username => {
    users = [...users, username]
    myUsername = username
    updateUsers()
  })

  socket.on('disconnect', data => {
    let index = users.findIndex(el => {
      if (el === myUsername) {return true}
    })
    users.splice(index, 1)
    updateUsers()
    socket.leave(lobby)
  })

  socket.on('message', message => {
    io.sockets.in(lobby).emit('message', {
      body: message.body,
      user: message.user,
    })
  })
})
