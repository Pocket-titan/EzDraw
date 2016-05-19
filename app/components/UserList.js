import React from 'react'
import { div, Text } from '../components.js'
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { Badge } from 'material-ui'

let User = user => {
  return (
    <li className="list-group-item" style={{position: 'relative'}}>
        <Text style={{position: 'absolute', left: 10}}>
          {user.position}
        </Text>
        <Text>
          {user.username}
        </Text>
        { user.guessed ?
          <div>
            <Text
              className="fa fa-star"
              style={{
                position: 'absolute',
                right: 43,
                top: 12,
                fontSize: 20,
                color: 'yellow',
              }}
            />
            <Text
              className="fa fa-star-o"
              style={{
                position: 'absolute',
                right: 43,
                top: 12,
                fontSize: 20,
                color: 'black',
              }}
            />
        </div> :
        (user.artist ?
          <div>
            <Text
              className="fa fa-paint-brush"
              style={{
                position: 'absolute',
                right: 43,
                top: 11,
                fontSize: 20,
                color: 'black',
              }}
            />
          </div> : null)
        }
        <Badge
          badgeContent={user.score}
          secondary={true}
          style={{position: 'absolute', right: 10, top: 9, padding: 0}}
        />
    </li>
  )
}

export default class UserList extends React.Component {
  render() {
    return (
      <div
        style={{
          flexDirection: 'column',
          textAlign: 'center',
          flex: 0.55,
        }}
        className="panel panel-default"
      >
        <div className="panel-body" style={{padding: 0}}>
          <div className="list-group">
            <Text className="list-group-item active">
              Users
            </Text>
            { this.props.users.map(user => User(user))}
          </div>
        </div>
      </div>
    )
  }
}
