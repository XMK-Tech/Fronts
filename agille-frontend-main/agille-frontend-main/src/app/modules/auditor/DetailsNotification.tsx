import dayjs from 'dayjs'
import {useFormik} from 'formik'
import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {
  RegisterFormModel,
  RegisterFormModelColumn,
  RegisterFormModelInput,
} from '../../../components/RegisterFormModel'
import {CustomButton} from '../../components/CustomButton/CustomButton'
import Table from '../../components/Table/Table'
import {mapContent} from '../../components/Table/TableHead'
import {
  getNoticeToText,
  putNoticeAction,
  putNoticeProtocol,
  taxProcessReport,
} from '../../services/NoticeApi'
import {getNoticeId as getNoticeDetails} from '../../services/PersonApi'
import IsLoadingList from '../../utils/components/IsLoadingList'
import ModeloModal, {ModalErrorFooter} from '../../utils/components/ModeloModal'
import {formatCnpj, formatCpf, formatDate} from '../../utils/functions'
import {TablePagination} from '../auth/components/TablePagination'
import * as Yup from 'yup'
import {SelectInput} from '../../../components/SelectInput'
import {ArDialog, JoinTermDialog} from '../DTE/NoticeDTE/NoticeDTEDetails'
import InfoModel from '../ITR/Components/InfoModel'
type DetailsInfoProps = {
  items: {detail: React.ReactNode; infoDetail: React.ReactNode}[]
  title: string
}
export function DetailsInfo(props: DetailsInfoProps) {
  return (
    <div>
      <div className='d-flex justify-content-start mb-4'>
        <strong className='card-label fs-3 mb-1'>{props.title}</strong>
      </div>
      {props.items.map((e) => (
        <>
          <div className=' d-flex flex-row'>
            <Detail e={e} />
          </div>
        </>
      ))}
    </div>
  )
}
function Detail({e}: {e: {detail: React.ReactNode; infoDetail: React.ReactNode}}) {
  return (
    <p className='text-muted'>
      <label className='text-black'>{e.detail}</label>
      &ensp; {e.infoDetail}
    </p>
  )
}

export default function DetailsNotification() {
  return <DetailsNotificationComponent report={false} ar={false} />
}

