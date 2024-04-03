import {toAbsoluteUrl} from '../../../_metronic/helpers'

type EmptyStateList = {
  text?: string
}

export default function EmptyStateList(props: EmptyStateList) {
  return (
    <div className='card-body d-flex flex-column justify-content-center rounded ms-4  text-center w-100'>
      <p className='fw-bolder fs-6'>
        {props?.text || (
          <>
            Não foram encontrados resultados para a pesquisa.<br></br> Por favor, tente novamente
            usando outro termo.
          </>
        )}
      </p>

      <img
        alt='Logo'
        src={toAbsoluteUrl('/media/illustrations/custom/noData.svg')}
        className='img-fluid mh-250px'
      />
    </div>
  )
}
