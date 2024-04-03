import React from 'react'
import InfoModel from './InfoModel'
type SucesssErrorFullScreenProps = {
  onHide: () => void
  show: boolean
}
export default function SuccessFullScreen(props: SucesssErrorFullScreenProps) {
  return props.show ? (
    <div
      style={{
        position: 'absolute',
        zIndex: 1,
        top: '25%',
        bottom: '25%',
        left: '25%',
        right: '25%',
      }}
    >
      <InfoModel
        title='Sucesso !'
        message='Sua operação foi concluida com sucesso'
        infoColor='success'
        button={[{label: 'ok', onClick: () => props.onHide()}]}
      />
    </div>
  ) : null
}
