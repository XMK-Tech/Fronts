import {FormikProps} from 'formik/dist/types'
import React, {useEffect, useState} from 'react'
import AccountEditInput from '../apps/chat/components/AccountEditInput'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {getEntitiesAgille, pathEntitiesAgille} from '../../services/EntitiesApi'
import {Link, useHistory} from 'react-router-dom'
import {useEntities, useModules} from '../../../setup/redux/hooks'
import {Module} from '../auth/redux/AuthTypes'
import IsLoadingList from '../../utils/components/IsLoadingList'
import {LogoInput} from './LogoInput'
import {parseCoordinate} from '../../utils/functions'
import {masks} from '../../components/Form/FormInput'
import {RegisterFormRadio} from '../../../components/RegisterFormSwitch'
import {FormError} from '../../../components/FormError'
import {useCities, useStates} from '../../../components/RegisterFormModel'
import {CustomButton} from '../../components/CustomButton/CustomButton'
import ITRCultureConfig from '../ITR/Components/ITRCultureConfig'
import {AttachmentDropZoneReview} from '../../utils/components/AttachmentDropZoneReview'

const userRegisterSchema = Yup.object().shape({
  name: Yup.string(),
  street: Yup.string(),
  responsibleName: Yup.string(),
  legalBasisWarning: Yup.string(),
  legalBasisNotice: Yup.string(),
  state: Yup.string().required('Nescessário informar o estado'),
  city: Yup.string().required('nescessário informar a cidade'),
})
const defaultCredentials: {
  user: string
  password: string
  administrativeCode: string
  contract: string
  document: string
  se: string
  card: string
} | null = null

const defaultInitialValues = {
  name: '',
  demoMode: false,
  entityImage: '',
  responsibleName: '',
  legalBasisWarning: '',
  legalBasisNotice: '',
  center: [0, 0],
  aliquot: '',
  hasCredentials: false,
  credentials: defaultCredentials,
  street: '',
  state: '',
  city: '',
  dteModel: '',
}

type ValueType = typeof defaultInitialValues

const UserTable: React.FC<{}> = () => {
  const [initialValues, setInitialValues] = React.useState(defaultInitialValues)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<{message: any} | null>(null)
  const [dteModel, setDteModel] = useState('')
  const history = useHistory()

  useEffect(() => {
    setLoading(true)
    getEntitiesAgille()
      .then(({data: entityData}) => {
        const rawCenter = entityData.itr?.center
        const center = parseCoordinate(rawCenter)
        setInitialValues({
          name: entityData.name ?? '',
          demoMode: entityData.demoMode ?? false,
          responsibleName: entityData.iss.responsibleName ?? '',
          legalBasisNotice: entityData.iss.legalBasisNotice ?? '',
          legalBasisWarning: entityData.iss.legalBasisWarning ?? '',
          entityImage: entityData.entityImage ?? '',
          center: center ?? [0, 0],
          aliquot: entityData.itr?.aliquot ?? '',
          credentials: entityData.itr?.credentials ?? defaultCredentials,
          hasCredentials: !!entityData.itr?.credentials?.user,
          street: entityData.address?.street ?? '',
          state: entityData.address?.stateId ?? '',
          city: entityData.address?.cityId ?? '',
          dteModel: entityData.dte.dteModel ?? '',
        })
      })
      .catch((err) => setError({message: err}))
      .finally(() => setLoading(false))
  }, [])

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: userRegisterSchema,
    enableReinitialize: true,
    onSubmit: async (values, {setStatus}) => {
      setLoading(true)
      try {
        await pathEntitiesAgille({
          name: values.name,
          demoMode: values.demoMode,
          entityImage: values.entityImage,
          address: {
            street: values.street,
            stateId: values.state,
            cityId: values.city,
          },
          iss: {
            responsibleName: values.responsibleName,
            legalBasisWarning: values.legalBasisWarning,
            legalBasisNotice: values.legalBasisNotice,
          },
          itr: {
            center: `[${values.center.join(';')}]`,
            aliquot: Number(values.aliquot),
            credentials: values.hasCredentials
              ? values.credentials
              : {
                  user: '',
                  password: '',
                  administrativeCode: '',
                  contract: '',
                  document: '',
                  se: '',
                  card: '',
                },
          },
          dte: {
            dteModel: dteModel,
          },
        })
        history.push('/auditor/configuracao/conta')
      } catch (err) {
        setStatus({message: err})
      } finally {
        setLoading(false)
      }
    },
  })

  const states = useStates('middleware')
  const cities = useCities(formik.values.state, 'middleware', () =>
    formik.setFieldValue('city', '')
  )

  return (
    <FormBody
      setDteModelUrl={setDteModel}
      states={states}
      cities={cities}
      formik={formik}
      loading={loading}
    />
  )
}

