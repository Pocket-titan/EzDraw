import React from 'react'
import { findDOMNode } from 'react-dom'
import io from 'socket.io-client'

let URL = window.location.hostname + ':3040'
// let URL = 'http://localhost:3040'
export let Socket = io.connect(URL, {secure: true})

export let Dimensions = {
  height: 670,
}

export let View = ({ style, ...props }) =>
  <div style={{display: 'flex', flex: 1, ...style}} {...props} />

export let Text = 'span'

export class Scroll extends React.Component {
  componentWillUpdate() {
    // Gather info
    let element = findDOMNode(this)
    let scrollHeight = element.scrollHeight - element.offsetHeight
    this.scrollHeightSaved = scrollHeight
  }

  componentDidUpdate() {
    let element = findDOMNode(this)
    let prevScrollHeight = this.scrollHeightSaved
    let scrollHeight = element.scrollHeight - element.offsetHeight
    element.scrollTop = this.props.scrollTo(prevScrollHeight, element.scrollTop, scrollHeight)
  }

  render() {
    return (
      <View {...this.props} ref={x => this.element = x} />
    )
  }
}
