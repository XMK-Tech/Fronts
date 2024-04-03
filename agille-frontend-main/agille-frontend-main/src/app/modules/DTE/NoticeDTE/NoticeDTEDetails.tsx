import {DetailsNotificationComponent} from '../../auditor/DetailsNotification'
import {useFormik} from 'formik'
import React, {useEffect, useState} from 'react'
import {
  RegisterFormModelColumn,
  RegisterFormModelInput,
} from '../../../../components/RegisterFormModel'
import {CustomButton} from '../../../components/CustomButton/CustomButton'
import {masks} from '../../../components/Form/FormInput'
import ModeloModal, {ModalErrorFooter} from '../../../utils/components/ModeloModal'
import {RegisterForm} from '../../admin/management/Register/AdminRegisterPage'
import InfoModel from '../../ITR/Components/InfoModel'
import {getEntitiesAgille} from '../../../services/EntitiesApi'
import {getArAddress, postAr, postJoin} from '../../../services/NoticeApi'
import {RegisterFormSwitch} from '../../../../components/RegisterFormSwitch'
import {ArFormModal} from '../../ITR/FIscalProcedure/terms/ArTerm'

export default function DetailsDTENotification() {
  return <DetailsNotificationComponent report={true} ar={true} />
}

export function ArDialog({
  showModalAr,
  setShowModalAr,
  id,
}: {
  showModalAr: boolean
  setShowModalAr: React.Dispatch<React.SetStateAction<boolean>>
  id: string
}) {
  const defaultInitialValues = {
    additionalInformation: '',
    recipient: {
      street: '',
      number: '',
      cityName: '',
      stateName: '',
      complement: '',
      zipCode: '',
      description: '',
    },
    devolution: {
      street: '',
      number: '',
      cityName: '',
      stateName: '',
      complement: '',
      zipCode: '',
      description: '',
    },
  }
  const [initialValues, setInitialValues] = useState(defaultInitialValues)
  const [credentials, setCredentials] = useState<any>()
  useEffect(() => {
    getEntitiesAgille().then((res) => setCredentials(res.data.itr.credentials))
    if (id) {
      getArAddress(id).then(({data}) => {
        setInitialValues({
          additionalInformation: data.additionalInformation ?? '',
          recipient: {
            street: data.recipient?.street ?? '',
            number: data.recipient?.number ?? '',
            cityName: data.recipient?.cityName ?? '',
            complement: data.recipient?.complement ?? '',
            stateName: data.recipient?.stateName ?? '',
            zipCode: data.recipient?.zipCode ?? '',
            description: data.recipient?.description ?? '',
          },
          devolution: {
            street: data.devolution?.street ?? '',
            number: data.devolution?.number ?? '',
            cityName: data.devolution?.cityName ?? '',
            complement: data.devolution?.complement ?? '',
            stateName: data.devolution?.stateName ?? '',
            zipCode: data.devolution?.zipCode ?? '',
            description: data.devolution?.description ?? '',
          },
        })
      })
    }
  }, [id])
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: '',
    enableReinitialize: true,
    onSubmit: async (values, {setStatus}) => {
      setIsLoading(true)
      try {
        await postAr(id, {
          additionalInformation: values.additionalInformation,
          recipient: {
            cityName: values.recipient.cityName,
            complement: values.recipient.complement,
            description: values.recipient.description,
            number: values.recipient.number,
            stateName: values.recipient.stateName,
            street: values.recipient.street,
            zipCode: values.recipient.zipCode,
          },
          devolution: {
            cityName: values.devolution.cityName,
            complement: values.devolution.complement,
            description: values.devolution.description,
            number: values.devolution.number,
            street: values.devolution.street,
            stateName: values.devolution.stateName,
            zipCode: values.devolution.zipCode,
          },
        })
        setShowModalAr(false)
      } catch (err) {
        setStatus({message: err})
      }

      setIsLoading(false)
    },
  })
  const [isLoading, setIsLoading] = useState(false)

  return (
    <ArFormModal
      showModalAr={showModalAr}
      setShowModalAr={setShowModalAr}
      credentials={credentials}
      formik={formik}
      isLoading={isLoading}
    />
  )
}