function FormBody({
  formik,
  loading,
  states,
  cities,
  setDteModelUrl: setDteModelUrl,
}: {
  formik: FormikProps<ValueType>
  loading: boolean
  setDteModelUrl: React.Dispatch<React.SetStateAction<string>>
  states?:
    | {
        id: string
        name: string
      }[]
    | undefined
  cities?:
    | {
        id: string
        name: string
      }[]
    | undefined
}) {
  const [showModalCulture, setShowModalCulture] = useState(false)
  const modules = useModules()
  useEntities()
  return (
    <>
      <div className={`card`}>
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bolder fs-3 mb-1'>Configurações do Município</span>
          </h3>
        </div>
        {loading ? (
          <IsLoadingList />
        ) : (
          <div className='card-body py-3'>
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label fw-bold fs-6'>Logo</label>

              <LogoInput
                entityImage={formik.values.entityImage}
                onUpload={(data: any) => {
                  formik.setFieldValue('entityImage', data.url)
                }}
              />
            </div>

            <AccountEditInput
              label='Municipio'
              placeholder='Prefeitura Curitiba'
              fieldProps={formik.getFieldProps('name')}
              touched={formik.touched.name}
              errors={formik.errors.name}
            ></AccountEditInput>

            <AccountEditInput
              label='Endereço'
              placeholder=' Ex.: Av. Cândido de Abreu, 817 - Centro Cívico, Curitiba - PR'
              fieldProps={formik.getFieldProps('street')}
              touched={formik.touched.street}
              errors={formik.errors.street}
            ></AccountEditInput>

            <AccountEditInput
              label='Auditor /Administrador'
              placeholder='Nome Completo'
              fieldProps={formik.getFieldProps('responsibleName')}
              touched={formik.touched.responsibleName}
              errors={formik.errors.responsibleName}
            ></AccountEditInput>
            <AccountEditInput
              label='Estado'
              placeholder='Estado'
              fieldProps={formik.getFieldProps('state')}
              touched={formik.touched.state}
              errors={formik.errors.state}
              type='select'
              data={states}
            ></AccountEditInput>
            <AccountEditInput
              label='Cidade'
              placeholder='Cidade'
              fieldProps={formik.getFieldProps('city')}
              touched={formik.touched.city}
              errors={formik.errors.city}
              type='select'
              data={cities}
            ></AccountEditInput>
            <AccountEditInput
              label='Latitude'
              placeholder='Adicione Latitude'
              fieldProps={formik.getFieldProps('center[0]')}
              mask={masks.number}
            ></AccountEditInput>

            <AccountEditInput
              label='Longitude'
              placeholder='Adicione Longitude'
              fieldProps={formik.getFieldProps('center[1]')}
              mask={masks.number}
            ></AccountEditInput>
            <AccountEditInput
              label='Alíquota ITR'
              placeholder='Adicione Alíquota ITR'
              fieldProps={formik.getFieldProps('aliquot')}
              mask={masks.number}
            ></AccountEditInput>
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label fw-bold fs-6'>Exemplo de modelo DTE</label>
              <AttachmentDropZoneReview
                value={formik.values.dteModel}
                acceptArchive='application/pdf'
                onSubmit={(_file, _attachmentId, _fileWithMeta, fileUrl) => setDteModelUrl(fileUrl)}
              />
            </div>
            <RegisterFormRadio
              fieldProps={formik.getFieldProps('demoMode')}
              errors={formik.errors.demoMode}
              touched={formik.touched.demoMode}
              label='Modo de Demonstração'
              formik={formik}
            />
            <RegisterFormRadio
              fieldProps={formik.getFieldProps('hasCredentials')}
              errors={formik.errors.hasCredentials}
              touched={formik.touched.hasCredentials}
              label='Habilitar integração com correios?'
              formik={formik}
            />
            {formik.values.hasCredentials && (
              <>
                <AccountEditInput
                  label='Usuário'
                  placeholder='Usuário'
                  fieldProps={formik.getFieldProps('credentials.user')}
                ></AccountEditInput>
                <AccountEditInput
                  label='Senha'
                  placeholder='Senha'
                  fieldProps={formik.getFieldProps('credentials.password')}
                ></AccountEditInput>
                <AccountEditInput
                  label='Código administrativo'
                  placeholder='Código administrativo'
                  fieldProps={formik.getFieldProps('credentials.administrativeCode')}
                ></AccountEditInput>
                <AccountEditInput
                  label='Contrato'
                  placeholder='Contrato'
                  fieldProps={formik.getFieldProps('credentials.contract')}
                ></AccountEditInput>
                <AccountEditInput
                  label='Documento'
                  placeholder='Documento'
                  fieldProps={formik.getFieldProps('credentials.document')}
                ></AccountEditInput>
                <AccountEditInput
                  label='SE'
                  placeholder='SE'
                  fieldProps={formik.getFieldProps('credentials.se')}
                ></AccountEditInput>
                <AccountEditInput
                  label='Cartão'
                  placeholder='Cartão'
                  fieldProps={formik.getFieldProps('credentials.card')}
                ></AccountEditInput>
              </>
            )}
          
            {!modules?.includes(Module.ContribuinteDTE) && (
              <>
                <AccountEditInput
                  label='Fundamentação Legal Notificação'
                  placeholder='Adicione Fundamentação Legal Notificação'
                  fieldProps={formik.getFieldProps('legalBasisWarning')}
                  touched={formik.touched.legalBasisWarning}
                  errors={formik.errors.legalBasisWarning}
                ></AccountEditInput>

                <AccountEditInput
                  label='Fundamentação Legal Autuação'
                  placeholder='Adicione Fundamentação Legal Autuação'
                  fieldProps={formik.getFieldProps('legalBasisNotice')}
                  touched={formik.touched.legalBasisNotice}
                  errors={formik.errors.legalBasisNotice}
                ></AccountEditInput>
              </>
            )}
          </div>
        )}

        <form onSubmit={formik.handleSubmit}>
          <div className='card-footer d-flex justify-content-end'>
            <FormError status={formik.status} />
            <div className='btn btn-light me-3'>
              <Link to={'/'}>Descartar</Link>
            </div>

            <button type='submit' className='btn btn-primary' disabled={loading}>
              {!loading ? (
                'Salvar alterações'
              ) : (
                <span className='indicator-progress' style={{display: 'block'}}>
                  Aguarde...{' '}
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              )}
            </button>
          </div>
          <FormError status={formik.status} />
        </form>
      </div>
     
    </>
  )
}

function AuditorSettingsAccountPage() {
  return <UserTable />
}

export default AuditorSettingsAccountPage
