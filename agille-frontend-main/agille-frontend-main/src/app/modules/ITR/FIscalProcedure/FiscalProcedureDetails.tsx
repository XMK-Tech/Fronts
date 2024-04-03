import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import SelectModel from '../../../../components/SelectModel'
import {CustomButton} from '../../../components/CustomButton/CustomButton'
import {MaskedFieldInput, masks} from '../../../components/Form/FormInput'
import Table from '../../../components/Table/Table'
import {mapContent} from '../../../components/Table/TableHead'
import {
  createFiscalProcedurePhase,
  updateFiscalProcedurePhase,
  FiscalProcedure,
  getFiscalProcedure,
  ProcedurePhase,
  ProcedureStageStatus,
  ProcedureStageType,
  getFiscalProcedurePhase,
} from '../../../services/FiscalProcedureApi'
import ModeloModal, {ModalErrorFooter} from '../../../utils/components/ModeloModal'
import {
  formatArea,
  formatDate,
  formatMoney,
  formatTime,
  getFileNameFromUrl,
} from '../../../utils/functions'
import {DetailsInfo} from '../../auditor/DetailsNotification'
import {RegisterFormModelColumn} from '../../../../components/RegisterFormModel'
import {TablePagination} from '../../auth/components/TablePagination'
import {useProprietaries} from '../Propriety/Registration/useProprietaries'
import {getParameterLabel} from './getParameterLabel'
import {ForwardTermModel} from './terms/ForwardTerm'
import {JoinTermModel} from './terms/JoinTerm'
import {ArTermModel} from './terms/ArTerm'
import {exportProcedure} from './exportProcedure'
import {getITRDeclartion, ITRDeclarationType} from '../../../services/DeclarationApi'
import InfoModel from '../Components/InfoModel'
import {postReply} from '../../../services/TaxStageApi'
import {toAbsoluteUrl} from '../../../../_metronic/helpers'
import DropZoneModel, {Files} from '../../../../components/DropZoneModel'
import EmptyStateList from '../../../utils/components/EmptyStateList'
import {convertMoneyToNumber, moneyMask} from '../../../utils/functions/masks'

function getFiscalProcedurePhaseTypeColor(type: ProcedureStageType | string) {
  switch (type) {
    case ProcedureStageType.Notice:
      return 'success'
    case ProcedureStageType.NoticeWarn:
      return 'warning'
    case ProcedureStageType.ReleaseNotification:
      return 'info'
  }
}

function getFiscalProcedurePhaseStatusColor(status: ProcedureStageStatus | string) {
  switch (status) {
    case ProcedureStageStatus.AnsweredAfterExpiration:
      return 'danger'
    case ProcedureStageStatus.AnsweredOnTime:
      return 'success'
    case ProcedureStageStatus.Closed:
      return 'success'
    case ProcedureStageStatus.DeliveredOnTime:
      return 'success'
    case ProcedureStageStatus.ForwardedToTaxProcess:
      return 'warning'
    case ProcedureStageStatus.Issued:
      return 'info'
    case ProcedureStageStatus.DeliveredAfterExpiration:
      return 'danger'
    case ProcedureStageStatus.InProgress:
      return 'dark'
    case ProcedureStageStatus.Canceled:
      return 'danger'
    case ProcedureStageStatus.SubpoenaResponse:
      return 'info'
  }
}
function getFiscalProcedureStatusText(status: ProcedureStageStatus | string) {
  //TODO: Implement this with actual status
  switch (status) {
    case ProcedureStageStatus.AnsweredAfterExpiration:
      return 'Respondida após prazo'
    case ProcedureStageStatus.AnsweredOnTime:
      return 'Respondida no prazo'
    case ProcedureStageStatus.Closed:
      return 'Encerrada'
    case ProcedureStageStatus.DeliveredOnTime:
      return 'Entregue no prazo'
    case ProcedureStageStatus.ForwardedToTaxProcess:
      return 'Encaminhada para o processo fiscal'
    case ProcedureStageStatus.Issued:
      return 'Emitida'
    case ProcedureStageStatus.DeliveredAfterExpiration:
      return 'Entregue após o vencimento'
    case ProcedureStageStatus.InProgress:
      return 'Em andamento'
    case ProcedureStageStatus.Canceled:
      return 'Cancelada'
    case ProcedureStageStatus.SubpoenaResponse:
      return 'Reposta da Intimação'
  }
}

