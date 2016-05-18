import React from 'react'
import { View, Text } from '../../components.js'

export default class Word extends React.Component {
  render() {
    return (
      <View>
        <Text>
          { this.props.word }
        </Text>
      </View>
    )
  }
}
