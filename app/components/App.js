import React from 'react'
import { View } from '../components.js'
import io from 'socket.io-client'
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { TextField } from 'material-ui'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

//Components
import Game from './Game'

//Skins
import Coffee from './Skins/Coffee'
import Jungle from './Skins/Jungle'
import Goldfish from './Skins/Goldfish'

//To handle https
let socket = io('https://jelmar.me:3040', {secure: true})
const defaultSkin = Coffee

let Skins = [{
  name: 'Coffee',
  skin: Coffee,
}, {
  name: 'Jungle',
  skin: Jungle,
}, {
  name: 'Goldfish',
  skin: Goldfish,
}]

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: null,
      errorText: null,
      skin: defaultSkin,
    }
  }

  componentDidMount() {
    socket.on('usernameApproved', username => {
      this.setState({ username })
    })

    socket.on('usernameDisapproved', () => {
      this.setState({ errorText: 'A user with that username already exists' })
    })
  }

  render() {
    let { username, errorText } = this.state
    let onSubmit = event => {
      let chosenName = event.target.value
      if (event.keyCode === 13 && chosenName) {
        socket.emit('approveUsername', chosenName)
      }
    }

    let setSkin = skinName => {
      let skindex = Skins.findIndex(Skin => Skin.name.toLowerCase() === skinName.toLowerCase())
      let skin = Skins[skindex].skin
      this.setState({ skin })
      document.body.style.backgroundColor = skin.palette.backgroundColor
      //TODO manipulate webkit scrollbar
    }
    //If we don't have a username yet, make us choose one, then we can continue to the game
    return (
      <View
        style={{
          'height': '100vh',
          paddingLeft: 20,
          paddingRight: 20,
          alignItems: 'center',
          backgroundColor: this.state.skin.palette.backgroundColor,
        }}
      >
        {
          username === null ?
            <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: 70}}>
              <View
                style={{
                  flex: 0,
                  flexDirection: 'column',
                  padding: 20,
                  borderRadius: 6,
                  backgroundColor: this.state.skin.palette.panelColor,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MuiThemeProvider muiTheme={getMuiTheme(this.state.skin)}>
                  <TextField
                    hintText="Username"
                    errorText={errorText}
                    errorStyle={{color: this.state.skin.palette.errorColor}}
                    onKeyUp={onSubmit}
                  />
                </MuiThemeProvider>
              </View>
            </View> :
            <Game username={username} setSkin={setSkin} skin={getMuiTheme(this.state.skin)}/>
          }
      </View>
    )
  }
}
