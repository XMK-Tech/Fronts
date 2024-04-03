import {FormikProps, useFormik} from 'formik'
import React, {useEffect, useState} from 'react'
import {Link, useHistory, useParams} from 'react-router-dom'
import {TypeOf} from 'yup'
import * as Yup from 'yup'
import {
  validateCNPJ,
  validateCPF,
  validateEmail,
  validateUF,
  validateCep,
  validatePhone,
} from 'validations-br'
import {toAbsoluteUrl} from '../../../../../_metronic/helpers'
import {createFranchise, getFranchise, updateFranchise} from '../../../../services/FranchisesApi'
import {
  createBackOfficeAdminUser,
  getUser,
  updateBackOfficeAdminUser,
} from '../../../../services/UsersApi'
import {wait} from '../../../../utils'
import {
  RegisterFormModelInput,
  useStates,
  useCities,
  RegisterFormModelColumn,
} from '../../../../../components/RegisterFormModel'
import {SelectInput} from '../../../../../components/SelectInput'
import {RegisterForm, RegisterFormImgColumn, RegisterFormInput} from './AdminRegisterPage'
import {formatCnpj} from '../../../../utils/functions'

const userRegisterSchema = Yup.object().shape({
  franchiseName: Yup.string()
    .min(3, 'Mínimo de 3 caracteres')
    .max(50, 'Máximo de 50 caracteres')
    .required('Necessário inserir Razão Social'),
  franchiseDocument: Yup.string().test('is-cnpj', 'CNPJ nao é valido', (value) =>
    validateCNPJ(value || '')
  ),
  franchiseStreet: Yup.string()
    .min(3, 'Mínimo de 3 caracteres')
    .max(50, 'Máximo de 50 caracteres')
    .required('Necessário inserir Endereço'),
  franchiseNeighborhood: Yup.string()
    .min(3, 'Mínimo de 3 caracteres')
    .max(50, 'Máximo de 50 caracteres')
    .required('Necessário inserir Bairro'),
  franchiseZipCode: Yup.string().test('is-cep', 'CEP nao é valido', (value) =>
    validateCep(value || '')
  ),
  franchisePhone: Yup.string().test('is-phone', 'Telefone nao é valido', (value) =>
    validatePhone(value || '')
  ),
  franchiseEmail: Yup.string().test('is-email', 'E-mail nao é valido', (value) =>
    validateEmail(value || '')
  ),
  franchiseUF: Yup.string().required('Necessário escolher UF'),
  franchiseCity: Yup.string().required('Necessário escolher Município'),
  franchiseAddressNumber: Yup.string()
    .max(50, 'Máximo de 50 caracteres')
    .required('Necessário inserir Número'),
  userName: Yup.string()
    .min(3, 'Mínimo de 3 caracteres')
    .max(50, 'Máximo de 50 caracteres')
    .required('Necessário inserir Nome'),
  userDocument: Yup.string().test('is-cpf', 'CPF nao é valido', (value) =>
    validateCPF(value || '')
  ),
  userStreet: Yup.string()
    .min(3, 'Mínimo de 3 caracteres')
    .max(50, 'Máximo de 50 caracteres')
    .required('Necessário inserir Endereço'),
  userUF: Yup.string().required('Necessário escolher UF'),
  userCity: Yup.string().required('Necessário escolher Município'),
  userEmail: Yup.string().test('is-email', 'E-mail nao é valido', (value) =>
    validateEmail(value || '')
  ),
  userPhone: Yup.string().test('is-phone', 'Telefone nao é valido', (value) =>
    validatePhone(value || '')
  ),
  userZipcode: Yup.string().test('is-cep', 'CEP nao é valido', (value) => validateCep(value || '')),
  userNeighborhood: Yup.string()
    .min(3, 'Mínimo de 3 caracteres')
    .max(50, 'Máximo de 50 caracteres')
    .required('Necessário inserir Bairro'),
  userAddressNumber: Yup.string()
    .max(50, 'Máximo de 50 caracteres')
    .required('Necessário inserir Número'),
})

