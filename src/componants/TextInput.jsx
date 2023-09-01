import React from 'react'

export const TextInput = (props) => {
  return (
    <input type="text" value={props.value} onChange={props.onChange} onClick={props.onClick} onBlur={props.onBlur} style={{ width: '30px' }}/>
  )
}