export function JoinTermDialog({
  showModalJoin: showModalJoin,
  setShowModalJoin: setShowModalJoin,
  id,
}: {
  showModalJoin: boolean
  setShowModalJoin: React.Dispatch<React.SetStateAction<boolean>>
  id: string
}) {
  const defaultInitialValues = {
    homePageNumber: '',
    finalPageNumber: '',
    atualPageNumber: '',
    spaceForLetterhead: false,
    withObjection: false,
    proprietyCib: '',
    documentNumber: '',
    processNumber: '',
  }
  const formik = useFormik({
    initialValues: defaultInitialValues,
    validationSchema: '',
    enableReinitialize: true,
    onSubmit: async (values, {setStatus}) => {
      try {
        setIsLoading(true)
        await postJoin(id, {
          homePageNumber: Number(values.homePageNumber),
          finalPageNumber: Number(values.finalPageNumber),
          atualPageNumber: Number(values.atualPageNumber),
          spaceForLetterhead: values.spaceForLetterhead,
          withObjection: values.withObjection,
          proprietyCib: values.proprietyCib,
          documentNumber: values.documentNumber,
          processNumber: values.processNumber,
        })
        setIsLoading(false)
      } catch (err: any) {
        setStatus({message: err})
      }
      setIsLoading(false)
    },
  })
  const [isLoading, setIsLoading] = useState(false)
  return (
    <ModeloModal
      title='Gerar termo de juntada de AR'
      show={showModalJoin}
      onHide={() => setShowModalJoin(!showModalJoin)}
      body={
        <RegisterForm onSubmit={formik.handleSubmit}>
          <RegisterFormModelColumn>
            <div className='d-flex flex-column justify-content-center algin-items-center'>
              <RegisterFormModelInput
                label='Página inicial referente a etapa'
                placeholder=''
                fieldProps={formik.getFieldProps('homePageNumber')}
                touched={undefined}
                errors={undefined}
                type='string'
                mask={Number}
              />
              <RegisterFormModelInput
                label='Página atual do documento'
                placeholder=''
                fieldProps={formik.getFieldProps('atualPageNumber')}
                touched={undefined}
                errors={undefined}
                type='string'
                mask={Number}
              />
              <RegisterFormModelInput
                label='Página final referente a etapa'
                placeholder=''
                fieldProps={formik.getFieldProps('finalPageNumber')}
                touched={undefined}
                errors={undefined}
                type='string'
                mask={Number}
              />
              <RegisterFormSwitch
                fieldProps={formik.getFieldProps('spaceForLetterhead')}
                label='Espaço para papel timbrado?'
              />
              <RegisterFormSwitch
                fieldProps={formik.getFieldProps('withObjection')}
                label='Com objeção?'
              />
              <RegisterFormModelInput
                label='CIB da propriedade'
                placeholder=''
                fieldProps={formik.getFieldProps('proprietyCib')}
                touched={undefined}
                errors={undefined}
                type='string'
              />
              <RegisterFormModelInput
                label='Documento'
                placeholder=''
                fieldProps={formik.getFieldProps('documentNumber')}
                touched={undefined}
                errors={undefined}
                type='string'
              />
              <RegisterFormModelInput
                label='Número do processo'
                placeholder=''
                fieldProps={formik.getFieldProps('processNumber')}
                touched={undefined}
                errors={undefined}
                type='string'
              />
            </div>
          </RegisterFormModelColumn>
        </RegisterForm>
      }
      footer={
        <ModalErrorFooter
          modalFooter={
            <CustomButton
              margin='0'
              isLoading={isLoading}
              disabled={isLoading}
              label={'Gerar'}
              onSubmit={formik.handleSubmit}
            />
          }
          error={formik.status}
        />
      }
    ></ModeloModal>
  )
}
