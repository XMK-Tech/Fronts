import {FormikProps, useFormik} from 'formik'
import React, {useEffect, useState} from 'react'
import {useSelector, shallowEqual} from 'react-redux'
import {useHistory, useParams} from 'react-router-dom'
import * as Yup from 'yup'
import {RootState} from '../../../../../setup'
import {createEntitie, getEntitie, updateEntitie} from '../../../../services/EntitiesApi'
import {Franchise} from '../../../auth/redux/AuthTypes'
import {toAbsoluteUrl} from '../../../../../_metronic/helpers'
import {LogoInput} from '../../../auditor/LogoInput'
import {
  RegisterFormModelColumn,
  RegisterFormModelInput,
  useCities,
  useStates,
} from '../../../../../components/RegisterFormModel'
import {masks} from '../../../../components/Form/FormInput'
import {Attachment} from '../../../../services/AttachmentApi'
import {SelectInput} from '../../../../../components/SelectInput'
import {FormSteps} from '../../../../components/FormSteps/FormSteps'
import {LastStep} from '../../../../components/Form/FormSteps'
import {Stepper, validateFields} from '../../../../components/Stepper/Stepper'

const countyRegisterSchema = Yup.object().shape({
  countyName: Yup.string()
    .min(3, 'Mínimo de 3 caracteres')
    .max(50, 'Máximo de 50 caracteres')
    .required('Necessário inserir Razão Social'),
  countyDocument: Yup.string().required('Necessário inserir CNPJ'),
  countyStreet: Yup.string(),
  countyNeighborhood: Yup.string(),
  countyZipcode: Yup.string(),
  countyPhone: Yup.string(),
  countySecondaryPhone: Yup.string(),
  countyUF: Yup.string(),
  countyCity: Yup.string(),
  countyAddressNumber: Yup.string(),
  userName: Yup.string()
    .min(3, 'Mínimo de 3 caracteres')
    .max(50, 'Máximo de 50 caracteres')
    .required('Necessário inserir Nome'),
  userDocument: Yup.string().required('Necessário inserir CPF'),
  userStreet: Yup.string(),
  userUF: Yup.string(),
  userCity: Yup.string(),
  userEmail: Yup.string().required('Necessário inserir Email'),
  userPhone: Yup.string(),
  userZipcode: Yup.string(),
  userNeighborhood: Yup.string(),
  userAddressNumber: Yup.string(),
})

const defaultInitialValues = {
  countyName: '',
  countyDocument: '',
  countyStreet: '',
  countyUF: '',
  countyNeighborhood: '',
  countyPhone: '',
  countySecondaryPhone: '',
  countyZipcode: '',
  countyCity: '',
  countyAddressNumber: '',
  userName: '',
  databaseName: '',
  userDocument: '',
  userStreet: '',
  userUF: '',
  userCity: '',
  userEmail: '',
  userPhone: '',
  userZipcode: '',
  userNeighborhood: '',
  userAddressNumber: '',
  entityImage: '',
  canAccessITR: false,
  canAccessISS: false,
  canAccessDTE: false,
}
type ValueType = typeof defaultInitialValues

