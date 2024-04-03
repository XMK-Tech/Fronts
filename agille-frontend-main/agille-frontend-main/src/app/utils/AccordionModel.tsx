import React, {useState} from 'react'
import {KTSVG} from '../../_metronic/helpers'

type AccordionModelProps = {
  title: string
  content: string
  show: boolean
  openClose: () => void
}

export default function AccordionModel(props: AccordionModelProps) {
  return (
    <>
      <div className='bg-light-primary mb-3 pb-6 px-6 rounded accordion accordion-icon-toggle'>
        <div className='accordion-header py-3 d-flex'>
          <span onClick={props.openClose}>
            {props.show ? (
              <span className='svg-icon svg-icon-4 accordion-icon'>
                <KTSVG path={'/media/icons/duotune/arrows/arr023.svg'}></KTSVG>
              </span>
            ) : (
              <span className=' svg-icon svg-icon-4'>
                <KTSVG path={'/media/icons/duotune/arrows/arr023.svg'}></KTSVG>
              </span>
            )}
          </span>
          <h3 onClick={props.openClose} className='fs-6 fw-bold mb-0 ms-4'>
            {props.title}
          </h3>
        </div>
        {props.show ? (
          <div className='fs-6 collapse show ps-10 my-6'>
            Utilize desta variável quando quiser citar a {props.content}
          </div>
        ) : null}
      </div>
    </>
  )
}
