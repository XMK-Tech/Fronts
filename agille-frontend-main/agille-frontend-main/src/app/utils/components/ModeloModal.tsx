import React from 'react'
import {Modal, ModalProps} from 'react-bootstrap-v5'
import {FormError} from '../../../components/FormError'
import {KTSVG} from '../../../_metronic/helpers'
type ModeloModalProps = {
  title?: React.ReactNode | string
  body: React.ReactNode
  footer?: React.ReactNode
  show: boolean
  onHide: () => void
  size?: ModalProps['size']
}

export default function ModeloModal(props: ModeloModalProps) {
  return (
    <>
      <Modal size={props.size} show={props.show} onHide={props.onHide}>
        <Modal.Header>
          <Modal.Title className='w-100'>{props.title}</Modal.Title>
          <div
            className='btn btn-icon btn-sm btn-active-light-primary ms-2'
            aria-label='Close'
            onClick={props.onHide}
          >
            <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
          </div>
        </Modal.Header>
        <Modal.Body>{props.body}</Modal.Body>
        <Modal.Footer>{props.footer}</Modal.Footer>
      </Modal>
    </>
  )
}
export function ModalErrorFooter({
  error,
  modalFooter,
}: {
  error: {message: any} | null
  modalFooter: JSX.Element
}): React.ReactElement {
  return (
    <div className='w-100 d-flex flex-row align-items-center justify-content-between'>
      {!error ? <div /> : <FormError noMargin status={error} />}
      {modalFooter}
    </div>
  )
}