export function DetailsNotificationComponent(props: {report: boolean; ar: boolean}) {
  type StatusProps =
    | 'Emitida'
    | 'Entregue no prazo'
    | 'Entregue após o vencimento'
    | 'Respondida no prazo'
    | 'Respondida após o prazo'
    | 'Encerrada'
    | 'Encaminhada para processo Fiscal'

  function getColorByStatus(status: StatusProps | string) {
    //TODO : adcionar cores referentes ao status
    if (status === 'Emitida') {
      return 'badge-light-success'
    }
    if (status === 'Entregue no prazo') {
      return 'badge-light-primary'
    }
    if (status === 'Entregue após o vencimento') {
      return 'badge-light-warning'
    }
    if (status === 'Respondida no prazo') {
      return 'badge-light-primary'
    }
    if (status === 'Respondida após o prazo') {
      return 'badge-light-warning'
    }
    if (status === 'Encerrada') {
      return 'badge-light-danger'
    }
    if (status === 'Encaminhada para processo Fiscal') {
      return 'badge-light-dark'
    } else {
      return 'badge-light-dark'
    }
  }
  type TaxActions = {
    date: string
    description: string
    fromStatus: number
    fromStatusDescription: string
    id: string
    statusHasChanged: boolean
    toStatus: number
    toStatusDescription: string
    userId: string
  }
  type ReturnProtocol = {
    document: string
    name: string
    phone: string
    date: Date
    id: string
    signedBy: number
    signedByDescription: string
  }
  type NoticeIdProps = {
    id: string
    templateId: string
    url: string
    type: number
    aliquot: number
    name: string
    rateType: number
    number: string
    document: string
    companyName: string
    date: string
    observation: string
    dueDate: string
    status: number
    statusDescription: string
    divergencyIds: [string]
    taxActions: TaxActions[]
    personId: string
    returnProtocol: ReturnProtocol
  }
  const validationSchema = Yup.object().shape({
    date: Yup.string().required('Nesecário preencher a data'),
    time: Yup.string().required('Nesecário preencher a hora'),
    status: Yup.string().required('Nesecário preencher o status'),
  })
  const initialValues = {
    date: '',
    time: '',
    status: '',
    complement: '',
  }
  const [noticeDetails, setNoticeDetails] = useState<NoticeIdProps | null>(null)
  const [loadingPage, setLoadingPage] = useState(false)
  const {id} = useParams<{id: string}>()
  const formik = useFormik({
    validationSchema: validationSchema,
    initialValues: initialValues,
    onSubmit: async (values, {setStatus}) => {
      setButtonLoading(true)
      try {
        await putNoticeAction(
          id,
          Number(values.status),
          values.time,
          dayjs(values.date + 'T' + values.time).toISOString()
        )
        setShowModalAction(false)

        formik.setValues(initialValues)
      } catch (err) {
        setStatus({message: err})
      } finally {
        setButtonLoading(false)
        refresh()
      }
    },
  })
  function refresh() {
    setLoadingPage(true)
    getNoticeDetails(id)
      .then((res) => {
        setNoticeDetails(res.data)
      })
      .finally(() => setLoadingPage(false))
  }
  useEffect(() => {
    refresh()
  }, [])
  const noticeIdList = noticeDetails?.taxActions?.map((e) => ({
    columns: mapContent([
      'Auditor',
      dayjs.utc(e.date).local().format('DD/MM/YY - HH:mm'),
      <span
        className={`mw-150px text-wrap badge ${getColorByStatus(e.toStatusDescription)} fw-bolder`}
      >
        {e.toStatusDescription}
      </span>,
      e.description,
    ]),
    detailsColumn: props.ar
      ? [
          {
            content: 'Ações',
            dropButton: true,
            className: 'btn-primary',

            dropItems: [
              {
                labelItem: 'Gerar AR',
                onClick: () => {
                  setShowArModal(true)
                },
              },
              {
                labelItem: 'Emitir termo de juntada',
                onClick: () => {
                  setShowJointTermModal(true)
                },
              },
            ],
          },
        ]
      : undefined,
  }))
  const [taxProcessModalError, setTaxProcessModalError] = useState(false)
  const [showModalAction, setShowModalAction] = useState(false)
  const [showModalProtocol, setShowModalProtocol] = useState(false)
  const [buttonLoading, setButtonLoading] = useState(false)
  const [taxProcessLoading, setTaxProcessLoading] = useState(false)
  const [wasReceived, setWasReceived] = useState(false)
  const [obs, SetObs] = useState('')
  const [document, setDocument] = useState('')
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<{message: any} | null>(null)
  const [showArModal, setShowArModal] = useState(false)
  const [showJointTermModal, setShowJointTermModal] = useState(false)

  const editProtocolReturn = async () => {
    setButtonLoading(true)
    try {
      await putNoticeProtocol(id, document, name, phone, wasReceived)
      setShowModalProtocol(false)
      formik.setValues(initialValues)
    } catch (err) {
      setError({message: err})
    } finally {
      setButtonLoading(false)
      refresh()
    }
  }

  return (
    <>
      <ArDialog
        showModalAr={showArModal}
        setShowModalAr={setShowArModal}
        id={noticeDetails ? noticeDetails.personId : ''}
      />
      <JoinTermDialog
        showModalJoin={showJointTermModal}
        setShowModalJoin={setShowJointTermModal}
        id={noticeDetails ? noticeDetails.personId : ''}
      />
      <div className='card'>
        {loadingPage ? (
          <IsLoadingList />
        ) : (
          <>
            <div className='card-header border-0'>
              <h3 className='card-title align-items-start flex-column'>
                <span className='card-label fw-bolder fs-3 mb-1'>
                  Detalhes da
                  {noticeDetails ? getNoticeToText(noticeDetails.type) : null}
                </span>
              </h3>
              <div className='d-flex align-items-center h-10'>
                {props.report && (
                  <>
                    <CustomButton
                      label='Relatório Processos Fiscais'
                      onSubmit={async () => {
                        setTaxProcessLoading(true)
                        try {
                          await taxProcessReport({})
                        } catch (err: any) {
                          setTaxProcessLoading(false)
                          setTaxProcessModalError(true)
                        } finally {
                          setTaxProcessLoading(false)
                        }
                      }}
                      isLoading={taxProcessLoading}
                    ></CustomButton>
                    <ModeloModal
                      title={'Erro'}
                      show={taxProcessModalError}
                      onHide={() => {
                        setTaxProcessModalError(false)
                      }}
                      body={
                        <InfoModel title='Erro !' message='Não foi possível gerar o relatório' />
                      }
                    />
                  </>
                )}
                <CustomButton
                  label='Download notificação'
                  href={noticeDetails?.url}
                  onSubmit={() => {}}
                  isLoading={false}
                ></CustomButton>
                <CustomButton
                  label='Protocolar ações'
                  onSubmit={() => setShowModalAction(!showModalAction)}
                  isLoading={false}
                ></CustomButton>
                <CustomButton
                  disabled={noticeDetails?.returnProtocol != null && true}
                  label='Protocolar retorno'
                  onSubmit={() => setShowModalProtocol(!showModalProtocol)}
                  isLoading={false}
                ></CustomButton>
              </div>
            </div>
            <div
              className='d-flex justify-content-between shadow rounded bg-light my-5 mx-10 pt-2
   pe-4 ps-4'
            >
              <DetailsInfo
                title='Contribuintes'
                items={[
                  {detail: 'CNPJ', infoDetail: formatCnpj(noticeDetails?.document)},
                  {detail: 'Razão Social', infoDetail: noticeDetails?.companyName},
                ]}
              />
              <DetailsInfo
                title='Datas'
                items={[
                  {
                    detail: 'Data de Emissão',
                    infoDetail: formatDate(noticeDetails?.date),
                  },
                  {
                    detail: 'Data de Vencimento',
                    infoDetail: formatDate(noticeDetails?.dueDate),
                  },
                ]}
              />
              <DetailsInfo
                title='Retorno'
                items={[
                  {
                    detail: 'Assinado Por',
                    infoDetail: noticeDetails?.returnProtocol?.signedByDescription,
                  },
                  {detail: 'Nome', infoDetail: noticeDetails?.returnProtocol?.name},
                  {detail: 'CPF', infoDetail: formatCpf(noticeDetails?.returnProtocol?.document)},
                  {detail: 'Contato', infoDetail: noticeDetails?.returnProtocol?.phone},
                ]}
              />
              <DetailsInfo
                title='Complemento'
                items={[
                  {detail: 'Modelo', infoDetail: noticeDetails?.name},
                  {
                    detail: 'Status',
                    infoDetail: (
                      <span
                        className={`mw-150px text-wrap badge ${getColorByStatus(
                          noticeDetails?.statusDescription as string
                        )} fw-bolder`}
                      >
                        {noticeDetails?.statusDescription}
                      </span>
                    ),
                  },
                ]}
              />
            </div>
            <div className='my-5 mx-10'>
              <h3 className='card-title align-items-start flex-column'>
                <span className='card-label fw-bolder fs-3 mb-1'>Ações Protocoladas</span>
              </h3>
              <Table
                rows={noticeIdList ?? []}
                headColumns={mapContent([
                  'AUDITOR RESPONSÁVEL',
                  'DATA/HORA',
                  'STATUS',
                  'OBSERVAÇÕES',
                  ...(props.ar ? ['AÇÕES'] : []),
                ])}
              ></Table>
              <TablePagination
                arrayLength={3}
                maxPageItens={6}
                onSelectedPageChanged={() => {}}
                selectedPage={1}
              ></TablePagination>
            </div>
          </>
        )}

        <ModeloModal
          show={showModalAction}
          onHide={() => setShowModalAction(!showModalAction)}
          title='Protocolar Ações Fiscais'
          body={
            <RegisterFormModel>
              <RegisterFormModelColumn container='center'>
                <RegisterFormModelInput
                  placeholder={'Selecione a data'}
                  label={'Selecionar Data'}
                  errors={formik.errors.date}
                  touched={formik.touched.date}
                  fieldProps={formik.getFieldProps('date')}
                  type={'date'}
                />

                <RegisterFormModelInput
                  placeholder={''}
                  label={'Informa horas'}
                  errors={formik.errors.time}
                  touched={formik.touched.time}
                  fieldProps={formik.getFieldProps('time')}
                  type={'time'}
                />

                <div className='py-3'>
                  <SelectInput
                    label='Status'
                    fieldProps={formik.getFieldProps('status')}
                    touched={formik.touched.status}
                    errors={formik.errors.status}
                    data={[
                      {name: 'Emitida', id: '0'},
                      {name: 'Entregue no prazo', id: '1'},
                      {name: 'Entregue após o vencimento', id: '2'},
                      {name: 'Respondida no prazo', id: '3'},
                      {name: 'Respondida após o prazo', id: '4'},
                      {name: 'Encerrada', id: '5'},
                      {name: 'Encaminhada para processo Fiscal', id: '6'},
                    ]}
                  />
                </div>

                <div className='py-3'>
                  <strong className=''>Observações</strong>
                  <textarea
                    className=' h-150px w-300px shadow form-control'
                    placeholder='Insira as observações'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </RegisterFormModelColumn>
            </RegisterFormModel>
          }
          footer={
            <ModalErrorFooter
              error={error}
              modalFooter={
                <CustomButton
                  label='Protocolar'
                  onSubmit={formik.handleSubmit}
                  disabled={buttonLoading}
                  isLoading={buttonLoading}
                ></CustomButton>
              }
            />
          }
        ></ModeloModal>
        <ModeloModal
          show={showModalProtocol}
          onHide={() => setShowModalProtocol(!showModalProtocol)}
          title='Protocolar Retorno'
          body={
            <div className='d-flex flex-column align-items-center'>
              <div className='mb-8'>
                {' '}
                <strong>{`Digite os dados ${
                  !wasReceived ? 'do CONTRIBUINTE' : 'da TESTEMUNHA'
                } para protocolar o retorno`}</strong>
              </div>

              <RegisterFormModelColumn>
                <div className='d-flex justify-content-between mb-3'>
                  <strong>Recusou-se a receber ?</strong>
                  <label className='form-check form-switch form-check-custom form-check-solid'>
                    <input
                      onChange={(e) => {
                        setWasReceived(!wasReceived)
                      }}
                      className='form-check-input w-30px h-20px'
                      type='checkbox'
                      checked={wasReceived}
                    />
                    <strong className='form-check-label fs-7'>{wasReceived ? 'Sim' : 'Não'}</strong>
                  </label>
                </div>
                <div className='py-3'>
                  <strong className=''>Nome</strong>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className='form-control'
                    type='text'
                    placeholder={`Digite o nome ${
                      !wasReceived ? 'do contribuinte' : 'da testemunha'
                    }`}
                  />
                </div>
                <div className='py-3'>
                  <strong className=''>CPF</strong>
                  <input
                    value={document}
                    onChange={(e) => {
                      setDocument(e.target.value)
                    }}
                    className='form-control'
                    type='number'
                    placeholder={`Digite o CPF ${
                      !wasReceived ? 'do contribuinte' : 'da testemunha'
                    }`}
                  />
                </div>
                <div className='py-3'>
                  <strong className=''>Contato</strong>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className='form-control'
                    type='tel'
                    placeholder={`Digite o contato ${
                      !wasReceived ? 'do contribuinte' : 'da testemunha'
                    }`}
                  />
                </div>
                <div className='py-3'>
                  <strong className=''>Observações</strong>
                  <textarea
                    className=' h-150px w-400px shadow form-control'
                    placeholder='Insira as observações'
                    value={obs}
                    onChange={(e) => SetObs(e.target.value)}
                  />
                </div>
              </RegisterFormModelColumn>
            </div>
          }
          footer={
            <ModalErrorFooter
              error={error}
              modalFooter={
                <CustomButton
                  label='Protocolar'
                  onSubmit={editProtocolReturn}
                  isLoading={buttonLoading}
                ></CustomButton>
              }
            />
          }
        ></ModeloModal>
      </div>
    </>
  )
}
