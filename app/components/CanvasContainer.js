import React from 'react'
import { View, Text } from '../components.js'

//Components
import Canvas from './Canvas'
import ControlBar from './Controlbar/ControlBar'

export default class CanvasContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      brushColor: '#00000',
      brushWidth: 5,
      toolName: 'Pencil',
    }
  }
  render() {
    let { brushColor, brushWidth, toolName } = this.state
    let { word, artist, time } = this.props
    let onColorChange = color => {
      this.setState({ brushColor: color.hex })
    }

    let onSizeChange = event => {
      this.setState({ brushWidth: event.target.value })
    }

    let onToolClick = newToolName => {
      this.setState({ toolName: newToolName })
    }
    return (
      <View>
        <ControlBar
          onColorChange={onColorChange}
          onSizeChange={onSizeChange}
          color={brushColor}
          size={brushWidth}
          word={word}
          artist={artist}
          time={time}
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
