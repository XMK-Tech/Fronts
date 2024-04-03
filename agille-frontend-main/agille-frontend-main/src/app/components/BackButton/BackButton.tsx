import React from 'react'
import {useHistory} from 'react-router-dom'

export function BackButton() {
  const history = useHistory()
  return (
    <button className='btn btn-sm btn-light-primary h-40px' onClick={() => history.goBack()}>
      Voltar
    </button>
  )
}
