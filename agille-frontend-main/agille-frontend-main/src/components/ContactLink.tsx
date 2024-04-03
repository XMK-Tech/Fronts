import React from 'react'
import {toAbsoluteUrl} from '../_metronic/helpers'

export function ContactLink() {
  return (
    <a href='#' className='text-muted text-hover-primary px-2'>
      <div className='d-flex align-items-center'>
        <span>Entre em Contato</span>
        <img
          className='w-20px ms-1'
          src={toAbsoluteUrl('/media/svg/social-logos/wppGreen.svg')}
          alt=''
        ></img>
      </div>
    </a>
  )
}
