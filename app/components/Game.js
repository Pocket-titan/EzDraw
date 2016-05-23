import React from 'react'
import io from 'socket.io-client'

import { View, Dimensions } from '../components.js'
import MuiThemeProvider from '../../material-ui/styles/MuiThemeProvider'
// let winSound = require('../assets/kids_cheering.mp3')

//Components
import UserList from './UserList'
import Chat from './Chat'
import CanvasContainer from './CanvasContainer'

// let URL = 'https://jelmar.me:3040/'
let URL = 'http://localhost:3040'
let socket = io.connect(URL /*, {secure: true}*/)

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
      shouldClear: false,
      time: null,
      countdown: null,
    }
  }

  componentDidMount() {
    socket.emit('addUser', this.props.username)

    socket.on('time', time => {
      this.setState({ time })
    })

    socket.on('message', message => {
      this.setState({ messages: [...this.state.messages, message] })
    })

    socket.on('newUsers', newUsers => {
      this.setState({ users: newUsers })
    })

    socket.on('word', word => {
      let newWord = this.state.artist ? word : word.split('').map(letter => {return '_'}).join('')
      this.setState({ word: newWord })
    })

    socket.on('showWord', word => this.setState({ word }))

    socket.on('freeLetterIndex', letter => {
      let newWord = this.state.word.split('').map((oldLetter, index) => {
        return (index === letter.index) ? letter.letter : oldLetter
      }).join('')
      this.setState({ word: newWord })
    })

    socket.on('specialMessage', message => {
      this.setState({ specialMessage: message })
    })

    socket.on('clearCanvas', () => {
      //Not pretty but it works
      this.setState({ shouldClear: true })
      this.setState({ shouldClear: false })
    })

    socket.on('clearSpecialMessage', () => {
      this.setState({ specialMessage: null })
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

    // socket.on('playWinSound', () => {
    //   let audio = new Audio(winSound)
    //   audio.play()
    // })

    socket.on('countdown', () => {
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
    let { users, messages, artist, word, specialMessage } = this.state
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
          socket.emit('message', message)
        }
        event.target.value = ''
      }
    }

    return (
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <MuiThemeProvider muiTheme={this.props.skin}>
          <UserList users={users} skin={this.props.skin}/>
        </MuiThemeProvider>
        <CanvasContainer
          artist={artist}
          width={750}
          height={Dimensions.height}
          word={word}
          specialMessage={specialMessage}
          shouldClear={this.state.shouldClear}
          time={this.state.time}
          countdown={this.state.countdown}
          skin={this.props.skin}
        />
      <MuiThemeProvider muiTheme={this.props.skin}>
        <Chat messages={messages} onSubmit={handleSubmit} height={Dimensions.height} skin={this.props.skin}/>
      </MuiThemeProvider>
      </View>
    )
  }
}
