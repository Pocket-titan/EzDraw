import React from 'react'
import { View, Text } from '../components.js'

let User = (user) => {
  return (
    <View>
      { user.name }
    </View>
  )
}

export default class UserList extends React.Component {
  render() {
    return (
      <View style={{
          backgroundColor: 'red',
          width: 200,
          height: 400,
          textAlign: 'center',
        }}
      >
        <View style={{
            borderColor: 'black',
            borderWidth: 2,
            borderStyle: 'solid',
          }}
        >
          <Text style={{margin: 20}}>
            Users
          </Text>
        </View>
        { this.props.users.map(user => User(user))}
      </View>
    )
  }
}
