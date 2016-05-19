import React from 'react'
import { View } from '../../components.js'
let MaterialUI = require('material-ui')

export default class Slider extends React.Component {
  render() {
    let { onChange, size } = this.props
    return (
        <div style={{justifyContent: 'flex-end', padding: 10, width: 200}}>
          <MaterialUI.Slider
            step={1}
            min={1}
            max={20}
            onChange={(e,value) => onChange(e, value)}
            defaultValue={size}
            style={{height: 18, marginLeft: 0}}
          />
      </div>
    )
  }
}
