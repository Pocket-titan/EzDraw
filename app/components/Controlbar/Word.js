import React from 'react'
import { View, Text } from '../../components.js'

export default class Word extends React.Component {
  render() {
    let { word } = this.props
    return (
        <Text>
          { word }
        </Text>
    )
  }
}
