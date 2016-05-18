import React from 'react'
import { SketchPicker } from 'react-color'
import { View } from '../../components.js'

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
      display: 'flex',
      borderRadius: 2,
      background: this.state.color,
    }

    const swatchStyle = {
      padding: 5,
      background: '#fff',
      borderRadius: 1,
      boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
      display: 'inline-block',
      cursor: 'pointer',
    }
    const popoverStyle = {
      position: 'absolute',
      zIndex: 2,
    }
    const coverStyle = {
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    }

    let handleClick = () => {
      this.setState({ displayColorPicker: !displayColorPicker })
    }

    let handleClose = () => {
      this.setState({ displayColorPicker: false })
    }

    let handleColorChange = color => {
      this.setState({ color: color.hex})
      this.props.onChange(color)
    }
    return (
      <View>
        <View style={ swatchStyle } onClick={ handleClick }>
          <View style={ colorStyle }/>
        </View>
        { this.state.displayColorPicker ?
          <View style={ popoverStyle }>
            <View style={ coverStyle } onClick={ handleClose }/>
            <SketchPicker
              color={ this.state.color }
              onChange={ handleColorChange }
            />
          </View> :
          null
        }
      </View>
    )
  }
}
