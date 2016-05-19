import React from 'react'
import { View, Text } from '../../components.js'
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../../../font-awesome-4.6.3/css/font-awesome.min.css'
import { IconButton } from 'material-ui'

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
  iconName: 'fa fa-pencil',
  image: PencilIcon,
}, {
  name: 'TOOL_ERASER',
  iconName: 'fa fa-eraser',
  image: EraserIcon,
}]

export default class ControlBar extends React.Component {
  render() {
    let { onColorChange, color, onSizeChange, size, word, time, onToolClick } = this.props
    return (
      <View style={{alignItems: 'center', margin: 0, justifyContent: 'space-between', flex: 0}} className="panel panel-default">
        <div style={{alignItems: 'center', display: 'flex'}}>
          <ColorPicker
            onChange={onColorChange}
            color={color}
          />
            { tools.map(tool => {
              return (
                <IconButton
                  iconClassName={tool.iconName}
                  style={{padding: 0, height: 37, width: 37}}
                  onClick={() => onToolClick(tool.name)}
                />
              )
            })}
          <Timer time={time}/>
        </div>
        <Word word={word} style={{justifyContent: 'center'}}/>
        <Slider onChange={onSizeChange} size={size}/>
      </View>
    )
  }
}