function Steps({
  formik,
  stepSubmitted,
  selected,
}: {
  formik: FormikProps<ValueType>
  stepSubmitted: boolean
  selected: number
}) {
  const states = useStates('middleware')
  const userCities = useCities(formik.values.userUF, 'middleware')
  const countyCities = useCities(formik.values.countyUF, 'middleware')
  const {id} = useParams<{id: string}>()
  return (
    <FormSteps selectedStep={selected}>
      <MunicipalRegisterSteeper
        stepSubmitted={stepSubmitted}
        formik={formik}
        states={states}
        cities={countyCities}
        id={id}
      />
      <AuditorRegisterSteeper
        stepSubmitted={stepSubmitted}
        formik={formik}
        states={states}
        cities={userCities}
      />
      <LastStep
        title={<>O seu Cadastro de Município foi efetuado com Sucesso !</>}
        subtitle={
          <>
            Você pode visualizar e editar em: <br /> Gerenciamento/Consulta de Municipios
          </>
        }
        link={'/backoffice/gerenciamento/consulta-municipios'}
        buttonLabel={'Confirmar'}
      />
    </FormSteps>
  )
}
const UserTable: React.FC<{}> = () => {
  const [initialValues, setInitialValues] = useState(defaultInitialValues)
  const [isLoading] = useState<boolean>(false)
  const [isFinished] = useState<boolean>(false)

  const {id} = useParams<{id: string}>()

  const selectedFranchise = useSelector<RootState>(
    ({auth}) => auth.selectedFranchise,
    shallowEqual
  ) as Franchise

  useEffect(() => {
    if (id) {
      getEntitie(id).then(({data: county}) => {
        const user = county?.responsible
        const permissions: string[] =
          user?.permissions?.map?.((permission: any) => permission.permissionName as string) ?? []
        const hasITRPermission = permissions.includes('ContribuinteDTE')
        const hasISSPermission = permissions.includes('Auditor')
        const hasDTEPermission = permissions.includes('AuditorDTE')

        setInitialValues({
          countyName: county.name ?? '',
          countyDocument: county.document ?? '',
          countyStreet: county.address.street ?? '',
          countyUF: county.address.stateId ?? '',
          countyNeighborhood: county.address.district ?? '',
          countyPhone: county.phone ?? '',
          countySecondaryPhone: county.secondaryPhone ?? '',
          countyZipcode: county.address.zipcode ?? '',
          countyCity: county.address.cityId ?? '',
          countyAddressNumber: county.address.number ?? '',
          userName: user?.fullname ?? '',
          userDocument: user?.document ?? '',
          userStreet: user?.address?.street ?? '',
          userUF: user?.address?.stateId ?? '',
          userCity: user?.address?.cityId ?? '',
          userEmail: user?.email ?? '',
          userPhone: user?.phoneNumber ?? '',
          userZipcode: user?.address?.zipcode ?? '',
          userNeighborhood: user?.address?.district ?? '',
          userAddressNumber: user?.address?.number ?? '',
          entityImage: county.entityImage ?? '',
          databaseName: '',
          canAccessISS: hasISSPermission,
          canAccessITR: hasITRPermission,
          canAccessDTE: hasDTEPermission,
        })
      })
    }
  }, [id])
  const history = useHistory()
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: countyRegisterSchema,
    validateOnMount: true,
    enableReinitialize: true,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values, {setStatus}) => {
      try {
        const user = {
          email: values.userEmail,
          document: values.userDocument,
          phoneNumber: values.userPhone,
          username: values.userEmail,
          fullName: values.userName,
          address: {
            street: values.userStreet,
            district: values.userNeighborhood,
            complement: '',
            zipcode: values.userZipcode,
            type: 1,
            cityId: values.userCity,
            number: values.userAddressNumber,
          },
        }
        const entitys = {
          name: values.countyName,
          franchiseId: selectedFranchise,
          entityImage: values.entityImage,
          responsible: user,
          permissions: getPermissions(
            values.canAccessISS,
            values.canAccessITR,
            values.canAccessDTE
          ),
          document: values.countyDocument,
          phoneNumber: values.countyPhone,
          secondaryPhoneNumber: values.countySecondaryPhone,
          dbName: values.databaseName.replace(/_/g, ''),
          address: {
            street: values.countyStreet,
            district: values.countyNeighborhood,
            complement: '',
            zipcode: values.countyZipcode,
            number: values.countyAddressNumber,
            cityId: values.countyCity,
            stateId: values.countyUF,
            cityName: values.countyCity,
            stateName: values.countyUF,
          },
        }
        if (id) {
          await updateEntitie(id, entitys)
        } else {
          await createEntitie(entitys)
        }
        history.push('/backoffice/gerenciamento/consulta-municipios')
      } catch (err) {
        setStatus({message: err})
      }
    },
  })
  const handleNextStep = (step: number): boolean => {
    switch (step) {
      case 0:
        return !validateFields(formik, [
          'countyCity',
          'countyDocument',
          'countyName',
          'countyPhone',
          'countyStreet',
          'countyUF',
          'countyZipcode',
        ])
      case 1:
        return !validateFields(formik, [
          'userAddressNumber',
          'userCity',
          'userDocument',
          'userEmail',
          'userName',
          'userPhone',
          'userStreet',
          'userUF',
          'userZipcode',
        ])
    }
    return true
  }
  return (
    <>
      <div className={`card`}>
        <div className='d-flex flex-row'>
          <div className='card-header border-0 pt-5'>
            <h3 className='card-title align-items-start flex-column'>
              <span className='card-label fw-bolder fs-3 mb-1'>
                {id ? 'Editar Município' : 'Cadastro de Municípios'}
              </span>
            </h3>
          </div>
        </div>

        <Stepper
          canGoToNextStep={handleNextStep}
          renderStep={(i, stepSubmitted) => (
            <Steps key={i} formik={formik} selected={i} stepSubmitted={stepSubmitted} />
          )}
          isLoading={isLoading}
          showLastStep={isFinished}
          onSubmit={formik.handleSubmit}
          error={formik.status}
          steps={['Município', 'Auditor', 'Concluído']}
        />
      </div>
    </>
  )
}

