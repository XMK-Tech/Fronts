import {useFormik} from 'formik'
import React, {useEffect, useState} from 'react'
import {Link, useHistory, useParams} from 'react-router-dom'
import * as Yup from 'yup'
import {
  SubmitButtonProps,
  WizardButtonProps,
} from '../../admin/management/Register/SubsRegisterPage'

import {toAbsoluteUrl} from '../../../../_metronic/helpers'
import Form from '../../../components/Form/Form'
import {
  createFiscalProcedures,
  getFiscalProcedure,
  updateFiscalProcedures,
} from '../../../services/FiscalProcedureApi'
import {parametersData, getParameterLabel} from './getParameterLabel'
import {masks} from '../../../components/Form/FormInput'
import {useProprieties, proprietyToSelect} from './useProprieties'
import {CustomButton} from '../../../components/CustomButton/CustomButton'

const fiscalProcedureRegisterSchema = Yup.object().shape({
  proprietyId: Yup.object().required('Necessário inserir Propriedade').nullable(),
  intimationYear: Yup.string()
    .min(4, 'Mínimo de 4 caracteres')
    .max(4, 'Máximo de 4 caracteres')
    .required('Necessário inserir Ano referente á intimação'),
  paramType: Yup.array()
    .min(1, 'Necessário inserir Tipo de Parâmetro')
    .required('Necessário inserir Tipo de Parâmetro'),
  processNumber: Yup.string(),
  status: Yup.string().min(0, 'Necessário inserir status').required('Necessário inserir status'),
})

const defaultInitialValues = {
  proprietyId: null as {value: string; label: string} | null,
  intimationYear: '',
  paramType: [] as {value: string; label: string}[],
  status: '',
  processNumber: '',
}
type ValueType = typeof defaultInitialValues
type EditProps = {
  id: string
}

const LastStep = (props: EditProps) => (
  <div className='d-flex justify-content-center card-body pt-3 pb-15'>
    <form className='w-800px d-flex p-15 shadow rounded bg-light justify-content-center'>
      <div className='d-flex flex-column p-10 w-500px h-300px rounded bg-white justify-content-center'>
        <div className='d-flex fw-bolder text-center fs-1 mb-1 '>
          O seu Cadastro de Procedimento Fiscal foi efetuado com Sucesso !{' '}
        </div>
        <br />

        <div className=' fw-bolder text-center fs-6 text-muted mb-1 '>
          Você pode visualizar e editar em: <br /> Gerenciamento/Consulta de Procedimentos Fiscais{' '}
        </div>
        <Link
          to={props.id ? '/ITR/FiscalProcedureDetails/' + props.id : '/ITR/ConsultFiscalProcedure'}
          className='p-10 d-flex flex-row justify-content-around'
        >
          <button type='button' className='btn btn-sm btn-primary'>
            Continuar
          </button>
        </Link>
      </div>
    </form>
  </div>
)

