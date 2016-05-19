import React from 'react'
import { View, Text } from '../components.js'

export default class ChooseName extends React.Component {
  render() {
    return (
      <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <Text>
          Choose your username:
        </Text>
        <input
          type="text"
          placeholder="Username"
          onKeyUp={this.props.onSubmit}
        />
      </View>
    )
  }
}