function MunicipalRegisterSteeper({
  formik,
  states,
  cities,
  id,
  stepSubmitted,
}: {
  formik: FormikProps<ValueType>
  states: {id: string; name: string}[] | undefined
  cities: {id: string; name: string}[] | undefined
  stepSubmitted: boolean
  id?: string
}) {
  const accessModules = (
    <div className='d-flex'>
      <div className='form-check me-15'>
        <input
          className='form-check-input '
          type='checkbox'
          checked={formik.values.canAccessISS}
          onChange={(e) => formik.setFieldValue('canAccessISS', e.target.checked)}
          id='checkBoxISS'
        />
        <label className='form-check-label' htmlFor='checkBoxISS'>
          ISS
        </label>
      </div>
      {process.env.REACT_APP_DTE === 'ativo' && (
        <div className='form-check me-15'>
          <input
            className='form-check-input'
            type='checkbox'
            checked={formik.values.canAccessDTE}
            onChange={(e) => formik.setFieldValue('canAccessDTE', e.target.checked)}
            id='checkBoxDTE'
          />
          <label className='form-check-label' htmlFor='checkBoxDTE'>
            DTE
          </label>
        </div>
      )}
      <div className='form-check me-15'>
        <input
          className='form-check-input'
          type='checkbox'
          checked={formik.values.canAccessITR}
          onChange={(e) => formik.setFieldValue('canAccessITR', e.target.checked)}
          id='checkBoxITR'
        />
        <label className='form-check-label' htmlFor='checkBoxITR'>
          ITR
        </label>
      </div>
    </div>
  )
  return (
    <>
      <RegisterFormModelColumn>
        <RegisterFormModelInput
          label='Nome'
          placeholder='Nome do municipios'
          fieldProps={formik.getFieldProps('countyName')}
          errors={formik.errors.countyName}
          touched={formik.touched.countyName || stepSubmitted}
          type='text'
        />
        <RegisterFormModelInput
          label='CNPJ'
          placeholder='Ex.: 12.345.678.0001-00'
          fieldProps={formik.getFieldProps('countyDocument')}
          errors={formik.errors.countyDocument}
          touched={formik.touched.countyDocument || stepSubmitted}
          mask={masks.cnpj}
          type='text'
        />

        <RegisterFormModelInput
          label='Endereço'
          placeholder='Ex.: Rua das Gaivotas'
          fieldProps={formik.getFieldProps('countyStreet')}
          errors={formik.errors.countyStreet}
          touched={formik.touched.countyStreet || stepSubmitted}
          type='text'
        />
        <SelectInput
          label='Município'
          fieldProps={formik.getFieldProps('countyCity')}
          errors={formik.errors.countyCity}
          touched={formik.touched.countyCity || stepSubmitted}
          data={cities}
        />
        <RegisterFormModelInput
          label='Bairro'
          placeholder='Ex.: Vila Clóris'
          fieldProps={formik.getFieldProps('countyNeighborhood')}
          errors={formik.errors.countyNeighborhood}
          touched={formik.touched.countyNeighborhood || stepSubmitted}
          type='text'
        />
        <div className='pt-3'>
          <strong className=''>
            <p>Este municipio terá acesso a quais módulos?</p>
          </strong>
        </div>
        {accessModules}
      </RegisterFormModelColumn>
      <RegisterFormModelColumn>
        <RegisterFormModelInput
          label='Celular'
          placeholder='(31) 9 9999-9999'
          fieldProps={formik.getFieldProps('countyPhone')}
          errors={formik.errors.countyPhone}
          touched={formik.touched.countyPhone || stepSubmitted}
          mask={masks.phone}
          type='text'
        />
        <RegisterFormModelInput
          label='CEP'
          placeholder='Ex.: 30672-772'
          fieldProps={formik.getFieldProps('countyZipcode')}
          errors={formik.errors.countyZipcode}
          touched={formik.touched.countyZipcode || stepSubmitted}
          mask={masks.cep}
          type='text'
        />

        <SelectInput
          label='Estado'
          fieldProps={formik.getFieldProps('countyUF')}
          errors={formik.errors.countyUF}
          touched={formik.touched.countyUF || stepSubmitted}
          data={states}
        />
        <RegisterFormModelInput
          label='Número'
          placeholder='Ex.: 123'
          fieldProps={formik.getFieldProps('countyAddressNumber')}
          errors={formik.errors.countyAddressNumber}
          touched={formik.touched.countyAddressNumber || stepSubmitted}
          type='text'
        />

        {!!id ? (
          <div
            style={{
              height: '82px',
            }}
          />
        ) : (
          <RegisterFormModelInput
            label='Nome do banco de dados'
            placeholder='Ex: itajai'
            fieldProps={formik.getFieldProps('databaseName')}
            errors={formik.errors.databaseName}
            touched={formik.touched.databaseName || stepSubmitted}
            mask={masks.databaseName}
            type='text'
          />
        )}
      </RegisterFormModelColumn>
      <RegisterFormModelColumn container='center'>
        <div className='justify-content-center  mw-300px'>
          <img
            alt='Logo'
            src={toAbsoluteUrl('/media/illustrations/custom/worldMap.svg')}
            className='img-fluid'
          />
        </div>
      </RegisterFormModelColumn>
    </>
  )
}

