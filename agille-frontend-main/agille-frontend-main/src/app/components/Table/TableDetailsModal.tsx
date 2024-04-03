import {ModalProps} from 'react-bootstrap-v5'
import {Link} from 'react-router-dom'
import {toAbsoluteUrl} from '../../../_metronic/helpers'
import ModeloModal from '../../utils/components/ModeloModal'
import {CustomButton} from '../CustomButton/CustomButton'

type TableDetailsModalProps = {
  title: string
  footer?: React.ReactNode
  show: boolean
  onHide: () => void
  size?: ModalProps['size']
  detailsCard: DetailsCardProps
  infoCard: React.ReactNode
}

export type DetailsCardProps = {
  imgUrl: string
  userInfo: DetailsProps[]
  linkUrl: string
}

type DetailsProps = {
  item: string
  description: string
}
type infoCardButtons = {
  label: string
  onClick: () => void
  isLoading: boolean
}
type InfoCardProps = {
  title: string
  subtitle: string
  data: React.ReactNode
  butons?: infoCardButtons[]
}

function Details(props: DetailsProps) {
  return (
    <>
      <div className=' d-flex flex-row'>
        <p className='pb-3 text-muted'>
          <strong className='text-black'>{props.item}:</strong>
          &ensp; {props.description}
        </p>
        <div className='pb-4 text-muted'> </div>
      </div>
    </>
  )
}
export function DetailsCard(props: DetailsCardProps) {
  return (
    <div className='p-4 card shadow-sm w-500px bg-white'>
      <div className='text-center'>
        <img alt='Logo' src={props.imgUrl} className='h-80px' />
        <div className=' p-4 flex-column'>
          {props.userInfo.map((info, index) => (
            <Details key={index} {...info} />
          ))}
        </div>
      </div>
      <div className='d-flex flex-row justify-content-around'>
        <Link to={props.linkUrl}>
          <button data-bs-dismiss='modal' type='button' className='btn btn-sm btn-primary'>
            Editar
          </button>
        </Link>
      </div>
    </div>
  )
}

export function InfoCard(props: InfoCardProps) {
  return (
    <div className='card shadow-sm w-500px '>
      <div className='p-5 d-flex flex-row justify-content-between'>
        <div className='p-3'>
          <h3 className='card-title'>{props.title}</h3>
          <p className='text-muted'>{props.subtitle}</p>
        </div>
        <div className='p-3'>
          <p className='text-muted'>Data</p>
          <h3 className='card-title'>{props.data}</h3>
        </div>
      </div>
      <img
        alt='Logo'
        src={toAbsoluteUrl('/media/illustrations/custom/admCard.svg')}
        className='h-350px'
      />
      <div className='d-flex justify-content-center'>
        {props.butons?.map((e) => (
          <CustomButton isLoading={e.isLoading} label={e.label} onSubmit={e.onClick} />
        ))}
      </div>
    </div>
  )
}

export default function TableDetailsModal(props: TableDetailsModalProps) {
  return (
    <ModeloModal
      size={props.size}
      show={props.show}
      onHide={props.onHide}
      title={props.title}
      body={
        <div className='pb-10 d-flex flex-row justify-content-around'>
          <DetailsCard
            imgUrl={props.detailsCard.imgUrl}
            userInfo={props.detailsCard.userInfo}
            linkUrl={props.detailsCard.linkUrl}
          />
          {props.infoCard}
        </div>
      }
    />
  )
}
