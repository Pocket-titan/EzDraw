import React from 'react'

export default class Slider extends React.Component {
  render() {
    let { onChange, size } = this.props
    return (
      <input
        type='range'
        name='points'
        min='0'
        max='20'
        onChange={onChange}
        defaultValue={size}
      />
    )
  }
}
