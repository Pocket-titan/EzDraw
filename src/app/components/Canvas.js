import React from 'react'
import { findDOMNode } from 'react-dom'

//Socket
import { Socket } from '../components.js'

//Tools
import Eraser from './Tools/Eraser'
import Pencil from './Tools/Pencil'

//Cursor image
let pencilImg = require('../assets/fa2pencil.png')
let eraserImg = require('../assets/fa2eraser.png')

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
    }
  }

  componentDidMount() {
    this.canvas = findDOMNode(this)
    this.context = this.canvas.getContext('2d')
    this.context.fillStyle = '#ffffff'
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)

    Socket.on('draw', drawArgs => {
      //If we're getting an existing drawing from an existing session
      if (drawArgs instanceof Array) {
        drawArgs.forEach(args => {
          let { tool } = args
          let ownTool = mapTools[tool]
          args.context = this.context
          if (ownTool) {
            ownTool.draw(args)
          }
        })
      }
      else {
        let { tool } = drawArgs
        let ownTool = mapTools[tool]
        drawArgs.context = this.context
        if (ownTool) {
          ownTool.draw(drawArgs)
        }
      }
    })

    Socket.on('clearCanvas', () => {
      this.context.fillStyle = '#ffffff'
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.toolName) {
      let newTool = mapTools[nextProps.toolName]
      if (newTool && newTool !== this.state.tool) {
        this.setState({ tool: newTool })
      }
    }
  }

  render() {
    let { tool, mouseDown } = this.state

    //cursor img
    let cursorImg = this.state.tool.name === 'TOOL_PENCIL' ? pencilImg : eraserImg
    let cursorStyle = this.props.artist ? `url(${cursorImg}) 0 30, auto` : 'auto'

    let onMouseDown = event => {
      let newMousePosition = getCursorPosition(event)
      this.setState({ mouseDown: true, mousePosition: newMousePosition })
    }

    let onMouseMove = event => {
      let newMousePosition = getCursorPosition(event)

      if (mouseDown && this.props.artist) {
        let prevMousePosition = this.state.mousePosition
        let drawArgs = {
          brushColor: this.props.brushColor,
          brushWidth: this.props.brushWidth,
          tool: this.state.tool.name,
          prevMousePosition,
          newMousePosition,
        }
        //Server will emit the drawings to everyone else
        Socket.emit('draw', drawArgs)
        drawArgs.context = this.context
        tool.draw(drawArgs)
      }
      this.setState({ mousePosition: newMousePosition})
    }

    let onMouseUp = event => {
      this.setState({ mouseDown: false })
    }

    let onMouseOut = event => {
      event.preventDefault()
      this.setState({ mouseDown: false })
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
          style={{cursor: cursorStyle}}
        />
    )
  }
}
