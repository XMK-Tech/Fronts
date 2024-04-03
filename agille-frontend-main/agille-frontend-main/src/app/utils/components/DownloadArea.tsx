import React from 'react'
import {toAbsoluteUrl} from '../../../_metronic/helpers'

type DownloadAreaProps = {
  title: string
  url: string
}
export default function DownloadArea(props: DownloadAreaProps) {
  return (
    <a href={props.url} target='_blank'>
      <div
        onClick={() => {}}
        className='d-flex btn btn-outline btn-outline-dashed btn-outline-primary btn-active-light-primary p-6 w-400px h-80px cursor-pointer mb-10 '
      >
        <span className='svg-icon svg-icon-2tx svg-icon-primary me-4'>
          <img className='w-45px' src={toAbsoluteUrl('/media/svg/files/download.svg')} alt=''></img>
        </span>
        <div className='d-flex flex-stack justify-content-center flex-grow-1 flex-wrap flex-md-nowrap'>
          <div className='mb-3 mb-md-0 fw-bold'>
            <h4 className='text-gray-800 fw-bolder'>{props.title}</h4>
            <div className='fs-6 text-gray-600 pe-7'>Click aqui para fazer o Download</div>
          </div>
        </div>
      </div>
    </a>
  )
}
