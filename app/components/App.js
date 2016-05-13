import React from 'react'
import io from 'socket.io-client'

import { View, Text } from '../components.js'

//Components
import UserList from './UserList'
import Chat from './Chat'
import Canvas from './Canvas'

let socket = io()

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      users: [],
      messages: [],
    }
  }

  componentDidMount() {
    socket.on('init', this._initialize)
    socket.on('send:message', this._messageReceive)
    socket.on('user:join', this._userJoined)
    socket.on('user:left', this._userLeft)
  }

  _initialize(data) {
    //Find out what users are already there
    let { users, name } = data
    this.setState({users, user: name})
  }

  _messageReceive(message) {
    this.setState({ messages: [message, ...this.state.messages] })
  }

  _userJoined(data) {
    let { name } = data
    this.setState({ users: [name, ...this.state.users] })
  }

  _userLeft(data) {
    console.log('data:', data)
    let { users } = this.state
    let { name } = data
    //This breaks if there are two people with the same name; we should prevent that
    let index = users.indexOf(name)
    let newUsers = users.slice(index, 1)
    this.setState({ users: newUsers })
  }

  handleSubmit = event => {
    const body = event.target.value
    if (event.keyCode === 13 && body) {
      console.log('message:', body)
      //This is local, only you will see  'Me'
      const message = {
        body,
        from: 'Me',
        key: event.id,
      }
      this.setState({ messages: [message, ...this.state.messages] })
      this.socket.emit('message', body)
      event.target.value = ''
    }
  }

  render() {
    let { users, messages } = this.state
    return (
      <View style={{display: 'flex', flexDirection: 'row'}}>
        <UserList users={users}/>
        <Canvas />
        <Chat messages={messages} onSubmit={this.handleSubmit}/>
      </View>
    )
  }
}
