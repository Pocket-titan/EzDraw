import React from 'react'
import { findDOMNode } from 'react-dom'
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { TextField } from 'material-ui'

import { View, Text, Scroll } from '../components.js'

let Message = (message, index) => {
  return (
    <View style={{flex: 0}}>
      <Text style={message.style}>
        <b> { message.user }: </b>
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
        style={{display: 'block', position: 'relative', flex: 0.6}}
        className="panel panel-default"
      >

        {/* Messages (thanks Michiel :D)*/}
        <div style={{height: this.props.height, padding: 5}}>
          <Scroll
            style={{
              maxHeight: this.props.height,
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
            { messages.map(message => Message(message)) }
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
