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
      drawArgs: null,
      word: null,
      time: null,
      shouldClear: false,
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

    socket.on('draw', drawArgs => {
      this.setState({ drawArgs })
    })

    socket.on('word', word => {
      let newWord = this.state.artist ? word : word.split('').map(letter => {return '_ '}).join('')
      this.setState({ word: newWord })
    })

    socket.on('time', time => {
      this.setState({ time })
    })

    socket.on('endGame', () => {
      this.setState({ artist: false, word: null, drawArgs: null })
    })

    socket.on('clearCanvas', () => {
      this.setState({ shouldClear: true })
      setTimeout(() => {
        this.setState({ shouldClear: false })
      }, 500)
    })

    socket.on('artist', artist => {
      if (artist.username === this.props.username) {
        //Game is starting here
        //You can draw now
        this.setState({ artist: true })
      }
    })
  }

  render() {
    let { users, messages, artist, word, time, shouldClear } = this.state
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

    let emitDraw = drawArgs => {
      socket.emit('draw', drawArgs)
    }
    return (
      <View style={{display: 'flex', flexDirection: 'row'}}>
        <UserList users={users} />
        <CanvasContainer
          artist={artist}
          width={700}
          height={600}
          emitDraw={emitDraw}
          drawArgs={this.state.drawArgs}
          word={word}
          time={time}
          shouldClear={shouldClear}
        />
      <Chat messages={messages} onSubmit={handleSubmit} />
      </View>
    )
  }
}
