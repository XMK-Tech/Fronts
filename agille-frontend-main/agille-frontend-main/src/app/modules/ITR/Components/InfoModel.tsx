import React, {AnchorHTMLAttributes, DetailedHTMLProps} from 'react'
import {Link} from 'react-router-dom'

type ButtonsInfo = {
  label: string
  onClick: () => void
  type?: 'solid' | 'outline' | undefined
  loading?: boolean
}
type LinksInfo = {
  label: string
  url: string
}
type InfoModelProps = {
  link?: LinksInfo
  title: string
  message: string
  infoColor?: string
  button?: ButtonsInfo[]
}
export default function InfoModel(props: InfoModelProps) {
  return (
    <div
      className={`alert alert-dismissible bg-light-${
        props.infoColor || 'danger'
      } d-flex flex-center flex-column py-10 px-10 px-lg-20 mb-10`}
    >
      <span
        className={`btn btn-link btn-color-${
          props.infoColor || 'danger'
        } btn-active-color-primary me-8 ms-8`}
      >
        <i className={`fas fa-info-circle fs-1 p-0`}></i>
      </span>

      <div className='text-center'>
        <h5 className='fw-bolder fs-1 mb-5'>{props.title}</h5>

        <div
          className={`separator separator-dashed border-${
            props.infoColor || 'danger'
          } opacity-25 mb-5`}
        ></div>

        <div className='mb-9'>
          {props.message}
          {props.link && (
            <Link to={props.link.url}>
              <b>{props.link.label}</b>
            </Link>
          )}
        </div>
        {props.button && (
          <div className='d-flex flex-center flex-wrap'>
            {props.button.map((e) =>
              e.type === 'outline' ? (
                <div
                  onClick={e.onClick}
                  className={`btn btn${e.type === 'outline' && '-outline'} btn${
                    e.type === 'outline' && '-outline'
                  }-${props.infoColor || 'danger'} btn-active-${
                    props.infoColor || 'danger'
                  }danger m-2`}
                >
                  {e.label}
                  {e.loading && <span className=' ms-2 spinner-border spinner-border-sm'></span>}
                </div>
              ) : (
                <div onClick={e.onClick} className={`btn btn-${props.infoColor || 'danger'} m-2`}>
                  {e.label}
                  {e.loading && <span className=' ms-2 spinner-border spinner-border-sm'></span>}
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  )
}
