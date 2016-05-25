import React from 'react'
import { View, Socket } from '../components.js'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import 'bootstrap/dist/css/bootstrap.min.css'

//Components
import Game from './Game'
import ChooseName from './ChooseName'
import ChooseRoom from './ChooseRoom'

//Skins
import Coffee from './Skins/Coffee'
import Jungle from './Skins/Jungle'
import Goldfish from './Skins/Goldfish'

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
      room: null,
      skin: getMuiTheme(defaultSkin),
    }
  }

  render() {
    let setSkin = skinName => {
      let skindex = Skins.findIndex(Skin => Skin.name.toLowerCase() === skinName.toLowerCase())
      let skin = Skins[skindex].skin
      this.setState({ skin: getMuiTheme(skin) })
      document.body.style.backgroundColor = skin.palette.backgroundColor
      //TODO manipulate webkit scrollbar
    }

    let handleSetUsername = username => {
      this.setState({ username })
    }

    let handleJoinRoom = roomname => {
      this.setState({ room: roomname })
    }

    let { username, room, skin } = this.state
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
        { (username === null)
        ? <ChooseName handleSetUsername={handleSetUsername} skin={skin} />
        : (room === null)
          ? <ChooseRoom handleJoinRoom={handleJoinRoom} skin={skin} />
        : <Game username={username} setSkin={setSkin} skin={skin}/>}
      </View>
    )
  }
}