const defaultInitialValues = {
  franchiseName: '',
  franchiseDocument: '',
  franchiseStreet: '',
  franchiseNeighborhood: '',
  franchisePhone: '',
  franchiseEmail: '',
  franchiseUF: '',
  franchiseCity: '',
  franchiseAddressNumber: '',
  franchiseZipCode: '',
  userName: '',
  userDocument: '',
  userStreet: '',
  userUF: '',
  userCity: '',
  userEmail: '',
  userPhone: '',
  userZipcode: '',
  userNeighborhood: '',
  userAddressNumber: '',
}
type ValueType = typeof defaultInitialValues

const LastStep = () => (
  <div className='d-flex justify-content-center card-body pt-3 pb-15'>
    <form className='w-800px d-flex p-15 shadow rounded bg-light justify-content-center'>
      <div className='d-flex flex-column p-10 w-500px h-300px rounded bg-white justify-content-center'>
        <div className='d-flex fw-bolder text-center fs-1 mb-1 '>
          O seu Cadastro de Subsidiária foi efetuado com Sucesso !{' '}
        </div>
        <br />

        <div className=' fw-bolder text-center fs-6 text-muted mb-1 '>
          Você pode visualizar e editar em: <br /> Consulta/Subsidiárias{' '}
        </div>
        <Link to='/admin/consulta/subs' className='p-10 d-flex flex-row justify-content-around'>
          <button type='button' className='btn btn-sm btn-primary'>
            Continuar
          </button>
        </Link>
      </div>
    </form>
  </div>
)

