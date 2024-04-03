import React from 'react'
import {KTSVG} from '../../../_metronic/helpers'

type DetailsModaProps = {
  title: string
  corStatus: string
  label: string
}
export default function DetailsModal(props: DetailsModaProps) {
  return (
    <>
      <div
        className={`alert alert-dismissible bg-light-${props.corStatus} border border-${props.corStatus} border-dashed d-flex flex-column flex-sm-row w-100 p-5 mb-10`}
      >
        <span className={`svg-icon svg-icon-1hx svg-icon-${props.corStatus} me-4 mb-5 mb-sm-0`}>
          <KTSVG className='svg-icon-2' path='/media/icons/duotune/general/gen007.svg' />
        </span>

        <div className='d-flex flex-column pe-0 pe-sm-10'>
          <div className='d-flex align-items-center'>
            <span className={`mb-1 fs-6 fw-bolder text-${props.corStatus}`}>
              <span>{props.title}</span>
            </span>
          </div>
          <span className='pb-3 pt-5 text-muted '>{props.label}</span>
        </div>
      </div>
    </>
  )
}
