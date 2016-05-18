import React from 'react'
import { findDOMNode } from 'react-dom'
import { View, Text } from '../components.js'

//Tools
import Eraser from './Controlbar/Tools/Eraser'
import Pencil from './Controlbar/Tools/Pencil'

let mapTools = {
  TOOL_PENCIL: Pencil,
  TOOL_ERASER: Eraser,
}

export default class Canvas extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tool: Pencil,
      mouseDown: false,
      points: [],
    }
  }
  componentDidMount() {
    this.canvas = findDOMNode(this)
    this.context = this.canvas.getContext('2d')
  }

  setTool(tool) {
    this.setState({ tool })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.drawArgs) {
      let ownDrawArgs = nextProps.drawArgs
      let { tool } = ownDrawArgs
      let ownTool = mapTools[tool]
      ownDrawArgs.context = this.context
      if (ownTool) {
        ownTool.draw(ownDrawArgs)
      }
    }

    if (nextProps.shouldClear) {
      this.context.fillStyle = 'rgba(255, 255, 255, 1)'
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
    }

    if (nextProps.toolName) {
      let newTool = mapTools[nextProps.toolName]
      if (newTool && newTool !== this.state.tool) {
        this.setState({ tool: newTool })
      }
    }
  }

  render() {
    let { tool, mouseDown, points } = this.state
    let onMouseDown = event => {
      let newMousePosition = getCursorPosition(event)
      this.setState({ mouseDown: true, points: [...points, {x: newMousePosition.x, y: newMousePosition.y}] })
    }

    let onMouseMove = event => {
      if (mouseDown && this.props.artist) {
        let newMousePosition = getCursorPosition(event)
        this.setState({ points: [...points, {x: newMousePosition.x, y: newMousePosition.y}] })
        let drawArgs = {
          context: this.context,
          brushColor: this.props.brushColor,
          brushWidth: this.props.brushWidth,
          tool: this.state.tool.name,
          points,
        }
        //Server will emit the drawings to everyone else
        this.props.emitDraw(drawArgs)
        tool.draw(drawArgs)
      }
    }

    let onMouseUp = event => {
      this.setState({ mouseDown: false, points: [] })
    }

    let onMouseOut = event => {
      event.preventDefault()
      this.setState({ mouseDown: false, points: [] })
    }

    let getCursorPosition = event => {
      const {top, left} = this.canvas.getBoundingClientRect()
      return {
        x: event.clientX - left,
        y: event.clientY - top,
      }
    }
    return (
      <canvas
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseOut={onMouseOut}
        onMouseUp={onMouseUp}
        width={this.props.width}
        height={this.props.height}
      />
    )
  }
}
