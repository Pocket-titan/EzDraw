import React from 'react'
import { View, Text, Socket } from '../components.js'
import { TextField } from 'material-ui'
import { panel } from '../style.css'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

export default class ChooseRoom extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      errorText: null,
      rooms: null,
    }
  }

  componentDidMount() {
    Socket.on('roomNameApproved', roomName => {
      this.props.handleJoinRoom(roomName)
    })

    Socket.on('roomNameDisapproved', () => {
      this.setState({ errorText: 'A room with that name already exists' })
    })

    Socket.on('rooms', rooms => this.setState({ rooms }))

  }

  render() {
    let onRoomSubmit = event => {
      let chosenRoomName = event.target.value
      if (event.keyCode === 13 && chosenRoomName) {
        Socket.emit('approveRoomName', chosenRoomName)
      }
    }

    let onRoomClick = roomName => {
      Socket.emit('joinRoom', roomName)
      this.props.handleJoinRoom(roomName)
    }

    let { errorText, rooms } = this.state
    return (
      <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <View className={panel} style={{backgroundColor: this.props.skin.palette.panelColor}}>

          {/* Existing rooms */}
          <View style={{flexDirection: 'column', height: 200, width: '100%'}}>
            { rooms
              ? rooms.length > 0
                ? rooms.map(room =>
                <View
                  style={{
                    backgroundColor: this.props.skin.palette.userBackgroundColor,
                    borderColor: this.props.skin.palette.borderColor,
                    borderStyle: 'solid',
                    borderWidth: 1,
                    padding: 20,
                    flex: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 6,
                    position: 'relative',
                    cursor: 'pointer',
                  }}
                  onClick={() => onRoomClick(room.roomName)}
                >
                  {/* Room name */}
                  <Text>
                    {room.roomName}
                  </Text>

                  {/* Users currently in room */}
                  <Text style={{position: 'absolute', right: 15, bottom: 9}}>
                    {room.users.length}
                  </Text>
                </View>
              )
              : <Text style={{textAlign: 'center', fontStyle: 'italic', fontWeight: 300}}> No rooms yet! </Text>
            : null}
          </View>

          {/* Room name for creating a room */}
          <MuiThemeProvider muiTheme={getMuiTheme(this.props.skin)}>
            <TextField
              hintText="Create a new room"
              errorText={errorText}
              errorStyle={{color: this.props.skin.palette.errorColor}}
              onKeyUp={onRoomSubmit}
            />
          </MuiThemeProvider>
        </View>
      </View>
    )
  }
}
