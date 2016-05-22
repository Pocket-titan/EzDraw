import React from 'react'
import { Text, Dimensions } from '../components.js'
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import VelocityComponent from 'velocity-react/velocity-component'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

//Components
import Canvas from './Canvas'
import ControlBar from './ControlBar'

export default class CanvasContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      brushColor: '#020000',
      brushWidth: 2,
      toolName: 'Pencil',
      time: null,
      message: null,
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
      <div style={{height: Dimensions.height}}>
        <MuiThemeProvider muiTheme={this.props.skin}>
          <ControlBar
            {...this.props}
            color={brushColor}
            onColorChange={onColorChange}
            size={brushWidth}
            onSizeChange={onSizeChange}
            onToolClick={onToolClick}
          />
        </MuiThemeProvider>
        <Canvas
          skin={this.props.skin}
          artist={this.props.artist}
          width={this.props.width}
          height={this.props.height - 42}
          brushColor={brushColor}
          brushWidth={brushWidth}
          toolName={toolName}
          style={{position: 'relative'}}
          shouldClear={this.props.shouldClear}
        />
      <Text style={{position: 'absolute', 'top': '20vh', 'left': '43vw', fontSize: 300, fontWeight: 800}}>
        { this.props.countdown }
      </Text>
      <VelocityComponent
        animation={{opacity: this.props.specialMessage ? 1 : 0}} duration={700}
      >
        {/* Canvas overlay for special message */}
        <div
          style={{
            position: 'absolute',
            height: this.props.height - 42,
            width: this.props.width,
            alignItems: 'center',
            justifyContent: 'center',
            top: 60,
            display: this.props.specialMessage ? 'flex' : 'none',
          }}
        >
          <div
            style={{
              padding: 5,
              paddingLeft: 10,
              paddingRight: 10,
              borderRadius: 6,
              marginBottom: 140,
              marginRight: 26,
              backgroundColor: this.props.skin.palette.primary1Color,
            }}
          >
            <Text style={{fontSize: 28, fontWeight: 500, color: '#ffffff'}}>
              { this.props.specialMessage }
            </Text>
          </div>
        </div>
      </VelocityComponent>
      </div>
    )
  }
}
