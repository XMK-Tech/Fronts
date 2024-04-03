import {toAbsoluteUrl} from '../../../helpers'

export function FallbackView() {
  return (
    <div className='splash-screen'>
      <img
        className='mw-100px'
        src={toAbsoluteUrl('/media/illustrations/custom/logoAgille.png')}
        alt='Start logo'
      />
      <span>Carregando ...</span>
    </div>
  )
}
