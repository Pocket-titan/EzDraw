import React from 'react'

import { View, Text } from '../components.js'

let Message = (message, index) => {
  return (
    <View>
      <Text>
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
      <View style={{display: 'flex', backgroundColor: 'blue', width: 400}}>

        {/* Messages */}
        <View style={{flexDirection: 'column'}}>
          { messages.map(message => Message(message)) }
        </View>

        {/* Chat input */}
        <View style={{
            display: 'flex',
            alignItems: 'flex-end',
          }}
        >
          <input
            style={{display: 'flex'}}
            type="text"
            placeholder="Chat here!"
            onKeyUp={onSubmit}
          />
        </View>

      </View>
    )
  }
}
