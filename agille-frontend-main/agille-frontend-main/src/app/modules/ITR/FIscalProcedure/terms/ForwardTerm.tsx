import React, {useEffect, useState} from 'react'
import {CustomButton} from '../../../../components/CustomButton/CustomButton'
import ModeloModal, {ModalErrorFooter} from '../../../../utils/components/ModeloModal'
import {
  RegisterFormModelColumn,
  RegisterFormModelInput,
} from '../../../../../components/RegisterFormModel'
import {RegisterForm} from '../../../admin/management/Register/AdminRegisterPage'
import {useFormik} from 'formik'
import {RegisterFormSwitch} from '../../../../../components/RegisterFormSwitch'
import {postForwardTerm} from '../../../../services/TaxStageApi'

const defaultInitialValues = {
  homePageNumber: '',
  finalPageNumber: '',
  atualPageNumber: '',
  spaceForLetterhead: false,
  withObjection: false,
}
export function ForwardTermModel({
  showModalAction,
  setShowModalAction,
  id,
}: {
  showModalAction: boolean
  setShowModalAction: React.Dispatch<React.SetStateAction<boolean>>
  id: string
}) {
  const formik = useFormik({
    initialValues: defaultInitialValues,
    validationSchema: '',
    enableReinitialize: true,
    onSubmit: async (values, {setStatus}) => {
      try {
        setIsLoading(true)
        await postForwardTerm({
          atualPageNumber: Number(values.atualPageNumber),
          homePageNumber: Number(values.homePageNumber),
          finalPageNumber: Number(values.finalPageNumber),
          spaceForLetterhead: values.spaceForLetterhead,
          withObjection: values.withObjection,
          taxProcedureId: id,
        })
        setShowModalAction(false)
      } catch (err) {
        setStatus({message: err})
      }
      setIsLoading(false)
    },
  })
  const [isLoading, setIsLoading] = useState(false)
  return (
    <ModeloModal
      title='Gerar termo de encaminhamento do processo RFB'
      show={showModalAction}
      onHide={() => setShowModalAction(!showModalAction)}
      body={
        <RegisterForm onSubmit={formik.handleSubmit}>
          <RegisterFormModelColumn>
            <RegisterFormModelInput
              label='Página inicial da notificação'
              placeholder='Página inicial da notificação'
              touched={undefined}
              errors={undefined}
              type='text'
              mask={Number}
              fieldProps={formik.getFieldProps('homePageNumber')}
            />

            <RegisterFormModelInput
              label='Página Final da notificação'
              placeholder='Página Final da notificação'
              touched={undefined}
              errors={undefined}
              type='text'
              mask={Number}
              fieldProps={formik.getFieldProps('finalPageNumber')}
            />

            <RegisterFormModelInput
              label='Página atual do documento'
              placeholder='Página atual do documento'
              touched={undefined}
              errors={undefined}
              type='text'
              mask={Number}
              fieldProps={formik.getFieldProps('atualPageNumber')}
            />

            <div className='py-3'>
              <RegisterFormSwitch
                fieldProps={formik.getFieldProps('withObjection')}
                label='Com impugnação?'
              />
            </div>
            <div className='py-3'>
              <RegisterFormSwitch
                fieldProps={formik.getFieldProps('spaceForLetterhead')}
                label='Espaço para papel timbrado?'
              />
            </div>
          </RegisterFormModelColumn>
        </RegisterForm>
      }
      footer={
        <ModalErrorFooter
          error={formik.status}
          modalFooter={
            <CustomButton
              margin='0'
              disabled={isLoading}
              isLoading={isLoading}
              label={'Gerar'}
              onSubmit={formik.handleSubmit}
            />
          }
        />
      }
    ></ModeloModal>
  )
}