function FiscalProcedureParametersLabel(props: {parameters: number[]}) {
  const {parameters} = props
  function getBadgeColor(parameter: number) {
    switch (parameter) {
      case 1:
        return 'success'
      case 2:
        return 'warning'
      case 3:
        return 'danger'
      default:
        return 'primary'
    }
  }

  return (
    <div className={'mw-200px d-flex'}>
      {parameters.map((parameter, index) => (
        <span className={`m-2 badge badge-${getBadgeColor(parameter)}`} key={index}>
          {getParameterLabel(parameter)}
        </span>
      ))}
    </div>
  )
}

function getFiscalProcedureTypeText(type: ProcedureStageType | string) {
  //TODO: Implement this with actual type
  switch (type) {
    case ProcedureStageType.Notice:
      return 'Intimação'
    case ProcedureStageType.NoticeWarn:
      return 'Const. de Intimação'
    case ProcedureStageType.ReleaseNotification:
      return 'Not. de Lançamento'
  }
}

function FiscalProcedurePhaseStatus(props: {procedure: ProcedurePhase | null | undefined}) {
  const {procedure} = props
  if (!procedure) return null
  const status = getFiscalProcedureStatusText(procedure.status)
  return (
    <span
      className={`badge badge-${getFiscalProcedurePhaseStatusColor(
        procedure.status
      )} fw-bolder text-wrap mw-100`}
    >
      {status}
    </span>
  )
}

function FiscalProcedurePhaseType(props: {procedure: ProcedurePhase | null | undefined}) {
  const {procedure} = props
  if (!procedure) return null
  const type = getFiscalProcedureTypeText(procedure.type)
  return (
    <span
      className={`badge badge-${getFiscalProcedurePhaseTypeColor(
        procedure.type
      )}  fw-bolder text-wrap mw-100`}
    >
      {type}
    </span>
  )
}

function FiscalProcedureReply(props: {replyTo: string | null; onClick: () => void}) {
  return props.replyTo === null ? (
    <span className={`badge badge-info fw-bolder`}>Não Respondida</span>
  ) : (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <a
      href='#'
      onClick={(e) => {
        props.onClick()
        e.preventDefault()
      }}
    >
      <span className={`badge badge-success fw-bolder`}>Ver resposta</span>
    </a>
  )
}

