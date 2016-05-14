import React from 'react'
import io from 'socket.io-client'

import { View, Text } from '../components.js'

//Components
import UserList from './UserList'
import Chat from './Chat'
import Canvas from './Canvas'

let socket = io('http://localhost:3001')

export default class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      users: [],
      messages: [],
    }
  }

  componentDidMount() {
    socket.emit('addUser', this.props.username)

    socket.on('message', message => {
      this.setState({ messages: [...this.state.messages, message] })
    })

    socket.on('newUsers', newUsers => {
      this.setState({ users: newUsers })
    })
  }

  render() {
    let { users, messages } = this.state
    let handleSubmit = event => {
      const body = event.target.value
      if (event.keyCode === 13 && body) {
        const message = {
          body,
          user: this.props.username,
        }
        socket.emit('message', message)
        event.target.value = ''
      }
    }
    return (
      <View style={{display: 'flex', flexDirection: 'row'}}>
        <UserList users={users}/>
        <Canvas />
        <Chat messages={messages} onSubmit={handleSubmit}/>
      </View>
    )
  }
}
