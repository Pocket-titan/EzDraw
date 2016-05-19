import React from 'react'
import { findDOMNode } from 'react-dom'

export let View = ({ style, ...props }) =>
  <div style={{display: 'flex', flex: 1, alignItems: 'stretch', ...style}} {...props} />

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
