import React from 'react'
import io from 'socket.io-client'

import { View, Socket, Dimensions } from '../components.js'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
let winSound = require('../assets/kids_cheering.mp3')

//Components
import UserList from './UserList'
import Chat from './Chat'
import CanvasContainer from './CanvasContainer'

let SkinNames = [{
  name: 'Coffee',
}, {
  name: 'Jungle',
}, {
  name: 'Goldfish',
}]

export default class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      users: [],
      messages: [{
        body: 'Available commands:\n/skin <skin>,\n/help',
        style: {fontWeight: 800},
      }],
      artist: false,
      word: null,
      specialMessage: null,
      time: null,
      countdown: null,
    }
  }

  componentDidMount() {
    Socket.on('time', time => this.setState({ time }))

    Socket.on('users', users => this.setState({ users }))

    Socket.on('startGame', ({artist, word}) => {
      // Make sure to remove the brushe next to the name of the previous artist
      let newUsers = this.state.users.map(user => {
        return {
          ...user,
          artist: false,
        }
      })
      this.setState({ users: newUsers})

      // Set the artist
      if (artist.username === this.props.username) {
        //As artist we can see the whole word
        this.setState({ artist: true, word })
      }
      else {
        this.setState({ word: word.split('').map(letter => '_').join('') })
      }
      let artistUserIndex = this.state.users.map(user => user.username).findIndex(username => username === artist.username)
      let artistUser = this.state.users[artistUserIndex]
      artistUser.artist = true
    })

    Socket.on('freeLetter', ({letter, index}) => {
      if (!this.state.artist) {
        let newWord = this.state.word.substring(0, index) + letter + this.state.word.substring(index + 1)
        this.setState({ word: newWord })
      }
    })

    Socket.on('message', message => {
      this.setState({ messages: [...this.state.messages, message] })
    })

    Socket.on('endGame', () => {
      this.setState({ artist: false })
    })

    Socket.on('guessed', word => {
      // Capitalize the specialMessage
      let specialMessage = word[0].toUpperCase() + word.slice(1)
      // Display special message word
      this.setState({ word, specialMessage })
      let audio = new Audio(winSound)
      audio.volume = 0.5
      // TODO tweak volume = too loud currently
      audio.play()
    })

    Socket.on('specialMessage', specialMessage => {
      this.setState({ specialMessage })
    })

    Socket.on('clearSpecialMessage', () => {
      this.setState({ specialMessage: null })
    })

    Socket.on('countdown', () => {
      this.setState({ countdown: 3 })
      let timer = setInterval(() => {
        let newCountdown = this.state.countdown - 1
        if (newCountdown > 0) {
          this.setState({ countdown: newCountdown })
        }
        else {
          this.setState({ countdown: null })
          clearInterval(timer)
        }
      }, 1000)
    })
  }

  render() {
    let setSkin = skinName => {
      this.props.setSkin(skinName)
    }

    let sendServerMessage = message => {
      let parsedMessage = {
        body: message,
        style: {fontWeight: 800},
      }
      this.setState({ messages: [...this.state.messages, parsedMessage]})
    }

    let Commands = [{
      name: 'skin',
      execute(skinName) {
        let skinAlert = 'Invalid skin. Valid skins are: ' + SkinNames.map(Skin => Skin.name)
        if (!skinName) {
          sendServerMessage(skinAlert)
          return;
        }
        let skindex = SkinNames.findIndex(Skin => Skin.name.toLowerCase() === skinName.toLowerCase())
         if (skindex === -1) {
          sendServerMessage(skinAlert)
        }
        else {
          //I want my arrow functions :'(
          setSkin(skinName)
        }
      },
    }, {
      name: 'help',
      execute() {
        let helpAlert = 'Available commands:\n/skin <skin>,\n/help'
        sendServerMessage(helpAlert)
      },
    }]

    let handleCommand = body => {
      //User has issued a command
      let args = body.split(' ')
      let commandIndex = Commands.findIndex(Command => Command.name === args[0].replace('/', ''))
      if (commandIndex === -1) {
        console.log('No command :\'(')
      }
      else {
        Commands[commandIndex].execute(args[1])
      }
    }

    let handleSubmit = event => {
      const body = event.target.value
      if (event.keyCode === 13 && body) {
        if (body[0] === '/') {
          handleCommand(body)
        }
        else {
          const message = {
            body,
            user: this.props.username,
          }
          Socket.emit('message', message)
        }
        event.target.value = ''
      }
    }

    let { users, messages, artist, word, specialMessage, time, countdown } = this.state
    return (
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <MuiThemeProvider muiTheme={this.props.skin}>
          <UserList users={users} skin={this.props.skin}/>
        </MuiThemeProvider>
        <CanvasContainer
          artist={artist}
          word={word}
          time={time}
          specialMessage={specialMessage}
          countdown={countdown}
          width={750}
          height={Dimensions.height}
          skin={this.props.skin}
        />
      <MuiThemeProvider muiTheme={this.props.skin}>
        <Chat messages={messages} onSubmit={handleSubmit} height={Dimensions.height} skin={this.props.skin}/>
      </MuiThemeProvider>
      </View>
    )
  }
}
