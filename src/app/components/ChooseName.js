import React from 'react'
import { View, Socket } from '../components.js'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { TextField } from 'material-ui'

export default class ChooseName extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      errorText: null,
    }
  }

  componentDidMount() {
    Socket.on('usernameApproved', username => this.props.handleSetUsername(username))

    Socket.on('usernameDisapproved', () => {
      this.setState({ errorText: 'A user with that username already exists' })
    })
  }

  render() {
    let onSubmit = event => {
      let chosenName = event.target.value
      if (event.keyCode === 13 && chosenName) {
        Socket.emit('approveUsername', chosenName)
      }
    }

    let { errorText } = this.state
    return (
      <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: 70}}>
        <View
          style={{
            flex: 0,
            flexDirection: 'column',
            padding: 20,
            borderRadius: 6,
            backgroundColor: this.props.skin.palette.panelColor,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MuiThemeProvider muiTheme={getMuiTheme(this.props.skin)}>
            <TextField
              hintText="Username"
              errorText={errorText}
              errorStyle={{color: this.props.skin.palette.errorColor}}
              onKeyUp={onSubmit}
            />
          </MuiThemeProvider>
        </View>
      </View>
    )
  }
}
