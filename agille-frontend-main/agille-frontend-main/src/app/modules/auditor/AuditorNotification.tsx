/* eslint-disable react/jsx-no-target-blank */
import React, {useEffect, useState} from 'react'
import {CustomButton} from '../../components/CustomButton/CustomButton'
import {
  createNotice,
  downloadNoticePreview,
  getNoticeColor,
  getNoticeTemplatesByType,
  NoticeTemplate,
  NoticeType,
} from '../../services/NoticeApi'
import ModeloModal from '../../utils/components/ModeloModal'
import {TablePagination} from '../auth/components/TablePagination'
import {DataCrossResults} from './CrossListDetails'
import IsLoadingList from '../../utils/components/IsLoadingList'
import EmptyStateList from '../../utils/components/EmptyStateList'
import NumberFormat from 'react-number-format'
import TableServicesProvided from '../../../components/TableServicesProvided'
import {RegisterFormModelColumn} from '../../../components/RegisterFormModel'

type TableViewProps = {
  isLoading: boolean
  crossDetails?: number
  setCrossDetails: (value: number) => void
  dataCrossResults: DataCrossResults
  dataCrossIds: string[]
  noticeType: NoticeType
  selectedCompanyId: string
}

const NotificationTableHead: React.FC<{}> = () => {
  return (
    <>
      {/* begin::Table head */}
      <thead>
        <tr className='fw-bolder text-muted bg-light justify-context-center'>
          <th className='text-center'>NOME</th>
          <th className='text-center'>TIPO</th>
          <th className='text-center col-4'>AÇÕES</th>
          <th className='rounded-end text-center '></th>
        </tr>
      </thead>
      {/* end::Table head */}
    </>
  )
}
export default function AuditorNotification(props: TableViewProps) {
  const [noticeTemplatesLength, setnoticeTemplatesLength] = useState<number>(0)
  const [selectedPage, setSelectedPage] = useState<number>(1)
  const [noticeAliquot, setNoticeAliquot] = useState<string>()
  const [dueDate, setDueDate] = useState<string>('20')
  const [listIsLoading, setListIsLoading] = useState(true)

  const [noticeNotes, setNoticeNotes] = useState<string>('')

  const [noticeTemplates, setNoticeTemplates] = useState<NoticeTemplate[]>([])
  const [creatingNoticeTemplate, setCreatingNoticeTemplate] = useState<NoticeTemplate | null>(null)
  useEffect(() => {
    setListIsLoading(true)
    getNoticeTemplatesByType('0', props.noticeType.toString(), selectedPage).then((response) => {
      setNoticeTemplates(response.data)
      // setnoticeTemplatesLength(response.metadata.dataSize)
      setListIsLoading(false)
    })
  }, [selectedPage])

  const handleShowCreateNoticeModal = (template: NoticeTemplate) => {
    setCreatingNoticeTemplate(template)
  }

  function onSelectedPageChanged(page: number) {
    setSelectedPage(page)
  }

  const [fileUrl, setFileUrl] = useState('')

  const showModal = !!creatingNoticeTemplate

  const list = Array.from(new Array(3)).map((d, i) => ({
    number: '1.0' + (i + 1),
    service: 'Profissionais autônomos da área de desenvolvimento e  programação.',
    aliquot: '3%',
  }))
  return (
    <>
      <ModeloModal
        size='xl'
        title={`Emitir ${props.noticeType == NoticeType.Warning ? 'Autuação' : 'Notificação'}`}
        show={showModal}
        onHide={() => setCreatingNoticeTemplate(null)}
        body={
          !fileUrl ? (
            <>
              <div className='d-flex justify-content-around flex-wrap'>
                <RegisterFormModelColumn>
                  <strong className='d-flex align-items-center strongx-5 fw-bowlder fs-6 w-400px'>
                    Insira a porcentagem da alíquota e as observações da{' '}
                    {props.noticeType === NoticeType.Warning ? ' Autuação' : 'Notificação'}
                  </strong>
                  <div className='py-3'>
                    <strong className=''>Alíquota</strong>

                    <input
                      className=' mw-400px shadow form-control'
                      placeholder='Ex.: 10%'
                      value={noticeAliquot}
                      onChange={(e: any) => setNoticeAliquot(e.target.value)}
                    />
                  </div>
                  <div className='py-3'>
                    <strong className=''>Vencimento (dias)</strong>

                    <NumberFormat
                      className=' mw-400px shadow form-control'
                      format='##'
                      placeholder='Ex.: 10'
                      value={dueDate}
                      onChange={(e: any) => setDueDate(e.target.value)}
                    />
                  </div>

                  <div className='py-3'>
                    <strong className=''>Observações</strong>
                    <textarea
                      className=' h-150px w-400px shadow form-control'
                      placeholder='Insira as observações'
                      value={noticeNotes}
                      onChange={(e) => setNoticeNotes(e.target.value)}
                    />
                  </div>
                </RegisterFormModelColumn>
                <div className='w-550px'>
                  <strong className='d-flex align-items-center strongx-5 fw-bowlder fs-6 w-400px mb-10'>
                    Serviços prestados pelo contribuinte
                  </strong>
                  <TableServicesProvided onSubmit={setNoticeAliquot} id={props.selectedCompanyId} />
                </div>
              </div>
            </>
          ) : (
            <p>
              {props.noticeType == NoticeType.Warning ? ' Autuação' : 'Notificação'} emitida com
              sucesso! Clique{' '}
              <a href={fileUrl} target='_blank' className='fw-bolder fs-6'>
                {' '}
                aqui{' '}
              </a>{' '}
              para baixar
            </p>
          )
        }
        footer={
          <>
            {fileUrl ? (
              <button className='btn btn-primary' onClick={() => setCreatingNoticeTemplate(null)}>
                OK
              </button>
            ) : (
              <>
                <CustomButton
                  label='Emitir'
                  isLoading={listIsLoading}
                  onSubmit={() => {
                    setListIsLoading(true)
                    createNotice(
                      creatingNoticeTemplate!.id,
                      props.dataCrossIds,
                      Number(noticeAliquot || 0),
                      noticeNotes,
                      props.noticeType,
                      Number(dueDate)
                    ).then((response) => {
                      setFileUrl(response.data)
                      setListIsLoading(false)
                    })
                  }}
                />
                <button
                  className='btn btn-secondary'
                  onClick={() => setCreatingNoticeTemplate(null)}
                >
                  Cancelar
                </button>
              </>
            )}
          </>
        }
      />
      <div className='card-header border-0 pt-5'>
        <div className='card-header border-0 p-0 pb-5 align-items-center d-flex justify-content-between'>
          <h3 className='card-title align-items-start flex-column'>
            {props.noticeType == NoticeType.Notice && (
              <span className='card-label fw-bolder fs-3 mb-1'>Emitir notificação</span>
            )}
            {props.noticeType == NoticeType.Warning && (
              <span className='card-label fw-bolder fs-3 mb-1'>Emitir Autuação</span>
            )}
          </h3>
          <button
            className='btn btn-sm btn-light-primary h-40px'
            onClick={() => props.setCrossDetails(1)}
          >
            Voltar
          </button>
        </div>
        {listIsLoading ? (
          <IsLoadingList />
        ) : (
          <>
            {noticeTemplates.length > 0 ? (
              <>
                <div className='table-responsive'>
                  {/* begin::Table */}
                  <table className='table align-middle gs-0 gy-4'>
                    <NotificationTableHead />
                    {/* begin::Table body */}
                    <tbody>
                      {noticeTemplates.map((n, index) => (
                        <NoticeTemplateTableRow
                          onNotifyClicked={() => handleShowCreateNoticeModal(n)}
                          template={n}
                          key={index}
                          noticeType={props.noticeType}
                        />
                      ))}
                    </tbody>
                    {/* end::Table body */}
                  </table>
                  {/* end::Table */}
                </div>
                {noticeTemplates.length > 0 && (
                  <TablePagination
                    onSelectedPageChanged={onSelectedPageChanged}
                    selectedPage={selectedPage}
                    arrayLength={noticeTemplatesLength}
                    maxPageItens={6}
                  ></TablePagination>
                )}
              </>
            ) : (
              <EmptyStateList />
            )}
          </>
        )}
      </div>
    </>
  )
}
function NoticeTemplateTableRow({
  template,
  onNotifyClicked,
  noticeType,
}: {
  template: NoticeTemplate
  onNotifyClicked: () => void
  noticeType: NoticeType
}) {
  return (
    <tr key={template.id} className='text-center'>
      <td>
        <span className='text-dark fw-bolder d-block fs-6 '>{template.name}</span>
      </td>
      <td>
        <span
          className={`${getNoticeColor(noticeType)} fw-bolder d-block`}
        >
          {noticeType == NoticeType.Notice ? 'Notificação' : 'Autuação'}
        </span>
      </td>
      <td className='text-center d-flex justify-content-evenly'>
        <a onClick={() => downloadNoticePreview(template.htmlTemplate)}>
          <div className='btn btn-primary btn-sm '>Visualizar prévia</div>
        </a>
        <button
          className={`${
            noticeType == NoticeType.Notice ? 'btn-warning' : 'btn-danger'
          } btn btn-warning btn-sm `}
          onClick={() => {
            onNotifyClicked()
          }}
        >
          Emitir {noticeType == NoticeType.Notice ? 'Notificação' : 'Autuação'}
        </button>
      </td>
    </tr>
  )
}