export default function FiscalProcedureDetails() {
  const [showModalAction, setShowModalAction] = useState(false)
  const [showModalProtocol, setShowModalProtocol] = useState(false)
  const [showModalReply, setShowModalReply] = useState(false)
  const [showingReply, setShowingReply] = useState<ProcedurePhase | null>(null)
  const [fiscalProcedureDetails, setFiscalProcedureDetails] = useState<FiscalProcedure>()
  const [phaseId, setPhaseId] = useState<string | null>(null)
  const [ITRDeclartion, setITRDeclartion] = useState<ITRDeclarationType | null>(null)
  const [DTEModalError, setDTEModalError] = useState(false)
  const fiscalProcedure = fiscalProcedureDetails?.stages ?? []
  function getMenuItems(e: ProcedurePhase) {
    enum ProcedurePhaseMenuAction {
      IssueJoininigTerm,
      IssueAR,
      IssueDTE,
      EditPhase,
      AnswerPhase,
    }
    const items = [
      {
        labelItem: 'Emitir termo de juntada',
        onClick: () => {
          setShowModalJoined(!showModalJoined)
          setPhaseId(e.id)
        },
        action: ProcedurePhaseMenuAction.IssueJoininigTerm,
      },
      {
        labelItem: 'Gerar AR',
        onClick: () => {
          setShowModalAr(!showModalAr)
          setPhaseId(e.id)
        },
        action: ProcedurePhaseMenuAction.IssueAR,
      },

      {
        labelItem: 'Gerar arquivo DTE',
        onClick: () => {
          setPhaseId(e.id)
          if (e.fileUrl !== null || '') {
            fiscalProcedureDetails && exportProcedure(fiscalProcedureDetails.id, e.id)
          } else {
            setDTEModalError(true)
          }
        },
        action: ProcedurePhaseMenuAction.IssueDTE,
      },
      {
        labelItem: 'Editar',
        onClick: () => {
          setShowModalProtocol(!showModalProtocol)
          setPhaseId(e.id)
        },
        action: ProcedurePhaseMenuAction.EditPhase,
      },
      {
        labelItem: 'Responder',
        onClick: () => {
          setShowModalReply(!showModalReply)
          setPhaseId(e.id)
        },
        action: ProcedurePhaseMenuAction.AnswerPhase,
      },
    ]
    if (e.status === ProcedureStageStatus.Canceled) {
      return items.filter((i) => i.action === ProcedurePhaseMenuAction.EditPhase)
    }
    if (!e.subjectName) {
      return items.filter(
        (i) =>
          i.action === ProcedurePhaseMenuAction.EditPhase ||
          i.action === ProcedurePhaseMenuAction.IssueDTE
      )
    }
    if (getReplyId(e, fiscalProcedure)) {
      return items.filter((i) => i.action !== ProcedurePhaseMenuAction.AnswerPhase)
    }

    return items
  }

  const fiscalProcedureList = getFilteredStages(fiscalProcedure).map((e) => ({
    columns: mapContent([
      e.number,
      <FiscalProcedureReply
        onClick={() => {
          const phase = getReplyPhase(fiscalProcedure, e)
          if (phase) {
            setShowingReply(phase)
          }
        }}
        replyTo={getReplyId(e, fiscalProcedure)}
      />,
      e.subjectName,
      formatMoney(e.fineAmount),
      e.trackingCode,
      <FiscalProcedurePhaseType procedure={e} />,
      formatDate(e.createdAt),
      formatDate(e.certificationDate),
      formatDate(e.cutOffDate),
      <FiscalProcedurePhaseStatus procedure={e} />,
    ]),

    detailsColumn: [
      {
        content: 'Ações',
        dropButton: true,
        className: 'btn-primary',
        dropItems: getMenuItems(e),
      },
    ],
  }))

  const {id} = useParams<{id: string}>()

  const refreshList = () => {
    getFiscalProcedure(id).then((res) => setFiscalProcedureDetails(res.data))
    getITRDeclartion(id).then((res) => setITRDeclartion(res.data))
  }
  useEffect(() => {
    refreshList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const [showModalJoined, setShowModalJoined] = useState(false)
  const [showModalAr, setShowModalAr] = useState(false)
  const [showModalComparative, setShowModalComparative] = useState(false)

  const declarationList = ITRDeclartion?.declarations?.map((e) => ({
    columns: mapContent([
      e.description,
      formatArea(e.area),
      e.landValue === null ? '-' : formatMoney(e.landValue),
    ]),
    className: e.landValue === null ? 'bg-light' : '',
  }))

  return (
    <>
      <div className='card'>
        <>
          <div className='card-header border-0'>
            <h3 className='card-title align-items-start flex-column'>
              <span className='card-label fw-bolder fs-3 mb-1'>{`Detalhes do Procedimento Fiscal - ${fiscalProcedureDetails?.processNumber}`}</span>
            </h3>
            <div className='d-flex align-items-center h-10'>
              <CustomButton
                label='Editar'
                link={`/ITR/RegisterFiscalProcedure/${id}`}
                onSubmit={() => {}}
                isLoading={false}
              ></CustomButton>

              <CustomButton
                label='Gerar encaminhamento'
                onSubmit={() => setShowModalAction(!showModalAction)}
                isLoading={false}
              ></CustomButton>
              <CustomButton
                label='Declaração do ITR'
                onSubmit={() => setShowModalComparative(!showModalComparative)}
                isLoading={false}
              ></CustomButton>
            </div>
          </div>
          <div className=' shadow rounded bg-light my-5 mx-10 p-4'>
            <div className='d-flex justify-content-around'>
              <DetailsInfo
                title={``}
                items={[
                  {detail: 'Propriedade', infoDetail: fiscalProcedureDetails?.propriety?.name},
                  {detail: 'Número do Processo', infoDetail: fiscalProcedureDetails?.processNumber},
                ]}
              />
              <DetailsInfo
                title=''
                items={[{detail: 'CIB', infoDetail: fiscalProcedureDetails?.cibNumber}]}
              />
            </div>
            <div className='d-flex justify-content-around'>
              <DetailsInfo
                title=''
                items={[
                  {
                    detail: 'Parametros',
                    infoDetail: (
                      <FiscalProcedureParametersLabel
                        parameters={fiscalProcedureDetails?.taxParams ?? []}
                      />
                    ),
                  },
                ]}
              />
              <div className='w-200px' />
            </div>
          </div>
          {/* <div className='my-5 mx-10'>
         
          <DetailsModel title={`Procedimento Fiscal - ${fiscalProcedureDetails?.processNumber}`}>
            <ColumnDetails
              info={[
                {label: 'Propriedade', info: fiscalProcedureDetails?.propriety?.name},
                {label: 'Número do Processo', info: fiscalProcedureDetails?.processNumber},
                {label: 'CIB', info: fiscalProcedureDetails?.cibNumber},
              ]}
            ></ColumnDetails>
            <ColumnDetails
              info={[
                {label: 'Área de inscrição', info: ''},
                {label: 'Parametros', info: ''},
              ]}
            ></ColumnDetails>
          </DetailsModel>
        </div> */}
          <div className='card-header border-0'>
            <h3 className='card-title  flex-column'>
              <span className='card-label fw-bolder fs-3 mb-1'>Etapas do Procedimento</span>
            </h3>
            <div className='d-flex align-items-center h-10'>
              <CustomButton
                label='Adicionar'
                onSubmit={() => {
                  setShowModalProtocol(!showModalProtocol)
                  setPhaseId('')
                }}
                isLoading={false}
              ></CustomButton>
            </div>
          </div>
          <div className='my-5 mx-10'>
            <Table
              rows={fiscalProcedureList ?? []}
              headColumns={mapContent([
                'Número do Documento',
                'Resposta',
                'Sujeito Passivo',
                'Valor da multa',
                'Código de rastreio',
                'Tipo do Documento',
                'Data de Criação',
                'Data de Classificação',
                'Data de Corte',
                'Status do Processo',
                'Visualizar Etapa',
              ])}
            ></Table>
            <TablePagination
              arrayLength={3}
              maxPageItens={6}
              onSelectedPageChanged={() => {}}
              selectedPage={1}
            ></TablePagination>
          </div>

          <ForwardTermModel
            id={id}
            showModalAction={showModalAction}
            setShowModalAction={setShowModalAction}
          ></ForwardTermModel>
          <JoinTermModel
            id={phaseId || ''}
            showModalJoin={showModalJoined}
            setShowModalJoin={setShowModalJoined}
          ></JoinTermModel>

          <ArTermModel
            id={phaseId || ''}
            showModalAr={showModalAr}
            setShowModalAr={setShowModalAr}
          ></ArTermModel>
        </>

        <AddPhaseModal
          procedureId={id}
          proprietyId={fiscalProcedureDetails?.propriety?.id || null}
          showModalProtocol={showModalProtocol}
          setShowModalProtocol={setShowModalProtocol}
          refreshList={refreshList}
          phaseId={phaseId}
          setPhaseId={setPhaseId}
        />
        <ReplyModal
          procedureId={id}
          proprietyId={fiscalProcedureDetails?.propriety?.id || null}
          showModalReply={showModalReply}
          setShowModalReply={setShowModalReply}
          phaseId={phaseId}
          setPhaseId={setPhaseId}
          refreshList={refreshList}
        />
        <ReplyModalDetails
          procedureId={id}
          proprietyId={fiscalProcedureDetails?.propriety?.id || null}
          showModalReplyDetails={!!showingReply}
          handleCloseModal={() => {
            setShowingReply(null)
          }}
          replyPhase={showingReply}
        />

        <ModeloModal
          title={'Erro'}
          onHide={() => setDTEModalError(!DTEModalError)}
          show={DTEModalError}
          body={
            <InfoModel
              title='Nenhum arquivo encontrado !'
              message='para geração de arquivo DTE, e necessário fazer upload de arquivo na etapa do procedimento'
            />
          }
          footer={
            <CustomButton
              label='Upload de arquivo'
              onSubmit={() => {
                setShowModalProtocol(!showModalProtocol)
                setPhaseId(phaseId)
                setDTEModalError(false)
              }}
              isLoading={false}
            />
          }
        ></ModeloModal>
        <ModeloModal
          title={'Declaração ITR'}
          onHide={() => setShowModalComparative(false)}
          show={showModalComparative}
          body={
            <Table
              rows={declarationList || []}
              headColumns={mapContent(['Nome', 'Área declarada', 'Valor da Terra Nua'])}
            />
          }
          footer={<CustomButton isLoading={false} label={'Exportar'} onSubmit={() => {}} />}
        />
      </div>
    </>
  )
}
function AddPhaseModal({
  showModalProtocol,
  setShowModalProtocol,
  procedureId,
  refreshList,
  phaseId,
  setPhaseId,
  proprietyId,
}: {
  procedureId: string
  showModalProtocol: boolean
  setShowModalProtocol: React.Dispatch<React.SetStateAction<boolean>>
  refreshList: () => void
  phaseId: string | null
  proprietyId: string | null
  setPhaseId: React.Dispatch<React.SetStateAction<string | null>>
}) {
  const [acknowledgeDate, setAcknowlegdeDate] = useState('')
  const [acknowledgeTime, setAcknowlegdeTime] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [dueTime, setDueTime] = useState('')
  const [status, setStatus] = useState('')
  const [subject, setSubject] = useState<string | null>(null)
  const [type, setType] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [attachmentIds, setAttachmentIds] = useState<string[] | null>(null)
  const [fineAmount, setfineAmount] = useState('')
  // const [documentNumber, setDocumentNumber] = useState('')
  const [trackingCode, setTrackingCode] = useState<string | null>(null)
  const [error, setError] = useState<{message: any} | null>(null)
  const [attachments, setAttachments] = useState<Files[]>([])

  console.log(convertMoneyToNumber(fineAmount))

  const save = async () => {
    setIsLoading(true)
    try {
      await createFiscalProcedurePhase(procedureId, {
        arCode: '1',
        certificationDate: dateAndTimeToISO(acknowledgeDate, acknowledgeTime),
        cutOffDate: dateAndTimeToISO(dueDate, dueTime),
        number: '1',
        status: status,
        type: type,
        fileUrl: '',
        attachmentIds: attachmentIds,
        fineAmount: convertMoneyToNumber(fineAmount),
        trackingCode: trackingCode,
        subjectId: subject,
      })
      setShowModalProtocol(false)
      refreshList()
      setError(null)
    } catch (err) {
      setError({
        message: err,
      })
    }
    setIsLoading(false)
  }

  const edit = async () => {
    setIsLoading(true)
    try {
      await updateFiscalProcedurePhase(phaseId, {
        arCode: '1',
        certificationDate: dateAndTimeToISO(acknowledgeDate, acknowledgeTime),
        cutOffDate: dateAndTimeToISO(dueDate, dueTime),
        number: '1',
        status: status,
        type: type,
        fileUrl: '',
        attachmentIds: attachmentIds,
        fineAmount: convertMoneyToNumber(fineAmount),
        trackingCode: trackingCode,
        subjectId: subject,
      })
      setShowModalProtocol(false)
      setError(null)
      refreshList()
    } catch (err) {
      setError({
        message: err,
      })
    }
    setIsLoading(false)
  }

  const persons = useProprietaries(proprietyId ?? '')

  useEffect(() => {
    if (phaseId) {
      getFiscalProcedurePhase(phaseId).then((res) => {
        setAcknowlegdeDate(res.data.certificationDate?.split('T')?.[0] ?? '')
        setAcknowlegdeTime(res.data.certificationDate?.split('T')?.[1] ?? '')
        setDueDate(res.data.cutOffDate?.split('T')?.[0] ?? '')
        setDueTime(res.data.cutOffDate?.split('T')?.[1] ?? '')
        setStatus(res.data.status?.toString() ?? '')
        setSubject(res.data.subjectId ?? '')
        setType(res.data.type ?? '')
        setfineAmount(formatMoney(res.data.fineAmount) ?? '')
        setTrackingCode(res.data.trackingCode ?? '')
        setAttachmentIds(res.data.attachments?.map((e: any) => e.id) || [])
        setAttachments(res.data.attachments ?? '')
      })
    } else {
      setAcknowlegdeDate('')
      setAcknowlegdeTime('')
      setDueDate('')
      setDueTime('')
      setStatus('')
      setSubject(null)
      setType('')
      setfineAmount('')
      setTrackingCode(null)
      setAttachmentIds(null)
    }
  }, [phaseId, showModalProtocol])

  const modalFooter = (
    <>
      {phaseId ? (
        <CustomButton label='Editar' onSubmit={edit} isLoading={isLoading}></CustomButton>
      ) : (
        <CustomButton label='Salvar' onSubmit={save} isLoading={isLoading}></CustomButton>
      )}
    </>
  )
  const attachmentList = attachments
    ?.map((attachment) => ({
      id: attachment.id,
      name: attachment.displayName ?? '',
      type: attachment.type,
      url: attachment.url,
    }))
    .filter((attachment) => attachmentIds?.includes(attachment.id))

  return (
    <ModeloModal
      show={showModalProtocol}
      onHide={() => {
        setShowModalProtocol(!showModalProtocol)
        setError(null)
        setPhaseId(null)
      }}
      title={phaseId ? 'Editar Etapa' : 'Adicionar Etapa'}
      size='lg'
      body={
        <div className='d-flex flex-row justify-content-center align-items-center'>
          <RegisterFormModelColumn>
            <div className='py-3 d-flex'>
              <DropZoneModel
                files={attachmentList}
                onUploaded={(ids: string[]) => {
                  setAttachmentIds(ids)
                }}
                title='Upload de Arquivos'
              />
            </div>

            <div className='py-3'>
              <SelectModel
                label='Status do processo'
                data={[
                  {name: 'Emitida', id: '0'},
                  {name: 'Entregue no prazo', id: '1'},
                  {name: 'Entregue após o vencimento', id: '2'},
                  {name: 'Respondida no prazo', id: '3'},
                  {name: 'Respondida após o prazo', id: '4'},
                  {name: 'Encerrada', id: '5'},
                  {name: 'Encaminhada para processo Fiscal', id: '6'},
                  {name: 'Em Andamento', id: '7'},
                  {name: 'Cancelada', id: '8'},
                  {name: 'Reposta da Intimação.', id: '9'},
                ]}
                value={status.toString()}
                onChange={(e) => setStatus(String(e.id))}
              ></SelectModel>
            </div>
            <div className='py-3'>
              <strong className=''>Data de cientificação</strong>
              <input
                className=' shadow form-control'
                type='date'
                value={acknowledgeDate}
                onChange={(e) => setAcknowlegdeDate(e.target.value)}
              />
            </div>
            <div className='py-3'>
              <strong className=''>Hora de cientificação</strong>

              <input
                type='time'
                className=' shadow form-control'
                value={acknowledgeTime}
                onChange={(e) => setAcknowlegdeTime(e.target.value)}
              />
            </div>
            <div className='py-3'>
              <strong className=''>Data de vencimento</strong>
              <input
                className=' shadow form-control'
                type='date'
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div className='py-3'>
              <strong className=''>Hora de vencimento</strong>

              <input
                type='time'
                className=' shadow form-control'
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
              />
            </div>
            <MaskedFieldInput
              label='Código de rastreio'
              value={trackingCode ?? ''}
              className='shadow form-control'
              onChange={(e) => {
                setTrackingCode(e)
              }}
            />
            <div className='py-3'>
              <SelectModel
                label='Tipo'
                data={[
                  {name: 'Notificação de lançamento', id: '0'},
                  {name: 'Constatação e intimação', id: '1'},
                  {name: 'Intimação', id: '2'},
                ]}
                value={type.toString()}
                onChange={(e) => setType(String(e.id))}
              ></SelectModel>
            </div>
            <div className='py-3'>
              <SelectModel
                label='Sujeito passivo'
                data={persons}
                value={subject ?? ''}
                onChange={(e) => setSubject(e.id as string)}
              ></SelectModel>
            </div>
            {hasFine(Number(type)) && (
              <MaskedFieldInput
                label='Valor da multa'
                value={fineAmount}
                className='shadow form-control'
                onChange={(e) => setfineAmount(moneyMask(e))}
              />
            )}
            {/* <MaskedFieldInput
              mask={masks.number}
              label='Número do Documento'
              value={documentNumber}
              className='shadow form-control'
              onChange={(e) => setDocumentNumber(e)}
            /> */}
          </RegisterFormModelColumn>
        </div>
      }
      footer={<ModalErrorFooter error={error} modalFooter={modalFooter} />}
    ></ModeloModal>
  )
}

export function ReplyModal({
  // eslint-disable-next-line no-useless-rename
  showModalReply: showModalReply,
  // eslint-disable-next-line no-useless-rename
  setShowModalReply: setShowModalReply,
  procedureId,
  refreshList,
  phaseId,
  setPhaseId,
  proprietyId,
}: {
  procedureId?: string
  showModalReply: boolean
  setShowModalReply: React.Dispatch<React.SetStateAction<boolean>>
  refreshList: () => void
  phaseId?: string | null
  proprietyId?: string | null
  setPhaseId: React.Dispatch<React.SetStateAction<string | null>>
}) {
  const [acknowledgeDate, setAcknowlegdeDate] = useState('')
  const [acknowledgeTime, setAcknowlegdeTime] = useState('')
  const [status, setStatus] = useState('')
  const [isLoading] = useState(false)
  const [, setLoadingButton] = useState(false)
  const [attachmentIds, setAttachmentIds] = useState<string[] | null>(null)
  const [error, setError] = useState<{message: any} | null>(null)

  const saveReply = async () => {
    setLoadingButton(true)
    try {
      await postReply(phaseId, {
        certificationDate: dateAndTimeToISO(acknowledgeDate, acknowledgeTime) ?? '',
        status: status,
        attachmentIds: attachmentIds,
      })

      setShowModalReply(false)
      refreshList()
    } catch (err) {
      setError({message: err})
    } finally {
      setLoadingButton(false)
    }
  }

  const modalFooter = (
    <CustomButton
      label='Responder'
      onSubmit={saveReply}
      disabled={isLoading}
      isLoading={isLoading}
    ></CustomButton>
  )

  return (
    <ModeloModal
      size='lg'
      show={showModalReply}
      onHide={() => {
        setShowModalReply(!showModalReply)
        setStatus('')
        setAcknowlegdeDate('')
        setAcknowlegdeTime('')
        setError(null)
        setPhaseId(null)
      }}
      title={'Resposta'}
      body={
        <div className='d-flex flex-row justify-content-center align-items-center'>
          <RegisterFormModelColumn>
            <div className='py-3 d-flex'>
              <DropZoneModel
                onUploaded={(ids: string[]) => {
                  setAttachmentIds(ids)
                }}
                title='Upload de Arquivos'
              />
            </div>

            <div className='py-3'>
              <SelectModel
                label='Status do processo'
                data={[
                  {name: 'Emitida', id: '0'},
                  {name: 'Entregue no prazo', id: '1'},
                  {name: 'Entregue após o vencimento', id: '2'},
                  {name: 'Respondida no prazo', id: '3'},
                  {name: 'Respondida após o prazo', id: '4'},
                  {name: 'Encerrada', id: '5'},
                  {name: 'Encaminhada para processo Fiscal', id: '6'},
                  {name: 'Em Andamento', id: '7'},
                  {name: 'Cancelada', id: '8'},
                  {name: 'Reposta da Intimação.', id: '9'},
                ]}
                value={status.toString()}
                onChange={(e) => setStatus(String(e.id))}
              ></SelectModel>
            </div>
            <div className='py-3'>
              <strong className=''>Data de cientificação</strong>
              <input
                className=' shadow form-control'
                type='date'
                value={acknowledgeDate}
                onChange={(e) => setAcknowlegdeDate(e.target.value)}
              />
            </div>
            <div className='py-3'>
              <strong className=''>Hora de cientificação</strong>

              <input
                type='time'
                className=' shadow form-control'
                value={acknowledgeTime}
                onChange={(e) => setAcknowlegdeTime(e.target.value)}
              />
            </div>
          </RegisterFormModelColumn>
        </div>
      }
      footer={<ModalErrorFooter error={error} modalFooter={modalFooter} />}
    ></ModeloModal>
  )
}

export function ReplyModalDetails({
  showModalReplyDetails,
  handleCloseModal,
  replyPhase,
  refreshList,
}: {
  procedureId?: string
  showModalReplyDetails: boolean
  handleCloseModal: () => void
  refreshList?: () => void
  replyPhase?: ProcedurePhase | null
  proprietyId?: string | null
}) {
  const modalFooter = (
    <CustomButton label='ok' onSubmit={() => handleCloseModal()} isLoading={false}></CustomButton>
  )
  return (
    <ModeloModal
      size='lg'
      show={showModalReplyDetails}
      onHide={() => {
        handleCloseModal()
      }}
      title={'Detalhes da Resposta'}
      body={
        <div className='d-flex flex-row justify-content-center align-items-center'>
          <RegisterFormModelColumn>
            <div className='d-flex flex-column align-item-center justify-content-center'>
              <div className='d-flex justify-content-center'>
                <img src={toAbsoluteUrl('/media/svg/files/pdf.svg')} className='mb-3' alt=''></img>
              </div>
              <a href={replyPhase?.fileUrl ?? ''} className='d-flex justify-content-center mb-10'>
                <strong>{getFileNameFromUrl(replyPhase?.fileUrl)}</strong>
              </a>
            </div>
            <div className='d-flex justify-content-between mx-8'>
              <TitleFild
                title='Status'
                fild={<FiscalProcedurePhaseStatus procedure={replyPhase} />}
              />

              <TitleFild
                title='Tipo do documento'
                fild={<FiscalProcedurePhaseType procedure={replyPhase} />}
              />
            </div>
            <div className='d-flex justify-content-between mx-8'>
              <TitleFild
                title='Data de cientificação'
                fild={formatDate(replyPhase?.certificationDate)}
              />

              <TitleFild
                title={'Hora da Cientificação'}
                fild={formatTime(replyPhase?.certificationDate)}
              />
            </div>
            <div className='d-flex flex-column align-item-center justify-content-center'>
              <TitleFild
                title={'Arquivos'}
                fild={
                  <>
                    {replyPhase?.attachments?.length === 0 ? (
                      <EmptyStateList text='Nenhum arquivo adicionado' />
                    ) : (
                      <Table
                        rows={
                          replyPhase?.attachments?.map((file) => ({
                            columns: [
                              ...mapContent([file.type, file.displayName], 'normal'),
                              {
                                content: (
                                  <div className='d-flex'>
                                    <div style={{marginRight: 4, marginLeft: 4}}>
                                      <a href={file.url} className='btn btn-sm btn-primary m-5px'>
                                        <i className='fas fa-download  p-0'></i>
                                      </a>
                                    </div>
                                  </div>
                                ),
                              },
                            ],
                          })) || []
                        }
                        headColumns={mapContent(['TIPO', 'NOME', ''])}
                      />
                    )}
                  </>
                }
              />
            </div>
          </RegisterFormModelColumn>
        </div>
      }
      footer={<ModalErrorFooter error={null} modalFooter={modalFooter} />}
    ></ModeloModal>
  )
}

export function TitleFild(props: {title: string; fild: React.ReactNode}) {
  return (
    <div className='py-3'>
      <strong className=''>{props.title}</strong>
      <div className='py-2'>{props.fild}</div>
    </div>
  )
}

export function dateAndTimeToISO(acknowledgeDate: string, acknowledgeTime: string): string | null {
  if (!acknowledgeDate) return null
  const time = !acknowledgeTime ? '00:00' : acknowledgeTime

  return `${acknowledgeDate}T${time}`
}

function hasFine(type: number) {
  return type !== 2
}

export function getFilteredStages(stages: ProcedurePhase[]): ProcedurePhase[] {
  return stages.filter((stage) => !stage.replyTo)
}

export function getReplyId(stage: ProcedurePhase, allStages: ProcedurePhase[]): string | null {
  const reply = getReplyPhase(allStages, stage)
  return reply?.id ?? null
}
function getReplyPhase(allStages: ProcedurePhase[], stage: ProcedurePhase) {
  return allStages.find((e) => e.replyTo === stage.id)
}
