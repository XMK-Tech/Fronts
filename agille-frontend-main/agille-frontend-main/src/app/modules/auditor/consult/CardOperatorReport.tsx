import React, {useEffect, useState} from 'react'
import {toAbsoluteUrl} from '../../../../_metronic/helpers'
import EmptyStateList from '../../../utils/components/EmptyStateList'
import IsLoadingList from '../../../utils/components/IsLoadingList'
import ModeloModal from '../../../utils/components/ModeloModal'
import {
  distinctValues,
  formatCnpj,
  formatMoney,
  getDate,
  getFinalReferenceMonth,
  getInitialReferenceMonth,
  getMonthandYear,
  sumValues,
} from '../../../utils/functions'
import SearchFilter from '../../auth/components/SearchFilter'
import {BackButton} from '../../../components/BackButton/BackButton'
import {useParams} from 'react-router-dom'
import {getCardOperatorDataCrossingResults} from '../../../services/DataCrossingApi'
import {
  createNotice,
  downloadNoticePreview,
  getNoticeTemplatesByType,
  NoticeTemplate,
  NoticeType,
} from '../../../services/NoticeApi'

import NumberFormat from 'react-number-format'
import {CustomButton} from '../../../components/CustomButton/CustomButton'
import {TablePagination} from '../../auth/components/TablePagination'
import SelectModel from '../../../../components/SelectModel'
import {RegisterFormModelColumn} from '../../../../components/RegisterFormModel'
import {
  getCardOperatorTransactions,
  getJuridicalPersonsTransactions,
} from '../../../services/JuridicalPersonApi'
import {CustomSearchFilter, useFilter} from '../../auth/components/AdminSearchFilter'

type TransactionTableRowProps = {
  field1: string
  field2: string
  field3: string
}
type TableViewProps2 = {
  isLoading: boolean
  setIsNotifiyng: (value: number) => void
  noticeParams: NoticeParams | null
  noticeType: NoticeType
}

export type DataCrossResult = Transaction & {
  id: string
  document: string
}
export type DataCrossDetailsShow = Omit<
  DataCrossResult & {
    transactions: Transaction[]
    showDetails?: () => void
    setCrossDetails?: (value: number) => void
    operatorIsRegistered: boolean
  },
  'id'
