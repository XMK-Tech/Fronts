import { useFormik } from 'formik'
import { FormikProps } from 'formik/dist/types'
import React, { useEffect } from 'react'
import * as Yup from 'yup'

import {
  RegisterFormModel,
  RegisterFormModelColumn,
  RegisterFormModelInput,
} from '../../../components/RegisterFormModel'
import { getCommand, importManyFiles, importManyFilesType } from '../../services/RobotApi'
import { AttachmentDropZone } from '../../utils/components/DropZoneUp'
import { masks } from '../../components/Form/FormInput'
import SuccessFullScreen from '../ITR/Components/SuccessFullScreen'

const userRegisterSchema = Yup.object().shape({
  reference: Yup.string()
    .required('Nesecário inserir a referência')
})
const defaultInitialValues = {
  reference: '',
  revenueId: '',
  expenseId: '',
  collectionId: '',
  fpmId: ''
}

type ValueType = typeof defaultInitialValues
const RobotForm: React.FC<{}> = () => {
  const [command, setCommand] = React.useState('');
  const [showModalSuccess, setShowModalSuccess] = React.useState(false);
  const formik = useFormik({
    initialValues: defaultInitialValues,
    validationSchema: userRegisterSchema,

    enableReinitialize: true,
    onSubmit: async (values, { setStatus }) => {
      console.log(values);
      try {
        const obj: importManyFilesType = {
          competence: values.reference,
          itens: []
        }
        if (values.revenueId)
          obj.itens.push({
            attachmentId: values.revenueId,
            dataDescription: "revenue"
          });
        if (values.expenseId)
          obj.itens.push({
            attachmentId: values.expenseId,
            dataDescription: "expense"
          });
        if (values.collectionId)
          obj.itens.push({
            attachmentId: values.collectionId,
            dataDescription: "collection"
          })
        if (values.fpmId)
          obj.itens.push({
            attachmentId: values.fpmId,
            dataDescription: "fpm"
          })
        await importManyFiles(obj)
          setShowModalSuccess(true)
      } catch (err) {
        setStatus({ message: err })
      }
    }
  })
  const referenceField = formik.getFieldProps('reference').value
  useEffect(() => {
    if (referenceField) {
      getCommand(referenceField).then(({ data }) => {
        if (data)
          setCommand(data.command)
      })
    }
  }, [referenceField])

  return <FormBody formik={formik} command={command} showSuccess={showModalSuccess} onHideSuccess={() => setShowModalSuccess(false)} />
}

function FormBody({
   formik, 
  command, 
  showSuccess, 
  onHideSuccess 
}: { 
  formik: FormikProps<ValueType>, 
  command: string,
  showSuccess: boolean,
  onHideSuccess : ()=> void
}) {
  return (
    <>
      <div className={`card`}>
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bolder fs-3 mb-1'>
              Robô
            </span>
          </h3>
        </div>
        <div className='card-body py-3'>
          <RegisterFormModel
            footer={
              <div className='p-10 d-flex flex-row justify-content-around'>
                {' '}
                <button type='submit' className='btn btn-sm btn-primary'>
                  Salvar
                </button>
              </div>
            }
            onSubmit={formik.handleSubmit}
          >
            <div className='d-flex flex-column' style={{ width: '100%' }}>
              <div className='d-inline-block' style={{ width: '100%' }}>
                <RegisterFormModelInput
                  label='Referência'
                  id='inputReference'
                  placeholder=''
                  fieldProps={formik.getFieldProps('reference')}
                  touched={formik.touched.reference}
                  errors={formik.errors.reference}
                  type='date'
                />
                <RegisterFormModelInput
                  label='Comando'
                  id='inputCommand'
                  placeholder='Selecione uma data para mostrar o comando'
                  fieldProps={{ value: command, name: 'inputCommand', onChange: () => { }, onBlur: () => { } }}
                  touched={false}
                  errors={undefined}
                  className={'shadow form-control'}
                  style={{ width: '100%' }}
                  type=''
                  mask={masks.textArea}
                />
              </div>
              <div className='d-flex flex-row' style={{ width: '100%' }}>
                <RegisterFormModelColumn>
                  <AttachmentDropZone
                    acceptArchive={'.json'}
                    title='Recolhimentos'
                    onSubmit={(_fileWithMeta, attachmentId) =>
                      formik.setFieldValue('collectionId', attachmentId)
                    }
                  />
                </RegisterFormModelColumn>
                <RegisterFormModelColumn>
                  <AttachmentDropZone
                    acceptArchive={'.json'}
                    title='Retenção'
                    onSubmit={(_fileWithMeta, attachmentId) =>
                      formik.setFieldValue('fpmId', attachmentId)
                    }
                  />
                </RegisterFormModelColumn>
                <RegisterFormModelColumn>
                  <AttachmentDropZone
                    acceptArchive={'.json'}
                    title='Despesas'
                    onSubmit={(_fileWithMeta, attachmentId) =>
                      formik.setFieldValue('expenseId', attachmentId)
                    }
                  />
                </RegisterFormModelColumn>
                <RegisterFormModelColumn>
                  <AttachmentDropZone
                    acceptArchive={'.json'}
                    title='Receitas'
                    onSubmit={(_fileWithMeta, attachmentId) =>
                      formik.setFieldValue('revenueId', attachmentId)
                    }
                  />
                </RegisterFormModelColumn>
              </div>
            </div>
          </RegisterFormModel>
        </div>
      </div>
      <SuccessFullScreen
        show={showSuccess}
        onHide={onHideSuccess }
      />
    </>
  )
}

function Robot() {
  return <RobotForm />
}

export default Robot
