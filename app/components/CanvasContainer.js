import React from 'react'
import { View, Text } from '../components.js'

//Components
import Canvas from './Canvas'
import ControlBar from './Controlbar/ControlBar'

export default class CanvasContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      brushColor: '#020000',
      brushWidth: 5,
      toolName: 'Pencil',
    }
  }
  render() {
    let { brushColor, brushWidth, toolName } = this.state

    let onColorChange = color => {
      this.setState({ brushColor: color.hex })
    }

    let onSizeChange = (event, value) => {
      this.setState({ brushWidth: value })
    }

    let onToolClick = newToolName => {
      this.setState({ toolName: newToolName })
    }
    return (
      <View style={{flexDirection: 'column'}}>
        <ControlBar
          {...this.props}
          color={brushColor}
          onColorChange={onColorChange}
          size={brushWidth}
          onSizeChange={onSizeChange}
          onToolClick={onToolClick}
        />
        <Canvas
          {...this.props}
          brushColor={brushColor}
          brushWidth={brushWidth}
          toolName={toolName}
        />
      </View>
    )
  }
}
