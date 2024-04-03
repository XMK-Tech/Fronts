import {type} from 'os'
import React from 'react'
import {toAbsoluteUrl} from '../../../../_metronic/helpers'

export default function UploadArchive(props: any) {
  return (
    <>
      <div className='w-250px text-center d-flex justify-content-center flex-column align-items-center'>
        <h3>{props.title}</h3>
        <div className=' w-100 card h-100 flex-center bg-light-primary border-primary border border-dashed p-1 py-10'>
          <img src={toAbsoluteUrl('/media/svg/files/upload.svg')} className='mb-5' alt=''></img>

          <a href='#' className='text-hover-primary fs-5 fw-bolder mb-2'>
            Upload de Arquivo
          </a>

          <div className='fs-7 fw-bold text-gray-400'> Arraste e solte arquivos aqui</div>
        </div>
      </div>
    </>
  )
}
