import React from 'react'
import { View, Text } from '../components.js'
import 'font-awesome/css/font-awesome.min.css'
import { IconButton, Badge } from 'material-ui'
import { panel } from '../style.css'

//Components
import ColorPicker from './ColorPicker'
import {Slider} from 'material-ui'

const tools = [{
  name: 'TOOL_PENCIL',
  iconName: 'fa fa-pencil',
}, {
  name: 'TOOL_ERASER',
  iconName: 'fa fa-eraser',
}]

export default class ControlBar extends React.Component {
  render() {
    let { onColorChange, color, onSizeChange, size, word, artist, time, onToolClick } = this.props
    return (
      <View
        style={{
          alignItems: 'center',
          margin: 0,
          justifyContent: 'space-between',
          flex: 0,
          backgroundColor: this.props.skin.palette.panelColor,
          borderColor: this.props.skin.palette.borderColor,
        }}
        className={panel}
      >
        <div style={{alignItems: 'center', display: 'flex'}}>
          {/* Colorpicker */}
          <ColorPicker
            onChange={onColorChange}
            color={color}
          />

          {/* Tools */}
          { tools.map(tool => {
            return (
              <IconButton
                iconClassName={tool.iconName}
                style={{padding: 0, height: 37, width: 37}}
                onClick={() => onToolClick(tool.name)}
              />
            )
          })}

          {/* Timer */}
          <Badge
            badgeContent={time === null ? 0 : time}
            primary={true}
            style={{alignSelf: 'center', padding: 6}}
            badgeStyle={{position: 'relative', width: 27, height: 27, backgroundColor: this.props.skin.palette.primary1Color}}
          />
        </div>

        {/* Word */}
        <Text style={{
            fontWeight: 700,
            fontSize: 27,
            letterSpacing: 1,
            textTransform: 'uppercase',
          }}
        >
          {/* If we're not the artist, space the letters for a better visual experience */}
          { word ? (artist ? word : word.split('').join(' ')) : null }
        </Text>

        {/* Size slider*/}
        <Slider
          step={1}
          min={1}
          max={20}
          onChange={(e,value) => onSizeChange(e, value)}
          defaultValue={size}
          style={{height: 18, marginLeft: 0, color: 'red', width: 200, paddingRight: 10}}
        />
      </View>
    )
  }
}
