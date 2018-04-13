import React from 'react'
import { Text, View, Dimensions } from '../components.js'
import { Badge } from 'material-ui'

//Animation
import { star } from '../style.css'

let User = (user, index, skin) => {
  return (
    <Text
      style={{
        position: 'relative',
        backgroundColor: skin.palette.userBackgroundColor,
        borderColor: skin.palette.borderColor,
        borderStyle: 'solid',
        borderWidth: 1,
        borderTopWidth: 0,
        padding: 15,
      }}
    >
        {/* Our ranking */}
        <Text style={{position: 'absolute', left: 10}}>
          {index + 1}
        </Text>

        {/* Our username */}
        <Text>
          {user.username}
        </Text>

        {/* A little star if we've guessed the word */}
        { user.guessed ?
          <div className={star} style={{position: 'absolute', right: 29, top: 1}}/> :
        // Or a little brush if we're the artist
        (user.artist ?
          <div>
            <Text
              className="fa fa-paint-brush"
              style={{
                position: 'absolute',
                right: 43,
                top: 15,
                fontSize: 20,
                color: 'black',
              }}
            />
          </div> : null)
        }

        {/* Our score */}
        <Badge
          badgeContent={user.score}
          secondary={true}
          badgeStyle={{height: 27, width: 27, backgroundColor: skin.palette.accent1Color}}
          style={{position: 'absolute', right: 10, top: 12, padding: 0}}
        />
    </Text>
  )
}

export default class UserList extends React.Component {
  render() {
    return (
      <div style={{flex: 1}}>
        <View
          style={{
            textAlign: 'center',
            height: Dimensions.height,
            backgroundColor: this.props.skin.palette.panelColor,
            borderColor: this.props.skin.palette.borderColor,
            borderTopLeftRadius: 6,
            borderBottomLeftRadius: 6,
          }}
        >
          <div style={{padding: 0, display: 'flex', flex: 1, flexDirection: 'column'}}>
            <Text
              style={{
                backgroundColor: this.props.skin.palette.panelHeaderColor,
                borderColor: this.props.skin.palette.borderColor,
                padding: 11,
                borderTopLeftRadius: 6,
                borderBottomWidth: 1,
                borderBottomStyle: 'solid',
              }}
            >
              Users
            </Text>
            { this.props.users.map((user, index) => User(user, index, this.props.skin))}
          </div>
        </View>
      </div>
    )
  }
}