>
export type Transaction = {
  id: string
  referente: string
  taxaMedia: string
  taxaInformada: string
  valorTaxaMedia: string
  valorTaxaInformada: string
  transacionado: string
  valorDeclarado: string
  diferenca: string
  operatorIsRegistered: boolean
}
export type NoticeParams = {
  divergencies: string[]
  taxaMedia: string
  taxaInformada: string
  valorTaxaMedia: string
  valorTaxaInformada: string
}
export type DataCrossResults = {
  results: DataCrossResult[]
}
type TableViewProps = {
  dataCrossId: string
}
export type CrosslistInfoCardProps = {
  imgUrl: string
  userInfo: CrosslistModalInfoProps[]
}
export type CrosslistModalInfoProps = {
  item: string
  description: string
}
export type CrossListTableRowProps = DataCrossResult & {
  showDetails?: () => void
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
          className={`${
            noticeType == NoticeType.Notice ? 'text-warning' : 'text-danger'
          } fw-bolder d-block`}
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
function AuditorNotification(props: TableViewProps2) {
  const [noticeTemplatesLength, setnoticeTemplatesLength] = useState<number>(0)
  const [selectedPage, setSelectedPage] = useState<number>(1)
  const [noticeAliquot, setNoticeAliquot] = useState<number>()
  const [dueDate, setDueDate] = useState<string>('')
  const [listIsLoading, setListIsLoading] = useState(true)
  const [noticeNotes, setNoticeNotes] = useState<string>('')
  const [noticeTemplates, setNoticeTemplates] = useState<NoticeTemplate[]>([])
  const [creatingNoticeTemplate, setCreatingNoticeTemplate] = useState<NoticeTemplate | null>(null)
  const [selectedRateType, setSelectedRateType] = useState('')

  useEffect(() => {
    setListIsLoading(true)
    getNoticeTemplatesByType('0', props.noticeType.toString(), selectedPage).then((response) => {
      setNoticeTemplates(response.data)
      setnoticeTemplatesLength(response.metadata.dataSize)
      setListIsLoading(false)
    })
  }, [selectedPage, props.noticeType])
  // useEffect(() => {
  //   getServiceTypePerson(id).then((res) => {
  //     setServiceTypePerson(res.data)
  //   })
  // }, [])

  const handleShowCreateNoticeModal = (template: NoticeTemplate) => {
    setCreatingNoticeTemplate(template)
  }

  function onSelectedPageChanged(page: number) {
    setSelectedPage(page)
  }

  const [fileUrl, setFileUrl] = useState('')
  const showModal = !!creatingNoticeTemplate

  const calculationBaselist = [
    {
      id: '0',
      name: `Taxa padrão - ${formatMoney(Number(props.noticeParams?.valorTaxaInformada))}- ${
        props.noticeParams?.taxaInformada
      }%`,
    },
    {
      id: '1',
      name: `Taxa média - ${formatMoney(Number(props.noticeParams?.valorTaxaMedia))} - ${
        props.noticeParams?.taxaMedia
      }%`,
    },
  ]
  return (
    <>
      <ModeloModal
        title={`Emitir ${props.noticeType == NoticeType.Notice ? 'Notificação' : 'Autuação'}`}
        show={showModal}
        onHide={() => setCreatingNoticeTemplate(null)}
        body={
          !fileUrl ? (
            <div className='d-flex justify-content-around'>
              <div className='d-flex flex-column align-items-center'>
                <strong className='d-flex align-items-center strongx-5 fw-bowlder fs-6 w-400px'>
                  Insira a porcentagem da alíquota e as observações da{' '}
                  {props.noticeType == NoticeType.Notice ? 'Notificação' : 'Autuação'}
                </strong>
                <RegisterFormModelColumn>
                  <div className='py-3'>
                    <strong className=''>Alíquota</strong>

                    <NumberFormat
                      className=' mw-400px shadow form-control'
                      format='##%'
                      placeholder='Ex.: 10%'
                      value={noticeAliquot}
                      onChange={(e: any) => setNoticeAliquot(Number(e.target.value.slice(0, 2)))}
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
                  <div>
                    <SelectModel
                      value={selectedRateType}
                      label='Base de Cálculo'
                      onChange={(item: any) => setSelectedRateType(item.id)}
                      data={calculationBaselist}
                    ></SelectModel>
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
              </div>
            </div>
          ) : (
            <p>
              {props.noticeType == NoticeType.Notice ? 'Notificação' : 'Autuação'} emitida com
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
                      props.noticeParams?.divergencies || [],
                      noticeAliquot || 0,
                      noticeNotes,
                      props.noticeType,
                      Number(dueDate),
                      Number(selectedRateType)
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
            onClick={() => props.setIsNotifiyng(0)}
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
function getTotalTransactionValues(
  companyCrossTransactions: Transaction[]
): Omit<Transaction, 'id'> {
  let initialMonth = companyCrossTransactions[0].referente
  let finalMonth = companyCrossTransactions[0].referente
  companyCrossTransactions
    .map((t) => t.referente)
    .forEach((r) => {
      finalMonth = getFinalReferenceMonth(finalMonth, r)
      initialMonth = getInitialReferenceMonth(initialMonth, r)
    })

  let referencePeriod = ''
  if (initialMonth === finalMonth) {
    referencePeriod = `${initialMonth.slice(0, 7)}`
  } else {
    referencePeriod = `${initialMonth} - ${finalMonth}`
  }
  const totalTransacionado = sumValues(companyCrossTransactions.map((t) => Number(t.transacionado)))
  const totalTaxaMedia = sumValues(companyCrossTransactions.map((t) => Number(t.valorTaxaMedia)))
  const totalTaxaInformada = sumValues(
    companyCrossTransactions.map((t) => Number(t.valorTaxaInformada))
  )
  const totalDiferenca = sumValues(companyCrossTransactions.map((t) => Number(t.diferenca)))
  const transaction = companyCrossTransactions[0]
  return {
    referente: referencePeriod,
    transacionado: String(totalTransacionado),
    valorTaxaMedia: String(totalTaxaMedia),
    valorTaxaInformada: String(totalTaxaInformada),
    taxaInformada: transaction.taxaInformada,
    taxaMedia: transaction.taxaMedia,
    valorDeclarado: transaction.valorDeclarado,
    diferenca: String(totalDiferenca),
    operatorIsRegistered: transaction.operatorIsRegistered,
  }
}
function groupByCompanyAndAggregate(
  document: string,
  dataCrossResults: DataCrossResult[]
): DataCrossDetailsShow {
  const companyCrossTransactions = dataCrossResults.filter(
    (r) => r.document === document
  ) as Transaction[]

  const totalValues = getTotalTransactionValues(companyCrossTransactions)
  return {
    document: document,
    transactions: companyCrossTransactions,
    ...totalValues,
  }
}
export function getShowCrossDetails(dataCrossResults: DataCrossResult[]): DataCrossDetailsShow[] {
  const companyDocuments = dataCrossResults.map((r) => r.document)
  const distinctCompanyDocument = companyDocuments.filter(distinctValues)

  const dataCrossDetails = distinctCompanyDocument.map((d) =>
    groupByCompanyAndAggregate(d, dataCrossResults)
  ) as DataCrossDetailsShow[]
  return dataCrossDetails
}
const ImportsTableHead: React.FC<{}> = () => {
  return (
    <>
      <thead>
        <tr className='fw-bolder text-muted bg-light justify-context-center'>
          <th className='rounded-start text-center align-middle  ps-3'></th>
          <th className='text-center align-middle '>CNPJ</th>
          <th className='text-center align-middle '>REFERENTE</th>
          <th className='text-center align-middle '>
            TOTAL<br></br> TRANSACIONADO
          </th>
          <th className='text-center align-middle '>
            DMS <br></br> (OPERADORA){' '}
          </th>
          <th className='text-center align-middle '>
            DIFERENÇA <br></br> (TRANSACIONADO X DMS){' '}
          </th>
          {/* TODO: Use right terms */}
          <th className='text-center align-middle '>
            BASE DE CÁLCULO <br></br> (TAXA PADRÃO){' '}
          </th>
          <th className='text-center align-middle '>
            BASE DE CÁLCULO <br></br>(TAXA MÉDIA)
          </th>
          <th></th>
          <th></th>
        </tr>
      </thead>
    </>
  )
}

export const CrossListModalInfo: React.FC<CrosslistModalInfoProps> = (props) => {
  return (
    <>
      <div className=' d-flex flex-row'>
        <p className='pb-3 text-muted'>
          <strong className='text-black'>{props.item}:</strong>
          &ensp; {props.description}
        </p>
        <div className='pb-4 text-muted'> </div>
      </div>
    </>
  )
}
export const CrossListInfoCard: React.FC<CrosslistInfoCardProps> = (props) => {
  return (
    <div className='p-4 card shadow-sm w-500px bg-white'>
      <div className='text-center'>
        <img alt='Logo' src={props.imgUrl} className='h-80px' />
        <div className=' p-4 flex-column'>
          {props.userInfo.map((info, index) => (
            <CrossListModalInfo key={index} {...info} />
          ))}
        </div>
      </div>
    </div>
  )
}

const TableRow: React.FC<TransactionTableRowProps> = (props) => {
  return (
    <tr className='text-center'>
      <td>
        <p className='text-dark fw-bolder d-block mb-1 fs-6 '>
          {formatMoney(Number(props.field1))}
        </p>
      </td>
      <td>
        <p className='text-dark fw-bolder d-block mb-1 fs-6'>{props.field2}</p>
      </td>
      <td>
        <p className='text-dark fw-bolder d-block mb-1 fs-6'>{props.field3}</p>
      </td>
    </tr>
  )
}
const ReportTableHead: React.FC<{}> = () => {
  return (
    <>
      {/* begin::Table head */}
      <thead>
        <tr className='fw-bolder text-muted bg-light justify-context-center'>
          <th className='rounded-start text-center '>VALOR</th>
          <th className='text-center'>DATA</th>
          <th className='text-center'>TIPO</th>
        </tr>
      </thead>
      {/* end::Table head */}
    </>
  )
}

const StatusImportTableRow: React.FC<
  DataCrossDetailsShow & {
    setSelectedNoticeParams: (notices: NoticeParams) => void
    setIsNotifiyng: (number: number) => void
    onDocumentPressed: () => void
  }
> = (props) => {
  const [showList, setShoeList] = useState(false)
  const [listIsLoading, setListIsLoading] = useState(false)
  const openClose = () => {
    setShoeList(!showList)
  }
  return (
    <>
      <tr className='text-center'>
        <td>
          {showList ? (
            <span
              onClick={openClose}
              className='svg-icon toggle-on svg-icon-primary svg-icon-2 cursor-pointer'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
              >
                <path
                  d='M11.4343 12.7344L7.25 8.55005C6.83579 8.13583 6.16421 8.13584 5.75 8.55005C5.33579 8.96426 5.33579 9.63583 5.75 10.05L11.2929 15.5929C11.6834 15.9835 12.3166 15.9835 12.7071 15.5929L18.25 10.05C18.6642 9.63584 18.6642 8.96426 18.25 8.55005C17.8358 8.13584 17.1642 8.13584 16.75 8.55005L12.5657 12.7344C12.2533 13.0468 11.7467 13.0468 11.4343 12.7344Z'
                  fill='black'
                ></path>
              </svg>
            </span>
          ) : (
            <span onClick={openClose} className='svg-icon svg-icon-2 cursor-pointer'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
              >
                <path
                  d='M12.6343 12.5657L8.45001 16.75C8.0358 17.1642 8.0358 17.8358 8.45001 18.25C8.86423 18.6642 9.5358 18.6642 9.95001 18.25L15.4929 12.7071C15.8834 12.3166 15.8834 11.6834 15.4929 11.2929L9.95001 5.75C9.5358 5.33579 8.86423 5.33579 8.45001 5.75C8.0358 6.16421 8.0358 6.83579 8.45001 7.25L12.6343 11.4343C12.9467 11.7467 12.9467 12.2533 12.6343 12.5657Z'
                  fill='black'
                ></path>
              </svg>
            </span>
          )}
        </td>
        <td>
          <a
            href='#'
            onClick={(e) => {
              e.preventDefault()
              props.onDocumentPressed()
            }}
          >
            <div className='d-flex justify-content-between'>
              <span className='text-black fw-bolder cursor-pointer'>
                {formatCnpj(props.document)}{' '}
              </span>
            </div>
          </a>
        </td>
        <td>
          {props.referente.length > 8 ? (
            <span className='text-black  d-block'>
              {props.referente.slice(0, 7)} <br></br> a {props.referente.slice(9, 17)}
            </span>
          ) : (
            <span className='text-black  d-block'>{props.referente.slice(0, 7)} </span>
          )}
        </td>
        <td>
          <span className='text-black  d-block'>{formatMoney(Number(props.transacionado))}</span>
        </td>
        <td>
          <span className='text-black  d-block'>{formatMoney(Number(props.valorDeclarado))}</span>
        </td>
        <td>
          <span className='text-black fw-bolder d-block'>
            {formatMoney(Number(props.diferenca))}
          </span>
        </td>
        <td>
          <span className='text-black  d-block'>
            {formatMoney(Number(props.valorTaxaInformada))} - {props.taxaInformada}%
          </span>
        </td>
        <td>
          <span className='text-black  d-block'>
            {formatMoney(Number(props.valorTaxaMedia))} - {props.taxaMedia}%
          </span>
        </td>
        <td className='text-end'>
          <button
            disabled={!props.operatorIsRegistered}
            className='btn btn-warning btn-sm'
            onClick={() => {
              props.setIsNotifiyng(1)
              props.setSelectedNoticeParams({
                divergencies: props.transactions.map((t) => t.id),
                taxaInformada: props.taxaInformada,
                taxaMedia: props.taxaMedia,
                valorTaxaInformada: props.valorTaxaInformada,
                valorTaxaMedia: props.valorTaxaMedia,
              })
            }}
          >
            Notificar
          </button>
        </td>
        <td className='text-end'>
          <button
            disabled={!props.operatorIsRegistered}
            className='btn btn-danger btn-sm '
            onClick={() => {
              props.setIsNotifiyng(2)
              props.setSelectedNoticeParams({
                divergencies: props.transactions.map((t) => t.id),
                taxaInformada: props.taxaInformada,
                taxaMedia: props.taxaMedia,
                valorTaxaInformada: props.taxaInformada,
                valorTaxaMedia: props.valorTaxaMedia,
              })
            }}
          >
            Autuar
          </button>
        </td>
      </tr>
      {showList &&
        props.transactions.map((t, index) => (
          <tr className='text-center' key={index}>
            <td></td>
            <td></td>
            <td>
              <span className='text-black  d-block'>{t.referente}</span>
            </td>
            <td>
              <span className='text-black  d-block'>{formatMoney(Number(t.transacionado))}</span>
            </td>
            <td>
              <span className='text-black  d-block'>{formatMoney(Number(t.valorDeclarado))}</span>
            </td>
            <td>
              <span className='text-black fw-bolder d-block'>
                {formatMoney(Number(t.diferenca))}
              </span>
            </td>
            <td>
              <span className='text-black  d-block'>
                {formatMoney(Number(t.valorTaxaInformada))} - {t.taxaInformada}%
              </span>
            </td>
            <td>
              <span className='text-black  d-block'>
                {formatMoney(Number(t.valorTaxaMedia))} - {t.taxaMedia}%
              </span>
            </td>
          </tr>
        ))}
    </>
  )
}

const TableView: React.FC<TableViewProps> = ({dataCrossId}) => {
  //TODO: Make API call
  const [dataCrossResults, setDataCrossResults] = useState<DataCrossResult[]>([])
  const [isLoadingCrossResult, setIsLoadingCrossResult] = useState(false)
  const crossDetailsShow = getShowCrossDetails(dataCrossResults)
  const [show, setShow] = useState(false)
  const [document, setDocument] = useState<string | null>(null)
  const {id} = useParams<{id: string}>()
  const [isNotifiyng, setIsNotifiyng] = useState(0)
  const [selectedNoticeParams, setSelectedNoticeParams] = useState<NoticeParams | null>(null)

  useEffect(() => {
    getCardOperatorDataCrossingResults(id).then((res) => {
      const rawData: any[] = res.data.data
      setDataCrossResults(
        rawData.map((r) => ({
          document: r.operatorDocument,
          referente: getMonthandYear(r.date),
          id: r.subOperationId,
          taxaInformada: r.declaredRate,
          taxaMedia: r.averageRate,
          transacionado: r.amount,
          valorTaxaInformada: r.amountOnDeclaredRate,
          valorTaxaMedia: r.amountOnAverageRate,
          valorDeclarado: r.declaredTransactedValue,
          diferenca: r.declaredAndAverageDivergence,
          operatorIsRegistered: r.operatorIsRegistered,
        }))
      )
    })
  }, [id])
  const filterConfig = useFilter([
    {
      label: 'CNPJ',
      value: 'document',
      type: 'text',
    },
    {
      label: 'Divergência',
      value: 'divergence',
      type: 'select',
      options: [
        {label: 'Com divergência', value: 'true'},
        {label: 'Sem divergência', value: 'false'},
      ],
    },
  ])
  const results =
    crossDetailsShow?.filter((item) => {
      if (filterConfig.selectedOption?.value === 'document') {
        return item.document.includes(filterConfig.searchText)
      } else if (filterConfig.selectedOption?.value === 'divergence') {
        if (filterConfig.searchText === 'true') {
          return Number(item.diferenca ?? 0) > 0
        } else if (filterConfig.searchText === 'false') {
          return Number(item.diferenca ?? 0) <= 0
        }
      }
      return true
    }) ?? []
  return (
    <>
      {isNotifiyng == 0 && (
        <div className={`card`}>
          <div className='card-body p-5'>
            {/* begin::Table container */}
            <div className='table-responsive'>
              {/* begin::Table */}
              <div className='card-header border-0 p-0 pb-5 align-items-center'>
                <BackButton />
                <CustomSearchFilter {...filterConfig} />
              </div>
              {isLoadingCrossResult ? (
                <IsLoadingList />
              ) : (
                <div>
                  {results.length > 0 ? (
                    <table className='table align-middle gs-0 gy-4'>
                      <ImportsTableHead />
                      {/* begin::Table body */}
                      <tbody>
                        {results.map((detail, index) => (
                          <StatusImportTableRow
                            setIsNotifiyng={setIsNotifiyng}
                            key={index}
                            {...detail}
                            onDocumentPressed={() => {
                              setDocument(detail.document)
                              setShow(true)
                            }}
                            setSelectedNoticeParams={(args) => {
                              setSelectedNoticeParams(args)
                            }}
                          />
                        ))}
                      </tbody>
                      {/* end::Table body */}
                    </table>
                  ) : (
                    <div className='card-body d-flex flex-column justify-content-center rounded ms-4  text-center w-100'>
                      <p className='fw-bolder fs-6'>
                        O cruzamento selecionado não apresenta divergências.
                      </p>

                      <img
                        alt='Logo'
                        src={toAbsoluteUrl('/media/illustrations/custom/emptySheet.svg')}
                        className='img-fluid mh-250px'
                      />
                    </div>
                  )}
                </div>
              )}

              {/* end::Table */}
            </div>
            {/* end::Table container */}
          </div>
          {/* begin::Body */}
        </div>
      )}
      {isNotifiyng === 1 && (
        <AuditorNotification
          isLoading={false}
          noticeType={NoticeType.Notice}
          noticeParams={selectedNoticeParams}
          setIsNotifiyng={setIsNotifiyng}
        ></AuditorNotification>
      )}
      {isNotifiyng === 2 && (
        <AuditorNotification
          isLoading={false}
          noticeType={NoticeType.Warning}
          noticeParams={selectedNoticeParams}
          setIsNotifiyng={setIsNotifiyng}
        ></AuditorNotification>
      )}
      <TransactionsModal
        dataCrossId={id}
        operatorDocument={document}
        show={show}
        onClose={() => setShow(false)}
      />
    </>
  )
}

function TransactionsModal({
  show,
  onClose,
  operatorDocument,
  dataCrossId,
}: {
  show: boolean
  onClose: () => void
  operatorDocument: string | null
  dataCrossId: string
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [transactions, setTransactions] = useState<TransactionTableRowProps[]>([])
  const [selectedPage, setSelectedPage] = useState(1)
  const [itemsLength, setItemsLength] = useState(0)
  useEffect(() => {
    if (show && operatorDocument) {
      setIsLoading(true)
      getCardOperatorTransactions(operatorDocument, dataCrossId, selectedPage).then((res) => {
        setIsLoading(false)
        setTransactions(
          res.data?.map((user: any) => ({
            field1: user.amount,
            field2: ` ${getDate(user.date)} `,
            field3: user.transactionType,
            onUserSelected: () => {},
          })) || []
        )
        setItemsLength(res.metadata?.dataSize || 0)
      })
    }
  }, [show, operatorDocument, selectedPage, dataCrossId])

  return (
    <ModeloModal
      title='Detalhes'
      show={show}
      onHide={onClose}
      size='lg'
      body={
        <>
          {isLoading ? (
            <div className='card-body d-flex flex-column justify-content-center rounded ms-4  text-center w-100 h-450px'>
              <div className='d-flex flex-row justify-content-center'>
                <span className='ms-2 spinner-border spinner-border-sm w-50px h-50px'></span>
              </div>
            </div>
          ) : (
            <div className=' modal-content bg-light w-100'>
              <div className='pb-10 d-flex flex-row justify-content-around'>
                {transactions.length > 0 ? (
                  <div className='d-flex flex-column'>
                    <table className='table gs-0 gy-4 w-100'>
                      <ReportTableHead />
                      {/* begin::Table body */}
                      <tbody>
                        {transactions.map((transaction, index) => (
                          <TableRow key={index} {...transaction} />
                        ))}
                      </tbody>
                      {/* end::Table body */}
                    </table>
                    <TablePagination
                      arrayLength={itemsLength}
                      selectedPage={selectedPage}
                      onSelectedPageChanged={(page) => setSelectedPage(page)}
                      maxPageItens={10}
                    />
                  </div>
                ) : (
                  <EmptyStateList />
                )}
              </div>
            </div>
          )}
        </>
      }
    />
  )
}

export default function CardOperatorReport() {
  const {id} = useParams<{id: string}>()
  return (
    <>
      <TableView dataCrossId={id} />
    </>
  )
}
