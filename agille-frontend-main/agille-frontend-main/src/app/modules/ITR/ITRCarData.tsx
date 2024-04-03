import React, {useState} from 'react'
import {CustomButton} from '../../components/CustomButton/CustomButton'
import {updateCarMapUrl} from '../../services/EntitiesApi'
import {AttachmentDropZone} from '../../utils/components/DropZoneUp'
import CarMap from './Components/ITRCARMap'
import {useITREntityData} from './useITREntityData'

export default function ITRCarData() {
  const [isLoading, setIsLoading] = useState(false)
  const [fileUrl, setFileUrl] = useState('')
  const [cityMapUrl, setCityMapUrl] = useState('')
  const {center} = useITREntityData()
  return (
    <>
      <div className='card card-body'>
        <div className='modal-header'>
          <div className='w-100 modal-title h4'>Dados do CAR</div>
        </div>
        <div className='d-flex justify-content-around align-items-center mb-10'>
          <AttachmentDropZone
            onSubmit={(_file, _attId, _fileWithMeta, fileUrl) => {
              setFileUrl(fileUrl)
            }}
            title={'Propriedades - CAR'}
          />
          <AttachmentDropZone
            onSubmit={(_file, _attId, _fileWithMeta, fileUrl) => {
              setCityMapUrl(fileUrl)
            }}
            title={'Limites do município'}
          />
          <div className='h-450px w-800px pt-0'>
            <CarMap center={center} zoom={10} url={fileUrl || ''} cityMapUrl={cityMapUrl} />
          </div>
        </div>
      </div>
      <div style={{paddingLeft: '40%', paddingRight: '40%'}} className='card-footer pb-10'>
        <CustomButton
          isLoading={isLoading}
          label='Salvar'
          disabled={isLoading}
          onSubmit={() => {
            setIsLoading(true)
            updateCarMapUrl(fileUrl, cityMapUrl).finally(() => setIsLoading(false))
          }}
        ></CustomButton>
      </div>
    </>
  )
}
