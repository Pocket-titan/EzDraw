import React from 'react'

export let View = 'div'
export let Text = 'span'

export let TextInput = ({onSubmit, onTextChange, ...props}) => {
  <input
    {...props}
    type="text"
    // Call onTextChange with the value on change
    onChange={e => {
      onTextChange && onTextChange(e.target.value)
    }}
    // Call onSubmit when enter is pressed
    onKeyPress={e => {
      e.which === 13 && onSubmit && onSubmit()
    }}
  />
}