const Steps: React.FC<{selected: number; formik: FormikProps<ValueType>}> = ({
  selected,
  formik,
}) => {
  const states = useStates()
  const franchiseCities = useCities(formik.values.franchiseUF)
  const userCities = useCities(formik.values.userUF)

  if (selected === 0) {
    return (
      <>
        <RegisterFormModelColumn>
          <RegisterFormModelInput
            label='Razão Social'
            placeholder='Nome da Empresa'
            fieldProps={formik.getFieldProps('franchiseName')}
            touched={formik.touched.franchiseName}
            errors={formik.errors.franchiseName}
            type='franchiseName'
          />
          <RegisterFormModelInput
            label='CNPJ'
            placeholder='Ex.: 12.345.678.0001-00'
            fieldProps={formik.getFieldProps('franchiseDocument')}
            touched={formik.touched.franchiseDocument}
            errors={formik.errors.franchiseDocument}
            type='franchiseDocument'
          />
          <RegisterFormModelInput
            label='Endereço'
            placeholder='Ex.: Rua das Gaivotas'
            fieldProps={formik.getFieldProps('franchiseStreet')}
            touched={formik.touched.franchiseStreet}
            errors={formik.errors.franchiseStreet}
            type='franchiseStreet'
          />
          <RegisterFormModelInput
            label='Bairro'
            placeholder='Ex.: Vila Clóris'
            fieldProps={formik.getFieldProps('franchiseNeighborhood')}
            touched={formik.touched.franchiseNeighborhood}
            errors={formik.errors.franchiseNeighborhood}
            type='franchiseNeighborhood'
          />
          <RegisterFormModelInput
            label='CEP'
            placeholder='Ex.: 30672‑772'
            fieldProps={formik.getFieldProps('franchiseZipCode')}
            touched={formik.touched.franchiseZipCode}
            errors={formik.errors.franchiseZipCode}
            type='franchiseZipCode'
          />
        </RegisterFormModelColumn>

        <RegisterFormModelColumn>
          <RegisterFormModelInput
            label='Telefone'
            placeholder='(31) 9 9999-9999'
            fieldProps={formik.getFieldProps('franchisePhone')}
            touched={formik.touched.franchisePhone}
            errors={formik.errors.franchisePhone}
            type='franchisePhone'
          />
          <RegisterFormModelInput
            label='E-mail'
            placeholder='exemplo@email.com'
            fieldProps={formik.getFieldProps('franchiseEmail')}
            touched={formik.touched.franchiseEmail}
            errors={formik.errors.franchiseEmail}
            type='franchiseEmail'
          />
          <SelectInput
            label='UF'
            fieldProps={formik.getFieldProps('franchiseUF')}
            touched={formik.touched.franchiseUF}
            errors={formik.errors.franchiseUF}
            data={states}
          />
          <SelectInput
            label='Município'
            fieldProps={formik.getFieldProps('franchiseCity')}
            touched={formik.touched.franchiseCity}
            errors={formik.errors.franchiseCity}
            data={franchiseCities}
          />
          <RegisterFormModelInput
            label='Número'
            placeholder='Ex.: 123'
            fieldProps={formik.getFieldProps('franchiseAddressNumber')}
            touched={formik.touched.franchiseAddressNumber}
            errors={formik.errors.franchiseAddressNumber}
            type='franchiseAddressNumber'
          />
        </RegisterFormModelColumn>
        <RegisterFormImgColumn>
          <img
            alt='Logo'
            src={toAbsoluteUrl('/media/illustrations/custom/subsRegisterIllustration.svg')}
            className='img-fluid'
          />
        </RegisterFormImgColumn>
      </>
    )
  }
  if (selected === 1) {
    return (
      <>
        <RegisterFormModelColumn>
          <RegisterFormModelInput
            label='Nome'
            placeholder='Insira o Nome'
            fieldProps={formik.getFieldProps('userName')}
            touched={formik.touched.userName}
            errors={formik.errors.userName}
            type='userName'
          />
          <RegisterFormModelInput
            label='CPF'
            placeholder='Ex.: 123456789-10'
            fieldProps={formik.getFieldProps('userDocument')}
            touched={formik.touched.userDocument}
            errors={formik.errors.userDocument}
            type='userDocument'
          />
          <RegisterFormModelInput
            label='Endereço'
            placeholder='Ex.: Rua das Gaivotas'
            fieldProps={formik.getFieldProps('userStreet')}
            touched={formik.touched.userStreet}
            errors={formik.errors.userStreet}
            type='userStreet'
          />
          <SelectInput
            label='UF'
            fieldProps={formik.getFieldProps('userUF')}
            touched={formik.touched.userUF}
            errors={formik.errors.userUF}
            data={states}
          />
          <SelectInput
            label='Município'
            fieldProps={formik.getFieldProps('userCity')}
            touched={formik.touched.userCity}
            errors={formik.errors.userCity}
            data={userCities}
          />
        </RegisterFormModelColumn>

        <RegisterFormModelColumn>
          <RegisterFormModelInput
            label='Email'
            placeholder='exemplo@email.com'
            fieldProps={formik.getFieldProps('userEmail')}
            touched={formik.touched.userEmail}
            errors={formik.errors.userEmail}
            type='userEmail'
          />
          <RegisterFormModelInput
            label='Contato'
            placeholder='(31) 9 9999-9999'
            fieldProps={formik.getFieldProps('userPhone')}
            touched={formik.touched.userPhone}
            errors={formik.errors.userPhone}
            type='userPhone'
          />
          <RegisterFormModelInput
            label='CEP'
            placeholder='Ex.: 30672‑772'
            fieldProps={formik.getFieldProps('userZipcode')}
            touched={formik.touched.userZipcode}
            errors={formik.errors.userZipcode}
            type='userZipCode'
          />
          <RegisterFormModelInput
            label='Bairro'
            placeholder='Ex.: Vila Clóris'
            fieldProps={formik.getFieldProps('userNeighborhood')}
            touched={formik.touched.userNeighborhood}
            errors={formik.errors.userNeighborhood}
            type='userNeighborhood'
          />
          <RegisterFormModelInput
            label='Número'
            placeholder='Ex.: 123'
            fieldProps={formik.getFieldProps('userAddressNumber')}
            touched={formik.touched.userAddressNumber}
            errors={formik.errors.userAddressNumber}
            type='userAddressNumber'
          />
        </RegisterFormModelColumn>
        <RegisterFormImgColumn>
          <img
            alt='Logo'
            src={toAbsoluteUrl('/media/illustrations/custom/adminRegisterIllustration.svg')}
            className='img-fluid '
          />
        </RegisterFormImgColumn>
      </>
    )
  }
  return null
}
const FormSelected: React.FC<SubsFormSelectedProps> = ({
  selected,
  footer,
  initialValues,
  setInitialValues,
  startSave,
  endSave,
}) => {
  const history = useHistory()
  const {id} = useParams<{id: string}>()

  useEffect(() => {
    if (!id) return
    getFranchise(id).then((res) => setInitialValues && setInitialValues(res.data))
  }, [id])

  const isLastStep = selected === 2

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: userRegisterSchema,

    onSubmit: async (values) => {
      startSave && startSave()

      if (id) {
        const upFranchise = await updateFranchise(id, {
          name: values.userName,
          email: values.userEmail,
          document: values.userDocument,
          phoneNumber: Number(values.userPhone),
          username: values.userEmail,
          address: {
            street: values.userStreet,
            district: values.userNeighborhood,
            complement: '',
            zipcode: values.userZipcode,
            type: 1,
            cityId: values.userCity,
          },
        })
        updateBackOfficeAdminUser(
          id,
          {
            fullName: values.franchiseName,
            email: values.franchiseEmail,
            document: values.franchiseDocument,
            phoneNumber: Number(values.franchisePhone),
            username: values.franchiseEmail,
            address: {
              street: values.franchiseStreet,
              district: values.franchiseNeighborhood,
              complement: '',
              zipcode: values.franchiseZipCode,
              type: 1,
              cityId: values.franchiseCity,
            },
          },
          upFranchise.data.id
        )
      } else {
        const franchise = await createFranchise({
          name: values.franchiseName,
          email: values.userEmail,
          document: values.userDocument,
          phoneNumber: Number(values.userPhone),
          username: values.userEmail,
          address: {
            street: values.userStreet,
            district: values.userNeighborhood,
            complement: '',
            zipcode: values.userZipcode,
            type: 1,
            cityId: values.userCity,
          },
        })
        createBackOfficeAdminUser(
          {
            fullName: values.franchiseName,
            email: values.franchiseEmail,
            document: values.franchiseDocument,
            phoneNumber: Number(values.franchisePhone),
            username: values.franchiseEmail,
          },
          franchise.data.id
        )
      }

      endSave && endSave()
    },
  })
  return !isLastStep ? (
    <RegisterForm onSubmit={formik.handleSubmit} footer={footer}>
      <Steps formik={formik} selected={selected} />
    </RegisterForm>
  ) : (
    <LastStep />
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
const StepSelected: React.FC<SubsFormSelectedProps> = ({selected}) => {
  const activeStepStyle =
    'px-4 card-label fw-bolder fs-6 mb-1 border-bottom border-primary text-primary'
  const disabledStepStyle = 'px-4 card-label fw-bolder fs-6 mb-1 '

  return (
    <div className='pb-3 d-flex flex-row justify-content-center'>
      <span className={selected === 0 ? activeStepStyle : disabledStepStyle}>Subsidiária</span>
      <span className={selected === 1 ? activeStepStyle : disabledStepStyle}>Administrador</span>
      <span className={selected === 2 ? activeStepStyle : disabledStepStyle}>Concluído</span>
    </div>
  )
}

type SubsFormSelectedProps = {
  selected: number
  footer?: React.ReactNode
  initialValues: ValueType
  id: string
  setInitialValues?: (values: any) => void
  startSave?: () => void
  endSave?: () => void
  onSave?: boolean
}
export type WizardButtonProps = {
  selected: number
  onClick: () => void
  onSave?: boolean
}
export type SubmitButtonProps = {
  isLoading: boolean
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
  if (selected < 1) {
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
      getFranchise(id).then(({data: franchise}) => {
        setInitialValues({
          franchiseName: franchise.name,
          franchiseDocument: franchise.document,
          franchiseStreet: franchise.street,
          franchiseNeighborhood: franchise.neighborhood,
          franchisePhone: franchise.phone,
          franchiseEmail: franchise.secondaryPhone,
          franchiseUF: '',
          franchiseCity: franchise.city,
          franchiseAddressNumber: franchise.addressNumber,
          franchiseZipCode: '',
          userName: '',
          userDocument: '',
          userEmail: '',
          userStreet: '',
          userAddressNumber: '',
          userZipcode: '',
          userNeighborhood: '',
          userUF: '',
          userCity: '',
          userPhone: '',
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
                {id ? 'Editar Subsidiária' : 'Cadastro de Subsidiárias'}
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
                  {formNumber == 1 && <SubmitButton isLoading={onSave} />}
                </div>
              </div>
            }
            selected={formNumber}
            initialValues={initialValues}
            setInitialValues={(obj) => {
              setInitialValues({
                ...obj,
                name: obj.franchiseName,
              })
            }}
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

function SubsRegister() {
  return <UserTable />
}

export default SubsRegister
