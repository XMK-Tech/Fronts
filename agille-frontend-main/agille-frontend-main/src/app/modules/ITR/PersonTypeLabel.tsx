import React from 'react'
import {PersonType} from '../../services/PersonApi'

export const PersonTypeLabel = (props: {type: PersonType}) => {
  const {type} = props
  return (
    <span className={`badge badge-${type === PersonType.Physical ? 'success' : 'info'}`}>
      {type === PersonType.Physical ? 'Física' : 'Jurídica'}
    </span>
  )
}
