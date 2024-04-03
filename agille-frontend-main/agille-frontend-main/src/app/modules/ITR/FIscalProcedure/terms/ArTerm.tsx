import {FormikProps, useFormik} from 'formik'
import React, {useEffect, useState} from 'react'
import {
  RegisterFormModelColumn,
  RegisterFormModelInput,
} from '../../../../../components/RegisterFormModel'
import {CustomButton} from '../../../../components/CustomButton/CustomButton'
import {masks} from '../../../../components/Form/FormInput'
import {InfoCard} from '../../../../components/Table/TableDetailsModal'
import {getEntitiesAgille} from '../../../../services/EntitiesApi'
import {getArTermAddress, postArTerm} from '../../../../services/TaxStageApi'
import ModeloModal, {ModalErrorFooter} from '../../../../utils/components/ModeloModal'
import {RegisterForm} from '../../../admin/management/Register/AdminRegisterPage'
import InfoModel from '../../Components/InfoModel'

const defaultInitialValues = {
  taxStageId: '',
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
export function ArTermModel({
  showModalAr,
  setShowModalAr,
  id,
}: {
  showModalAr: boolean
  setShowModalAr: React.Dispatch<React.SetStateAction<boolean>>
  id: string
}) {
  const [initialValues, setInitialValues] = useState(defaultInitialValues)
  const [credentials, setCredentials] = useState<any>()
  useEffect(() => {
    getEntitiesAgille().then((res) => setCredentials(res.data.itr.credentials))
    if (id) {
      getArTermAddress(id).then(({data}) => {
        setInitialValues({
          additionalInformation: data.additionalInformation ?? '',
          taxStageId: data.taxStageId ?? '',
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
        await postArTerm({
          taxStageId: id,
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

export function ArFormModal(props: {
  showModalAr: boolean
  setShowModalAr: (showModalAr: boolean) => void
  credentials: any
  formik: FormikProps<any>
  isLoading: boolean
}) {
  return (
    <ModeloModal
      title={'Gerar AR'}
      show={props.showModalAr}
      size={'xl'}
      onHide={() => props.setShowModalAr(!props.showModalAr)}
      body={
        !props.credentials?.user ? (
          <InfoModel
            infoColor='info'
            title='Configuração pendente'
            message='Para habilitar essa funcionalidade é necessário configurar as credenciais de integração dos correios. '
            link={{
              label: 'Acesse as configurações clicando aqui',
              url: '/auditor/configuracao/conta',
            }}
          />
        ) : (
          <RegisterForm onSubmit={props.formik.handleSubmit}>
            <div>
              <RegisterFormModelColumn>
                <h3 className='pb-2'>Endereço do destinatário</h3>
                <div className='d-flex justify-content-between'>
                  <RegisterFormModelColumn>
                    <RegisterFormModelInput
                      label='Descrição'
                      placeholder='Ex: Em frente ao local de arrecadação'
                      touched={undefined}
                      errors={undefined}
                      type='text'
                      fieldProps={props.formik.getFieldProps('recipient.description')}
                    />
                    <RegisterFormModelInput
                      label='CEP'
                      placeholder='Ex: 33940-032'
                      touched={undefined}
                      errors={undefined}
                      mask={masks.cep}
                      type='text'
                      fieldProps={props.formik.getFieldProps('recipient.zipCode')}
                    />
                  </RegisterFormModelColumn>
                  <RegisterFormModelColumn>
                    <RegisterFormModelInput
                      label='Cidade'
                      placeholder='Ex: Belo Horizonte'
                      touched={undefined}
                      errors={undefined}
                      type='text'
                      fieldProps={props.formik.getFieldProps('recipient.cityName')}
                    />
                    <RegisterFormModelInput
                      label='Logradouro'
                      placeholder='Ex: Rua dos Lagos'
                      touched={undefined}
                      errors={undefined}
                      type='text'
                      fieldProps={props.formik.getFieldProps('recipient.street')}
                    />
                  </RegisterFormModelColumn>
                  <RegisterFormModelColumn>
                    <RegisterFormModelInput
                      label='Estado'
                      placeholder='Ex: Minas Gerais'
                      touched={undefined}
                      errors={undefined}
                      type='text'
                      fieldProps={props.formik.getFieldProps('recipient.stateName')}
                    />
                    <RegisterFormModelInput
                      label='Número'
                      placeholder='Ex: 123'
                      touched={undefined}
                      errors={undefined}
                      type='text'
                      mask={Number}
                      fieldProps={props.formik.getFieldProps('recipient.number')}
                    />
                  </RegisterFormModelColumn>
                  <RegisterFormModelColumn>
                    <RegisterFormModelInput
                      label='Complemento'
                      placeholder='Ex: Em frente ao supermercado Kalu'
                      touched={undefined}
                      errors={undefined}
                      type='text'
                      fieldProps={props.formik.getFieldProps('recipient.complement')}
                    />
                  </RegisterFormModelColumn>
                </div>
              </RegisterFormModelColumn>

              <RegisterFormModelColumn>
                <h3 className='pb-2 pt-16'>Endereço para devolução</h3>
                <div className='d-flex justify-content-between'>
                  <RegisterFormModelColumn>
                    <RegisterFormModelInput
                      label='Descrição'
                      placeholder='Ex: Em frente ao local de arrecadação'
                      touched={undefined}
                      errors={undefined}
                      type='text'
                      fieldProps={props.formik.getFieldProps('devolution.description')}
                    />
                    <RegisterFormModelInput
                      label='CEP'
                      placeholder='Ex: 33940-032'
                      touched={undefined}
                      errors={undefined}
                      mask={masks.cep}
                      type='text'
                      fieldProps={props.formik.getFieldProps('devolution.zipCode')}
                    />
                  </RegisterFormModelColumn>
                  <RegisterFormModelColumn>
                    <RegisterFormModelInput
                      label='Cidade'
                      placeholder='Ex: Belo Horizonte'
                      touched={undefined}
                      errors={undefined}
                      type='text'
                      fieldProps={props.formik.getFieldProps('devolution.cityName')}
                    />
                    <RegisterFormModelInput
                      label='Logradouro'
                      placeholder='Ex: Rua dos Lagos'
                      touched={undefined}
                      errors={undefined}
                      type='text'
                      fieldProps={props.formik.getFieldProps('devolution.street')}
                    />
                  </RegisterFormModelColumn>
                  <RegisterFormModelColumn>
                    <RegisterFormModelInput
                      label='Estado'
                      placeholder='Ex: Minas Gerais'
                      touched={undefined}
                      errors={undefined}
                      type='text'
                      fieldProps={props.formik.getFieldProps('devolution.stateName')}
                    />
                    <RegisterFormModelInput
                      label='Número'
                      placeholder='Ex: 123'
                      touched={undefined}
                      errors={undefined}
                      type='text'
                      mask={Number}
                      fieldProps={props.formik.getFieldProps('devolution.number')}
                    />
                  </RegisterFormModelColumn>
                  <RegisterFormModelColumn>
                    <RegisterFormModelInput
                      label='Complemento'
                      placeholder='Ex: Em frente ao supermercado Kalu'
                      touched={undefined}
                      errors={undefined}
                      type='text'
                      fieldProps={props.formik.getFieldProps('devolution.complement')}
                    />
                  </RegisterFormModelColumn>
                </div>
              </RegisterFormModelColumn>

              <div className='mx-10 mt-10 '>
                <RegisterFormModelInput
                  label='Informações adcionais'
                  placeholder='Observações'
                  touched={undefined}
                  errors={undefined}
                  type='text'
                  mask={masks.textArea}
                  fieldProps={props.formik.getFieldProps('additionalInformation')}
                />
              </div>
            </div>
          </RegisterForm>
        )
      }
      footer={
        <ModalErrorFooter
          error={props.formik.status}
          modalFooter={
            <CustomButton
              margin='0'
              disabled={props.isLoading}
              isLoading={props.isLoading}
              label={'Gerar'}
              onSubmit={props.formik.handleSubmit}
            />
          }
        ></ModalErrorFooter>
      }
    ></ModeloModal>
  )
}