function AuditorRegisterSteeper({
  formik,
  states,
  cities,
  stepSubmitted,
}: {
  formik: FormikProps<ValueType>
  states: {id: string; name: string}[] | undefined
  cities: {id: string; name: string}[] | undefined
  stepSubmitted: boolean
}) {
  return (
    <>
      <RegisterFormModelColumn>
        <RegisterFormModelInput
          label='Nome'
          placeholder='Ex.: 123456789-10'
          fieldProps={formik.getFieldProps('userName')}
          errors={formik.errors.userName}
          touched={formik.touched.userName || stepSubmitted}
          type='text'
        />
        <RegisterFormModelInput
          label='CPF'
          placeholder='Insira o Nome'
          fieldProps={formik.getFieldProps('userDocument')}
          errors={formik.errors.userDocument}
          touched={formik.touched.userDocument || stepSubmitted}
          mask={masks.cpf}
          type='text'
        />
        <RegisterFormModelInput
          label='Endereço'
          placeholder='Ex.: Rua das Gaivotas'
          fieldProps={formik.getFieldProps('userStreet')}
          errors={formik.errors.userStreet}
          touched={formik.touched.userStreet || stepSubmitted}
          type='text'
        />

        <SelectInput
          label='Estado'
          fieldProps={formik.getFieldProps('userUF')}
          errors={formik.errors.userUF}
          touched={formik.touched.userUF || stepSubmitted}
          data={states}
        />
        <SelectInput
          label='Município'
          fieldProps={formik.getFieldProps('userCity')}
          errors={formik.errors.userCity}
          touched={formik.touched.userCity || stepSubmitted}
          data={cities}
        />
        <LogoInput
          entityImage={formik.values.entityImage}
          onUpload={(data: Attachment) => {
            formik.setFieldValue('entityImage', data.url)
          }}
        />
      </RegisterFormModelColumn>
      <RegisterFormModelColumn>
        <RegisterFormModelInput
          label='Email'
          placeholder='exemplo@email.com'
          fieldProps={formik.getFieldProps('userEmail')}
          errors={formik.errors.userEmail}
          touched={formik.touched.userEmail || stepSubmitted}
          type='text'
        />
        <RegisterFormModelInput
          label='Celular'
          placeholder='(31) 9 9999-9999'
          fieldProps={formik.getFieldProps('userPhone')}
          errors={formik.errors.userPhone}
          touched={formik.touched.userPhone || stepSubmitted}
          mask={masks.phone}
          type='text'
        />
        <RegisterFormModelInput
          label='CEP'
          placeholder='Ex.: 30672‑772'
          fieldProps={formik.getFieldProps('userZipcode')}
          errors={formik.errors.userZipcode}
          touched={formik.touched.userZipcode || stepSubmitted}
          mask={masks.cep}
          type='text'
        />
        <RegisterFormModelInput
          label='Bairro'
          placeholder='Ex.: Vila Clóris'
          fieldProps={formik.getFieldProps('userNeighborhood')}
          errors={formik.errors.userNeighborhood}
          touched={formik.touched.userNeighborhood || stepSubmitted}
          type='text'
        />
        <RegisterFormModelInput
          label='Número'
          placeholder='Ex.: 123'
          fieldProps={formik.getFieldProps('userAddressNumber')}
          errors={formik.errors.userAddressNumber}
          touched={formik.touched.userAddressNumber || stepSubmitted}
          type='text'
        />
      </RegisterFormModelColumn>
      <RegisterFormModelColumn container='center'>
        <div className='justify-content-center  mw-300px'>
          <img
            alt='Logo'
            src={toAbsoluteUrl('/media/illustrations/custom/adminRegisterIllustration.svg')}
            className='img-fluid'
          />
        </div>
      </RegisterFormModelColumn>
    </>
  )
}

export function getPermissions(
  auditor: boolean,
  ContribuinteDTE: boolean,
  AuditorDTE: boolean
): ('Auditor' | 'ContribuinteDTE' | 'AuditorDTE')[] {
  const permissions: ('Auditor' | 'ContribuinteDTE' | 'AuditorDTE')[] = []
  if (auditor) {
    permissions.push('Auditor')
  }
  if (ContribuinteDTE) {
    permissions.push('ContribuinteDTE')
  }
  if (AuditorDTE) {
    permissions.push('AuditorDTE')
  }

  return permissions
}

function CountyRegister() {
  return <UserTable />
}

export default CountyRegister
