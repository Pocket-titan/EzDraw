import React from 'react'
import { TextField } from 'material-ui'
import { View, Text, Scroll } from '../components.js'

let Message = (message, skin) => {
  let serverStyle = {
    color: skin.palette.serverText,
    fontWeight: 800,
  }
  let style = message.server ? serverStyle : message.style
  return (
    <View style={{flex: 0}}>
      <Text style={style}>
        {message.user ? <b> { message.user }: </b> : null}
        { message.body }
      </Text>
    </View>
  )
}

export default class Chat extends React.Component {
  render() {
    let { messages, onSubmit } = this.props
    return (
      //Parent has relative, chat input has absolute: (stackoverflow)
      //"Absolute positioning looks for the nearest relatively positioned parent within the DOM,
      //if one isn't defined it will use the body."
      <View
        style={{
          display: 'block',
          position: 'relative',
          backgroundColor: this.props.skin.palette.panelColor,
          borderColor: this.props.skin.palette.borderColor,
          borderTopRightRadius: 6,
          borderBottomRightRadius: 6,
        }}
      >

        {/* Messages (thanks Michiel :D)*/}
        <div style={{height: this.props.height - 50, padding: 5}}>
          <Scroll
            style={{
              maxHeight: this.props.height - 50,
              overflow: 'auto',
              flexDirection: 'column',
              display: 'block',
              flex:0,
              paddingLeft: 3,
              alignItems: 'stretch',
            }}
            id="chat"
            scrollTo={(h,s,c) => h === s ? c : s}
          >
            { messages.map(message => Message(message, this.props.skin)) }
          </Scroll>
        </div>

        {/* Chat input */}
        <View>
          <TextField
            hintText="Chat here!"
            fullWidth={true}
            onKeyUp={onSubmit}
            style={{flex: 1, marginLeft: 7, marginRight: 7}}
          />
        </View>

      </View>
    )
  }
}
