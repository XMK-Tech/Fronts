/* eslint-disable react/jsx-no-target-blank */
import {useParams} from 'react-router-dom'
import {RegisterModelForm} from '../../auditor/model/RegisterModelPage'

export default function RegisterModelDTEPage() {
  const {id} = useParams<{id: string}>()
  return (
    <RegisterModelForm
      label={id ? 'Editar Modelo DTE' : 'Cadastro de Modelo DTE'}
      id={id}
      saveLink={'/DTE/modelos-dte/consulta'}
      module={2}
    />
  )
}
