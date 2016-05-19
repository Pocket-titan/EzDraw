import React from 'react'
import { SketchPicker } from 'react-color'
import { View } from '../../components.js'
import { Popover} from 'material-ui'

export default class ColorPicker extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      displayColorPicker: false,
      color: '#000000',
    }
  }

  render() {
    let { displayColorPicker } = this.state

    let colorStyle = {
      width: 36,
      height: 22,
      borderRadius: 2,
      flex: 1,
      background: this.state.color,
    }

    const swatchStyle = {
      padding: 5,
      background: '#fff',
      borderRadius: 1,
      flex: 0,
      display: 'flex',
      boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
      cursor: 'pointer',
    }

    let handleOpen = event => {
      //to prevent ghost click
      event.preventDefault()
      this.setState({ displayColorPicker: true, anchorEl: event.currentTarget })
    }

    let handleClose = () => {
      this.setState({ displayColorPicker: false })
    }

    let handleColorChange = color => {
      this.setState({ color: color.hex})
      this.props.onChange(color)
    }
    return (
      <div style={{padding: 5, paddingLeft: 6}}>
        <View style={ swatchStyle } onClick={ handleOpen }>
          <View style={ colorStyle }/>
        </View>
        <Popover
          open={this.state.displayColorPicker}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={ handleClose }
        >
          <SketchPicker
            color={ this.state.color }
            onChange={ handleColorChange }
          />
        </Popover>
      </div>
    )
  }
}