const FormSelected: React.FC<FiscalProcedureFormSelectedProps> = ({
  selected,
  footer,
  initialValues,
  id,
  startSave,
  endSave,
}) => {
  const history = useHistory()
  const isLastStep = selected === 1
  const {proprieties} = useProprieties()
  const [isLoading, setIsLoading] = useState(false)
  const proprietyList = proprieties

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: fiscalProcedureRegisterSchema,
    enableReinitialize: true,
    onSubmit: async (values, {setStatus}) => {
      startSave && startSave()
      if (id) {
        setIsLoading(true)
        try {
          await updateFiscalProcedures(id, {
            ...values,
            proprietyId: values.proprietyId?.value as string,
            taxParams: values.paramType.map((item) => Number(item.value)),
            status: Number(values.status),
          }).finally(() => setIsLoading(false))
        } catch (err) {
          setStatus({mesage: err})
        }
      } else {
        setIsLoading(true)
        try {
          await createFiscalProcedures({
            ...values,
            proprietyId: values.proprietyId?.value as string,
            taxParams: values.paramType.map((item) => Number(item.value)),
            status: Number(values.status),
          }).finally(() => setIsLoading(false))
        } catch (err) {
          setStatus({mesage: err})
        }
      }
      endSave && endSave()
    },
  })

  return !isLastStep ? (
    <Form
      form={formik}
      columns={[
        {
          inputs: [
            {
              label: 'Propriedade',
              inputName: 'proprietyId',
              isMulti: false,
              type: 'selectMultiple',
              dataSelectMultiple: proprietyList,
            },
            {
              label: 'Parâmetros',
              inputName: 'paramType',
              isMulti: true,
              type: 'selectMultiple',
              dataSelectMultiple: parametersData,
              placeholder: 'Selecione os parâmetros',
            },
            {
              label: 'Status',
              inputName: 'status',
              type: 'select',
              data: [
                {id: 1, name: 'Não iniciado'},
                {id: 2, name: 'Em progresso'},
                {id: 3, name: 'Terminado'},
              ],
            },
          ],
        },
        {
          inputs: [
            {
              label: 'Ano referente à intimação',
              placeholder: 'Ex: 2022',
              inputName: 'intimationYear',
            },
            {
              label: 'Número do processo',
              placeholder: 'Ex: 1234567.00.2022.1.10.1234',
              inputName: 'processNumber',
              mask: masks.processNumber
            },
          ],
        },
        {
          className: 'justify-content-center mw-300px',
          content: (
            <img
              alt='Logo'
              src={toAbsoluteUrl('/media/illustrations/custom/addfile.svg')}
              className='img-fluid'
            />
          ),
        },
      ]}
      footer={
        <div className='p-10 d-flex flex-row justify-content-around'>
          <CustomButton
            isLoading={isLoading}
            onSubmit={() => formik.handleSubmit()}
            label={id ? 'Editar' : 'Cadastrar'}
          />
        </div>
      }
    />
  ) : (
    <LastStep id={id} />
  )
}
const SubmitButton: React.FC<SubmitButtonProps> = ({isLoading: onSave}) => {
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
const StepSelected: React.FC<FiscalProcedureFormSelectedProps> = ({selected}) => {
  const activeStepStyle =
    'px-4 card-label fw-bolder fs-6 mb-1 border-bottom border-primary text-primary'
  const disabledStepStyle = 'px-4 card-label fw-bolder fs-6 mb-1 '

  return (
    <div className='pb-3 d-flex flex-row justify-content-center'>
      <span className={selected === 0 ? activeStepStyle : disabledStepStyle}>Informações</span>
      <span className={selected === 2 ? activeStepStyle : disabledStepStyle}>Concluido</span>
    </div>
  )
}

type FiscalProcedureFormSelectedProps = {
  selected: number
  footer?: React.ReactNode
  initialValues: ValueType
  id: string
  startSave?: () => void
  endSave?: () => void
  onSave?: boolean
}

const PreviousButton: React.FC<WizardButtonProps> = ({selected, onClick, onSave}) => {
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
const NextButton: React.FC<WizardButtonProps> = ({selected, onClick}) => {
  if (selected < 0) {
    return (
      <button onClick={() => onClick()} type='button' className='btn btn-sm btn-primary'>
        Próximo
      </button>
    )
  }
  return null
}

const UserTable: React.FC<{}> = () => {
  const [prevButtonOn, setPrevButtonOn] = useState<boolean>(false)
  const [onSave, setOnsave] = useState<boolean>(false)
  const [initialValues, setInitialValues] = useState(defaultInitialValues)
  const [formNumber, setFormNumber] = useState<number>(0)

  const {id} = useParams<{id: string}>()

  useEffect(() => {
    if (id) {
      getFiscalProcedure(id).then(({data: data}) => {
        setInitialValues({
          paramType: data.taxParams.map((i: number) => ({
            value: String(i),
            label: getParameterLabel(i),
          })),
          intimationYear: data.intimationYear,
          processNumber: data.processNumber,
          status: data.status,
          proprietyId: proprietyToSelect(data.propriety || {}),
        })
      })
    }
  }, [id])
  function startSave(): void {
    setOnsave(true)
  }
  function endSave(): void {
    setOnsave(false)

    nextForm()
  }
  function nextForm(): void {
    setFormNumber((prev) => prev + 1)

    if (formNumber === 1) {
      setPrevButtonOn(false)
    } else {
      setPrevButtonOn(true)
    }
  }
  function previousForm(): void {
    if (formNumber === 1) {
      setPrevButtonOn(false)
    } else setPrevButtonOn(false)
    setFormNumber((prev) => prev - 1)
  }
  return (
    <>
      <div className={`card`}>
        <div className='d-flex flex-row'>
          <div className='card-header border-0 pt-5'>
            <h3 className='card-title align-items-start flex-column'>
              <span className='card-label fw-bolder fs-3 mb-1'>
                {id ? 'Editar ' : 'Cadastro de '}
                Procedimento fiscal
              </span>
            </h3>
          </div>
        </div>
        <StepSelected selected={formNumber} initialValues={initialValues} id={id} />
        <div className='card-body py-3'>
          <FormSelected
            footer={
              <div className='d-flex justify-content-center'>
                <div className='w-400px p-10 d-flex flex-row justify-content-around'>
                  <PreviousButton selected={formNumber} onClick={previousForm} onSave={onSave} />
                  <NextButton onClick={nextForm} selected={formNumber} />
                  {formNumber == 0 && <SubmitButton isLoading={onSave} />}
                </div>
              </div>
            }
            selected={formNumber}
            initialValues={initialValues}
            id={id}
            onSave={onSave}
            startSave={startSave}
            endSave={endSave}
          />
        </div>
      </div>
    </>
  )
}

function FiscalProcedureRegister() {
  return <UserTable />
}

export default FiscalProcedureRegister
