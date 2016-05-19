import React from 'react'
import io from 'socket.io-client'

import { View, Text } from '../components.js'

//Components
import UserList from './UserList'
import Chat from './Chat'
import CanvasContainer from './CanvasContainer'

let socket = io('http://localhost:3001')

export default class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      users: [],
      messages: [],
      artist: false,
      word: null,
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

    socket.on('word', word => {
      let newWord = this.state.artist ? word : word.split('').map(letter => {return '_ '}).join('')
      this.setState({ word: newWord })
    })

    socket.on('endGame', () => {
      this.setState({ artist: false })
    })

    socket.on('clearCanvas', () => {
      this.setState({ word: null })
    })

    socket.on('artist', artist => {
      //If it's us :o
      if (artist.username === this.props.username) {
        //You can draw now
        this.setState({ artist: true })
      }
    })
  }

  render() {
    let { users, messages, artist, word } = this.state
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
      <View style={{flexDirection: 'row'}}>
        <UserList users={users}/>
        <CanvasContainer
          artist={artist}
          width={750}
          height={640}
          word={word}
        />
      <Chat messages={messages} onSubmit={handleSubmit} height={640}/>
      </View>
    )
  }
}
