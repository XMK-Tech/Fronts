import { FormikProps } from 'formik'
import React, { useState } from 'react'
import { FormError } from '../../../components/FormError'
import {
  SubmitButtonProps,
  WizardButtonProps,
} from '../../modules/admin/management/Register/SubsRegisterPage'
import { ITRRegisterForm } from '../../modules/ITR/Components/ITRRegisterForm'

const PreviousButton: React.FC<WizardButtonProps> = ({ selected, onClick, onSave }) => {
  if (selected < 6 && !onSave) {
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
const NextButton: React.FC<WizardButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={() => {
        onClick()
      }}
      type='button'
      className='btn btn-sm btn-primary'
    >
      Próximo
    </button>
  )
}
type FormSelectedProps = {
  selected: number
  footer: React.ReactNode
  renderStep: (i: number, stepSubmitted: boolean) => React.ReactElement
  isLastStep: boolean
  error?: any
  onSubmit: (values: any) => void
}
const FormSelected: React.FC<FormSelectedProps & { stepSubmitted: boolean }> = ({
  selected,
  footer,
  renderStep,
  onSubmit,
  isLastStep,
  stepSubmitted,
}) => {
  return !isLastStep ? (
    <ITRRegisterForm onSubmit={onSubmit} footer={footer}>
      {renderStep(selected, stepSubmitted)}
    </ITRRegisterForm>
  ) : (
    renderStep(selected, stepSubmitted)
  )
}
const SubmitButton: React.FC<SubmitButtonProps> = ({ isLoading }) => {
  return (
    <button type='submit' className='btn btn-sm btn-primary' disabled={isLoading}>
      {!isLoading && <span className='indicator-label'>Salvar</span>}
      {isLoading && (
        <span className='indicator-progress' style={{ display: 'block' }}>
          Salvando... <span className='spinner-border spinner-border-sm align-middle'></span>
        </span>
      )}
    </button>
  )
}
const StepsLabel: React.FC<{
  selected: number; steps: string[], canSelectStep?: boolean
  setFormNumber: (index: number) => void
}> = ({ selected, steps, canSelectStep, setFormNumber }) => {
  const activeStepStyle =
    'px-4 card-label fw-bolder fs-6 mb-1 border-bottom border-primary text-primary'
  const disabledStepStyle = 'px-4 card-label fw-bolder fs-6 mb-1 '
  return (
    <div className='pb-3 d-flex flex-row justify-content-center'>
      {steps.map((step, index) => (
        <span key={index} onClick={() => {
          if (canSelectStep) {
            setFormNumber(index)
          }
        }} style={{ cursor: canSelectStep ? 'pointer' : undefined }} className={selected === index ? activeStepStyle : disabledStepStyle}>
          {step}
        </span>
      ))}
    </div>
  )
}
type StepperProps = Omit<FormSelectedProps, 'footer' | 'selected' | 'isLastStep'> & {
  isLoading: boolean
  steps: string[]
  canGoToNextStep: (step: number) => boolean
  showLastStep: boolean
  canSelectStep?: boolean
}

export function validateFields<T>(formik: FormikProps<T>, fields: (keyof T)[]) {
  const errors = fields.map((field) => formik.errors[field])
  console.error({
    errors,
    cibValue: formik.values['identificationCIB' as keyof T],
    cibError: formik.errors['identificationCIB' as keyof T],
    values: formik.values,
  })
  errors.forEach((err, index) => err && formik.validateField(fields[index] as string))
  return errors.some(Boolean)
}
export function Stepper({
  renderStep,
  onSubmit,
  isLoading,
  steps,
  canGoToNextStep,
  showLastStep,
  error,
  canSelectStep,
}: StepperProps) {
  const [formNumber, setFormNumber] = useState<number>(0)
  const numberOfSteps = steps.length - 1
  const prevButtonOn = formNumber > 0 && formNumber < numberOfSteps
  const isLastStep = formNumber === numberOfSteps
  const [submittedSteps, setSubmittedSteps] = useState<number[]>([])
  function nextForm() {
    markStepAsSubmitted(formNumber)
    if (canGoToNextStep(formNumber)) {
      setFormNumber((prev) => prev + 1)
    }
  }
  function markStepAsSubmitted(step: number) {
    if (!submittedSteps.includes(step)) {
      setSubmittedSteps([...submittedSteps, step])
    }
  }

  function isStepSubmitted(step: number) {
    return submittedSteps.includes(step)
  }

  function previousForm(): void {
    setFormNumber((prev) => prev - 1)
  }
  const currentShowingStepIndex = showLastStep ? numberOfSteps : formNumber
  const isSaveStep = formNumber === steps.length - 2
  const nextButtonOn = !isSaveStep
  return (
    <>
      <StepsLabel steps={steps} selected={currentShowingStepIndex} setFormNumber={setFormNumber} canSelectStep={canSelectStep} />
      <div className='card-body py-3'>
        <FormSelected
          stepSubmitted={isStepSubmitted(currentShowingStepIndex)}
          renderStep={renderStep}
          footer={
            <div className='d-flex justify-content-center'>
              {!showLastStep && (
                <div className='w-400px p-10 d-flex flex-row justify-content-around'>
                  {prevButtonOn && (
                    <PreviousButton
                      selected={formNumber}
                      onClick={previousForm}
                      onSave={isLoading}
                    />
                  )}
                  {nextButtonOn && <NextButton onClick={nextForm} selected={formNumber} />}
                  {isSaveStep && <SubmitButton isLoading={isLoading} />}
                </div>
              )}
            </div>
          }
          isLastStep={isLastStep}
          onSubmit={onSubmit}
          selected={currentShowingStepIndex}
        />
        <FormError status={error} />
      </div>
    </>
  )
}
