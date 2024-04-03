import {useFormik} from 'formik'
import React, {useEffect, useState} from 'react'
import {date} from 'yup'
import {
  RegisterFormModel,
  RegisterFormModelColumn,
  RegisterFormModelInput,
} from '../../../../components/RegisterFormModel'
import {SelectInput} from '../../../../components/SelectInput'
import {CustomButton} from '../../../components/CustomButton/CustomButton'
import {masks} from '../../../components/Form/FormInput'
import Table from '../../../components/Table/Table'
import {mapContent} from '../../../components/Table/TableHead'
import {
  getStatus,
  getUnionTransfers,
  postUnionTransfers,
  putUnionTransfers,
  UnionTransfers,
} from '../../../services/UnionTransfersApi'
import IsLoadingList from '../../../utils/components/IsLoadingList'
import ModeloModal, {ModalErrorFooter} from '../../../utils/components/ModeloModal'
import {formatDate, formatMoney, intlDate, sanitizeMoney} from '../../../utils/functions'
import {RegisterForm} from '../../admin/management/Register/AdminRegisterPage'
import * as Yup from 'yup'
import {TablePagination} from '../../auth/components/TablePagination'
import {TableRowProps} from '../../../components/Table/TableRow'

const validationSchema = Yup.object().shape({
  value: Yup.string().required('Valor é obrigatório'),
  date: Yup.string().required('Data é obrigatório'),
  status: Yup.string().required('Status é obrigatório'),
})

export default function TransferUnionPage() {
  const defaultValues = {
    value: '',
    date: '',
    status: '',
    id: '',
  }

  const [showModalUnion, setShowModalUnion] = useState(false)
  const [unionTransfers, setUnionTransfers] = useState<UnionTransfers[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingList, setIsLoadingList] = useState(false)
  const [editingId, setEditingId] = useState('')
  const refreshList = () => {
    setIsLoadingList(true)
    getUnionTransfers()
      .then((res) => {
        setUnionTransfers(res.data)
      })
      .finally(() => setIsLoadingList(false))
  }
  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema: validationSchema,
    onSubmit: async (values, {setStatus}) => {
      try {
        setIsLoading(true)
        const unionTransfer = {
          date: values?.date,
          id: values?.id,
          status: Number(values?.status),
          value: Number(sanitizeMoney(values?.value)),
        }
        if (editingId) {
          await putUnionTransfers(editingId, unionTransfer)
        } else {
          await postUnionTransfers(unionTransfer)
        }
        hideModal()
      } catch (err) {
        setStatus({message: err})
      }
      refreshList()
      setIsLoading(false)
    },
  })

  useEffect(() => {
    refreshList()
  }, [])

  useEffect(() => {
    if (editingId) {
      const editing = unionTransfers.find((item) => item.id === editingId)
      if (editing) {
        formik.setValues({
          value: formatMoney(editing.value),
          date: intlDate(editing.date),
          status: editing.status.toString(),
          id: editing.id,
        })
      }
    }
  }, [editingId, unionTransfers])

  const transferUnionList: TableRowProps[] = unionTransfers.map((e) => ({
    columns: mapContent([
      formatDate(e.date),
      e.id,
      formatMoney(e.value),
      <span className={`badge badge-light-${e.status == 0 ? 'success' : 'danger'}`}>
        {getStatus(e.status)}
      </span>,
    ]),
    detailsColumn: [
      {
        content: 'Editar',
        buttonAction: () => {
          setEditingId(e.id)
          setShowModalUnion(true)
        },
      },
    ],
  }))

  return (
    <>
      <div className='card'>
        <div className='card-header d-flex  align-items-center'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bolder fs-3 mb-1'>Repasses da união</span>
          </h3>
          <div className='d-flex flex-row'>
            <div className='py-1'>
              <CustomButton
                isLoading={false}
                label='Novo'
                onSubmit={() => setShowModalUnion(true)}
              />
            </div>
          </div>
        </div>
        <div className='card-body'>
          {isLoadingList ? (
            <IsLoadingList />
          ) : (
            <>
              <Table
                rows={transferUnionList}
                headColumns={mapContent(['Data', 'Id', 'Total', 'Status', 'Ações'])}
              ></Table>
              <TablePagination
                arrayLength={1}
                maxPageItens={6}
                onSelectedPageChanged={() => {}}
                selectedPage={1}
              ></TablePagination>
            </>
          )}
        </div>
        <ModeloModal
          title={'Novo Repasse'}
          onHide={() => hideModal()}
          show={showModalUnion}
          body={
            <>
              <RegisterForm onSubmit={() => {}}>
                <RegisterFormModelColumn>
                  <RegisterFormModelInput
                    label='Data'
                    placeholder='Data'
                    fieldProps={formik.getFieldProps('date')}
                    touched={formik.touched.date}
                    errors={formik.errors.date}
                    type='date'
                  />

                  <RegisterFormModelInput
                    label='Valor total'
                    placeholder='Valor total'
                    fieldProps={formik.getFieldProps('value')}
                    touched={formik.touched.value}
                    errors={formik.errors.value}
                    mask={masks.money}
                    type='text'
                  />

                  <SelectInput
                    label='Status'
                    fieldProps={formik.getFieldProps('status')}
                    touched={formik.touched.status}
                    errors={formik.errors.status}
                    data={[
                      {id: '0', name: 'Ativo'},
                      {id: '1', name: 'Inativo'},
                    ]}
                  />
                </RegisterFormModelColumn>
              </RegisterForm>
            </>
          }
          footer={
            <ModalErrorFooter
              error={formik.status}
              modalFooter={
                <CustomButton
                  label='Salvar'
                  onSubmit={formik.handleSubmit}
                  disabled={isLoading}
                  isLoading={isLoading}
                />
              }
            />
          }
        ></ModeloModal>
      </div>
    </>
  )

  function hideModal() {
    setShowModalUnion(false)
    setEditingId('')
  }
}
