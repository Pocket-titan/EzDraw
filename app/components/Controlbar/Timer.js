import React from 'react'
import { View, Text } from '../../components.js'
import socket from '../Socket'
import { Badge } from 'material-ui'

export default class Timer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      time: null,
    }
  }

  componentDidMount() {
    socket.on('time', time => {
      this.setState({ time })
    })
  }
  render() {
    let { time } = this.state
    return (
      <Badge
        badgeContent={time === null ? 0 : time}
        primary={true}
        style={{alignSelf: 'center', padding: 10}}
        badgeStyle={{position: 'relative'}}
      />
    )
  }
}
