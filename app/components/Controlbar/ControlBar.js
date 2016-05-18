import React from 'react'
import { View, Text } from '../../components.js'


//Components
import ColorPicker from './ColorPicker'
import Slider from './Slider'
import Word from './Word'
import Timer from './Timer'

//Icons
import PencilIcon from '../../assets/pencil_icon.png'
import EraserIcon from '../../assets/eraser_icon.png'

const tools = [{
  name: 'TOOL_PENCIL',
  image: PencilIcon,
}, {
  name: 'TOOL_ERASER',
  image: EraserIcon,
}]

export default class ControlBar extends React.Component {
  render() {
    let { onColorChange, color, onSizeChange, size, word, time, onToolClick } = this.props
    return (
      <View style={{display: 'flex', justifyContent: 'space-between', backgroundColor: 'green'}}>
        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          <ColorPicker onChange={onColorChange} color={color}/>
            { tools.map(tool => {
              return (
                <View>
                  <img
                    src={tool.image}
                    onClick={() => onToolClick(tool.name)}
                    style={{width: 30, height: 30, display: 'flex', resizeMode: 'contain', padding: 5}}
                  />
                </View>
              )
            })}
          <Timer time={time}/>
        </View>
        <Word word={word}/>
        <Slider onChange={onSizeChange} size={size}/>
      </View>
    )
  }
}
