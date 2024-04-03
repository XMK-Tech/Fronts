import {FormikProps} from 'formik'
import React from 'react'
import {Link} from 'react-router-dom'
import {FormError} from '../../../components/FormError'
import {FormColumn, FormColumnProps} from './FormColumn'

type FormStepsProps = {
  form: FormikProps<any>
  footer?: React.ReactNode
  selected: number
  steps: {
    step: FormColumnProps[]
  }[]
}

type StepsProps = {
  selected: number
  formik: FormikProps<any>
  steps: {
    step: FormColumnProps[]
  }[]
}

type LastStepProps = {
  title: React.ReactNode
  subtitle: React.ReactNode
  link: string
  buttonLabel: string
}

type StepSelectedLabelProps = {
  selected: number
  labels: string[]
}

export type WizardButtonProps = {
  selected: number
  onClick: () => void
  onSave?: boolean
}

export type SubmitButtonProps = {
  onSave: boolean
}

export default function FormSteps(props: FormStepsProps) {
  return (
    <form onSubmit={props.form?.handleSubmit}>
      <div className=' shadow rounded bg-light '>
        <div className='p-10'>
          <div className='d-flex flex-row justify-content-between'>
            <Steps
              key={props.selected}
              formik={props.form}
              selected={props.selected}
              steps={props.steps}
            />
          </div>
        </div>
      </div>
      {!!props.footer && props.footer}
      <FormError status={props.form?.status} />
    </form>
  )
}

export function Steps({selected, formik, steps}: StepsProps) {
  return (
    <>
      {steps.map((step, index) => {
        if (selected == index) {
          return (
            <React.Fragment key={index}>
              {step.step.map((field, i) => {
                return (
                  <FormColumn
                    key={i}
                    form={formik}
                    inputs={field.inputs}
                    content={field.content}
                    className={field.className}
                  />
                )
              })}
            </React.Fragment>
          )
        }
        return null
      })}
    </>
  )
}

export function LastStep({title, subtitle, link, buttonLabel}: LastStepProps) {
  return (
    <div className='d-flex justify-content-center card-body pt-3 pb-15'>
      <form className='w-800px d-flex p-15 shadow rounded bg-light justify-content-center'>
        <div className='d-flex flex-column p-10 w-500px h-300px rounded bg-white justify-content-center'>
          <div className='d-flex fw-bolder text-center fs-1 mb-1 '>{title}</div>
          <br />

          <div className=' fw-bolder text-center fs-6 text-muted mb-1 '>{subtitle}</div>
          <Link to={link} className='p-10 d-flex flex-row justify-content-around'>
            <button type='button' className='btn btn-sm btn-primary'>
              {buttonLabel}
            </button>
          </Link>
        </div>
      </form>
    </div>
  )
}

export function StepSelectedLabel({selected, labels}: StepSelectedLabelProps) {
  const activeStepStyle =
    'px-4 card-label fw-bolder fs-6 mb-1 border-bottom border-primary text-primary'
  const disabledStepStyle = 'px-4 card-label fw-bolder fs-6 mb-1 '
  return (
    <div className='pb-3 d-flex flex-row justify-content-center'>
      {labels.map((field, index) => {
        return (
          <span key={index} className={selected === index ? activeStepStyle : disabledStepStyle}>
            {field}
          </span>
        )
      })}
    </div>
  )
}

export function PreviousButton({selected, onClick, onSave}: WizardButtonProps) {
  if (selected === 1 && !onSave) {
    return (
      <button onClick={onClick} type='button' className='btn btn-sm btn-light-primary'>
        Anterior
      </button>
    )
  }
  if (selected === 0) {
    return <div></div>
  }
  return <></>
}
export function NextButton({selected, onClick}: WizardButtonProps) {
  if (selected < 1) {
    return (
      <button onClick={() => onClick()} type='button' className='btn btn-sm btn-primary'>
        Próximo
      </button>
    )
  }
  return null
}

export function SubmitButton({onSave}: SubmitButtonProps) {
  return (
    <button
      type='submit'
      id='kt_sign_in_submit'
      className='btn btn-sm btn-primary'
      disabled={onSave}
    >
      {!onSave && <span className='indicator-label'>Salvar</span>}
      {onSave && (
        <span className='indicator-progress' style={{display: 'block'}}>
          Salvando... <span className='spinner-border spinner-border-sm align-middle'></span>
        </span>
      )}
    </button>
  )
}
