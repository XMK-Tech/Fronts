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
import {postJoinTerm} from '../../../../services/TaxStageApi'

const defaultInitialValues = {
  taxStageId: '',
  homePageNumber: '',
  finalPageNumber: '',
  atualPageNumber: '',
  spaceForLetterhead: false,
}
export function JoinTermModel({
  showModalJoin: showModalJoin,
  setShowModalJoin: setShowModalJoin,
  id,
}: {
  showModalJoin: boolean
  setShowModalJoin: React.Dispatch<React.SetStateAction<boolean>>
  id: string
}) {
  const formik = useFormik({
    initialValues: defaultInitialValues,
    validationSchema: '',
    enableReinitialize: true,
    onSubmit: async (values, {setStatus}) => {
      try {
        setIsLoading(true)
        await postJoinTerm({
          taxStageId: id,
          atualPageNumber: Number(values.atualPageNumber),
          homePageNumber: Number(values.homePageNumber),
          finalPageNumber: Number(values.finalPageNumber),
          spaceForLetterhead: values.spaceForLetterhead,
        })
      } catch (err: any) {
        setStatus({message: err})
      }
      setIsLoading(false)
    },
  })
  const [isLoading, setIsLoading] = useState(false)
  return (
    <ModeloModal
      title='Gerar termo de encaminhamento do processo RFB'
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

              <RegisterFormSwitch
                fieldProps={formik.getFieldProps('l')}
                label='Espaço para papel timbrado?'
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
