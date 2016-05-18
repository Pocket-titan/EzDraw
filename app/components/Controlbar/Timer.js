import React from 'react'
import { View, Text } from '../../components.js'

export default class Timer extends React.Component {
  render() {
    return (
      <View>
        <Text>
          { this.props.time }
        </Text>
      </View>
    )
  }
}
