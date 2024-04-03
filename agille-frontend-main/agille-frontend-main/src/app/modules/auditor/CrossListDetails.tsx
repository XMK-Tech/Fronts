import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {KTSVG, toAbsoluteUrl} from '../../../_metronic/helpers'
import {getJuridicalPersonsTransactions} from '../../services/JuridicalPersonApi'
import EmptyStateList from '../../utils/components/EmptyStateList'
import IsLoadingList from '../../utils/components/IsLoadingList'
import ModeloModal from '../../utils/components/ModeloModal'
import {pageLimit} from '../../utils/constants'
import {formatCnpj, formatMoney, getDate} from '../../utils/functions'
import {CustomSearchFilter, useFilter} from '../auth/components/AdminSearchFilter'
import SearchFilter from '../auth/components/SearchFilter'
import {TablePagination} from '../auth/components/TablePagination'

export type DataCrossResult = {
  isCompanyRegistered: boolean
  id: string
  document: string
  referente: string
  emitido: string
  transacionado: string
  divergente: string
  companyId: string
}
export type DataCrossDetailsShow = {
  isCompanyRegistered: boolean
  document: string
  referente: string
  emitido: string
  transacionado: string
  divergente: string
  transactions: Transaction[]
  showDetails?: () => void
  setCrossDetails?: (value: number) => void
}
export type Transaction = {
  id: string
  referente: string
  emitido: string
  transacionado: string
  divergente: string
  companyId: string
}
export type DataCrossResults = {
  results: DataCrossResult[]
}
type TableViewProps = {
  isLoading: boolean
  crossDetails?: number
  setCrossDetails: (value: number) => void
  dataCrossResults: DataCrossResults
  dataCrossId: string | null
  onDivergenciesSelected: (value: string[], companyId: string) => void
}
export type CrosslistInfoCardProps = {
  imgUrl: string
  userInfo: CrosslistModalInfoProps[]
}
export type CrosslistModalInfoProps = {
  item: string
  description: string
}
export type CrossListTableRowProps = {
  document: string
  referente: string
  emitido: string
  transacionado: string
  divergente: string
  showDetails?: () => void
}
function getInitialReferenceMonth(prevInitialMonth: string, reference: string): string {
  const prevYear = Number(prevInitialMonth.slice(4))
  const newYear = Number(reference.slice(4))

  if (newYear < prevYear) return reference

  const prevMonth = Number(prevInitialMonth.slice(0, 2))
  const newMonth = Number(reference.slice(0, 2))

  if (newMonth < prevMonth) return reference

  return prevInitialMonth
}
function getFinalReferenceMonth(prevFinalMonth: string, reference: string): string {
  const prevYear = Number(prevFinalMonth.slice(4))
  const newYear = Number(reference.slice(4))

  if (newYear > prevYear) return reference

  const prevMonth = Number(prevFinalMonth.slice(0, 2))
  const newMonth = Number(reference.slice(0, 2))

  if (newMonth > prevMonth) return reference

  return prevFinalMonth
}
function getTotalTransactionValues(
  companyCrossTransactions: Transaction[]
): Omit<Transaction, 'id'> {
  const companyId = companyCrossTransactions[0].companyId
  let initialMonth = companyCrossTransactions[0].referente
  let finalMonth = companyCrossTransactions[0].referente
  companyCrossTransactions
    .map((t) => t.referente)
    .forEach((r) => {
      initialMonth = getInitialReferenceMonth(initialMonth, r)
      finalMonth = getFinalReferenceMonth(finalMonth, r)
    })
  let referencePeriod = `${initialMonth} - ${finalMonth}`
  let totalEmitido = 0
  companyCrossTransactions
    .map((t) => t.emitido)
    .forEach((r) => {
      totalEmitido += Number(r)
    })
  let totalTransacionado = 0
  companyCrossTransactions
    .map((t) => t.transacionado)
    .forEach((r) => {
      totalTransacionado += Number(r)
    })
  let totalDivergente = 0
  companyCrossTransactions
    .map((t) => t.divergente)
    .forEach((r) => {
      totalDivergente += Number(r)
    })
  return {
    referente: referencePeriod,
    emitido: String(totalEmitido),
    transacionado: String(totalTransacionado),
    divergente: String(totalDivergente),
    companyId,
  }
}
function getCompanyCrossDetails(
  document: string,
  dataCrossResults: DataCrossResult[],
  hasRegister?: boolean
): DataCrossDetailsShow {
  const companyCrossTransactions = dataCrossResults
    .filter((r) => r.document === document)
    .map((d) => ({
      referente: d.referente,
      emitido: d.emitido,
      transacionado: d.transacionado,
      divergente: d.divergente,
      id: d.id,
      companyId: d.companyId,
    })) as Transaction[]

  const totalValues = getTotalTransactionValues(companyCrossTransactions)
  return {
    isCompanyRegistered: hasRegister ? hasRegister : false,
    document: document,
    referente: totalValues.referente,
    emitido: totalValues.emitido,
    transacionado: totalValues.transacionado,
    divergente: totalValues.divergente,
    transactions: companyCrossTransactions,
  }
}
export function getShowCrossDetails(dataCrossResults: DataCrossResult[]): DataCrossDetailsShow[] {
  const companyDocuments = dataCrossResults.map((r) => r.document)
  const distinctCompanyDocument = companyDocuments.filter(distinctValues)
  const dataCrossDetails = distinctCompanyDocument.map((d) =>
    getCompanyCrossDetails(
      d,
      dataCrossResults,
      dataCrossResults.find((r) => r.document == d)?.isCompanyRegistered
    )
  ) as DataCrossDetailsShow[]
  return dataCrossDetails
}
const ImportsTableHead: React.FC<{}> = () => {
  return (
    <>
      <thead>
        <tr className='fw-bolder text-muted bg-light justify-context-center'>
          <th className='rounded-start text-center ps-3'></th>
          <th className='text-center'>CNPJ</th>
          <th className='text-center'>REFERENTE</th>
          <th className='text-center'>VALOR EMITIDO</th>
          <th className='text-center'>VALOR TRANSACIONADO</th>
          <th className='text-center '>VALOR DIVERGENTE</th>
          <th className='text-center '></th>
          <th className='rounded-end text-center '></th>
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

const distinctValues = (value: any, index: number, self: any) => {
  return self.indexOf(value) === index
}
export const StatusImportTableRow: React.FC<
  DataCrossDetailsShow & {onNotifyPressed: () => void; onDocumentPressed: () => void}
> = (props) => {
  const [showList, setShoeList] = useState(false)
  const [listIsLoading, setListIsLoading] = useState(false)
  const openClose = () => {
    setShoeList(!showList)
  }
  const divergente = Number(props.divergente)
  return (
    <>
      {}
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
              <span className='text-dark fw-bolder w-75 cursor-pointer'>
                {formatCnpj(props.document)}{' '}
              </span>
              {!props.isCompanyRegistered ? (
                <i className='bi bi-exclamation fs-1 text-danger'></i>
              ) : (
                ''
              )}
            </div>
          </a>
        </td>
        <td>
          <span className='text-dark  d-block'>{props.referente} </span>
        </td>
        <td>
          <span className='text-success  d-block'>{formatMoney(Number(props.emitido))}</span>
        </td>
        <td>
          <span className='text-primary  d-block'>{formatMoney(Number(props.transacionado))}</span>
        </td>
        <td>
          <span
            className={`${divergente < 0 ? 'text-danger' : 'text-primary'} ${
              divergente < 0 ? 'fw-bolder' : ''
            } d-block`}
          >
            {formatMoney(divergente)}
          </span>
        </td>
        <td className='text-end'>
          <span
            className='d-inline-block'
            tabIndex={0}
            data-bs-toggle='tooltip'
            title={props.isCompanyRegistered ? '' : 'Contribuinte não cadastrado'}
          >
            <button
              disabled={!props.isCompanyRegistered}
              className='btn btn-warning btn-sm'
              onClick={() => {
                props.setCrossDetails && props.setCrossDetails(3)
                props.onNotifyPressed && props.onNotifyPressed()
              }}
            >
              Notificar
            </button>
          </span>
        </td>
        <td className='text-end'>
          <span
            className='d-inline-block'
            tabIndex={0}
            data-bs-toggle='tooltip'
            title={props.isCompanyRegistered ? '' : 'Contribuinte não cadastrado'}
          >
            <button
              disabled={!props.isCompanyRegistered}
              className='btn btn-danger btn-sm '
              onClick={() => {
                props.setCrossDetails && props.setCrossDetails(2)
                props.onNotifyPressed && props.onNotifyPressed()
              }}
            >
              Autuar
            </button>
          </span>
        </td>
      </tr>
      {showList &&
        props.transactions.map((t, index) => (
          <tr className='text-center' key={index}>
            <td></td>
            <td></td>
            <td>
              <span className='text-dark  d-block'>{t.referente}</span>
            </td>
            <td>
              <span className='text-success  d-block'>{formatMoney(Number(t.emitido))}</span>
            </td>
            <td>
              <span className='text-primary  d-block'>{formatMoney(Number(t.transacionado))}</span>
            </td>
            <td>
              <span className='text-danger  d-block'>{formatMoney(Number(t.divergente))}</span>
            </td>
            <td className='text-end'></td>
            <td className='text-end'></td>
          </tr>
        ))}
    </>
  )
}

const TableView: React.FC<TableViewProps> = ({
  setCrossDetails,
  crossDetails,
  dataCrossResults,
  onDivergenciesSelected,
  isLoading,
  dataCrossId,
}) => {
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const crossDetailsShow = getShowCrossDetails(dataCrossResults.results)
  const [transactions, setTransactions] = useState<UserTableRowProps[]>([])
  const [selectedUser, setSelectedUser] = useState<any>({})
  const [selectedPage, setSelectedPage] = useState<number>(1)
  const [listIsLoading, setListIsLoading] = useState(false)
  const [hasResgister, setHasRegister] = useState(false)
  const [show, setShow] = useState(false)
  const [itemsLength, setItemsLength] = useState<number>(0)
  const [items, setItems] = useState<any[]>([])
  const [document, setDocument] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  function onSelectedPageChanged(page: number) {
    setSelectedPage(page)
  }

  useEffect(() => {
    if (!dataCrossId || !document) return
    setListIsLoading(true)
    getJuridicalPersonsTransactions(document, dataCrossId, selectedPage, pageLimit).then(
      ({data: transactions, metadata}) => {
        setTransactions(
          transactions?.map(
            (user: any): UserTableRowProps => ({
              field1: user.amount,
              field2: ` ${getDate(user.date)} `,
              field3: user.transactionType,
              fild4: user.id,

              onUserSelected: () => {
                setSelectedUser(user)
              },
            })
          ) || []
        )
        setItemsLength(metadata?.dataSize || 0)
        setListIsLoading(false)
      }
    )
  }, [selectedPage, items, dataCrossId, document])

  const AdminTableHead: React.FC<{}> = () => {
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

  type UserTableRowProps = {
    field1: string
    field2: string
    field3: string
    fild4: string
    onUserSelected: () => void
  }

  const TransactionTableRow: React.FC<UserTableRowProps> = (props) => {
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
          return Number(item.divergente ?? 0) < 0
        } else if (filterConfig.searchText === 'false') {
          return Number(item.divergente ?? 0) >= 0
        }
      }
      return true
    }) ?? []

  return (
    <>
      <div className={`card`}>
        <div className='card-body p-5'>
          {/* begin::Table container */}
          <div className='table-responsive'>
            {/* begin::Table */}
            <div className='card-header border-0 p-0 pb-5 align-items-center'>
              <button
                className='btn btn-sm btn-light-primary h-40px'
                onClick={() => setCrossDetails(0)}
              >
                Voltar
              </button>
              <CustomSearchFilter {...filterConfig} />
            </div>
            {isLoading ? (
              <IsLoadingList />
            ) : (
              <div>
                {dataCrossResults.results.length > 0 ? (
                  <table className='table align-middle gs-0 gy-4'>
                    <ImportsTableHead />
                    {/* begin::Table body */}
                    <tbody>
                      {results?.map((detail, index) => (
                        <StatusImportTableRow
                          showDetails={() => {
                            setCrossDetails(1)
                          }}
                          key={index}
                          {...detail}
                          onNotifyPressed={() => {
                            onDivergenciesSelected(
                              detail.transactions.map((t) => t.id),
                              detail.transactions[0]?.companyId ?? ''
                            )
                          }}
                          onDocumentPressed={() => {
                            setDocument(detail.document)
                            setShow(true)
                            setHasRegister(detail.isCompanyRegistered)
                          }}
                          setCrossDetails={setCrossDetails}
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
        {/* <TablePagination></TablePagination>*/}
      </div>
      <ModeloModal
        title='Detalhes'
        show={show}
        onHide={() => setShow(false)}
        size='lg'
        body={
          <>
            {!hasResgister && (
              <div className='alert alert-dismissible bg-light-danger border border-danger border-dashed d-flex flex-column flex-sm-row w-100 p-5 mb-10'>
                <span className='svg-icon svg-icon-1hx svg-icon-danger me-4 mb-5 mb-sm-0'>
                  <KTSVG className='svg-icon-2' path='/media/icons/duotune/general/gen007.svg' />
                </span>

                <div className='d-flex flex-column pe-0 pe-sm-10'>
                  <div className='d-flex align-items-center'>
                    <span className='mb-1 fs-6 fw-bolder text-danger'>
                      <span>Contribuinte não cadastrado</span>
                    </span>
                  </div>
                  <span className='pb-3 pt-5 text-muted '>
                    Contribuinte não está cadastrado no sistema.
                  </span>
                </div>
              </div>
            )}
            {listIsLoading ? (
              <div className='card-body d-flex flex-column justify-content-center rounded ms-4  text-center w-100 h-450px'>
                <div className='d-flex flex-row justify-content-center'>
                  <span className='ms-2 spinner-border spinner-border-sm w-50px h-50px'></span>
                </div>
              </div>
            ) : (
              <div className=' modal-content bg-light w-100'>
                <div className='pb-10 d-flex flex-column justify-content-around'>
                  {transactions.length > 0 ? (
                    <>
                      <table className='table align-middle gs-0 gy-4 w-100'>
                        <AdminTableHead />
                        {/* begin::Table body */}
                        <tbody>
                          {transactions.map((transaction, index) => (
                            <TransactionTableRow key={index} {...transaction} />
                          ))}
                        </tbody>
                        {/* end::Table body */}
                      </table>
                      {!!transactions.length && (
                        <TablePagination
                          onSelectedPageChanged={onSelectedPageChanged}
                          selectedPage={selectedPage}
                          arrayLength={itemsLength}
                          maxPageItens={6}
                        ></TablePagination>
                      )}
                    </>
                  ) : (
                    <EmptyStateList />
                  )}
                </div>
              </div>
            )}
          </>
        }
        footer={
          !hasResgister && (
            <>
              <Link to={`/auditor/cadastros/cadastro-contribuintes?doc=${document}`}>
                <button className='btn btn-sm btn-primary'>Cadastrar Contribuinte</button>
              </Link>
            </>
          )
        }
      />
    </>
  )
}

export default function CrossListDetails(props: TableViewProps) {
  return (
    <>
      <TableView {...props} />
    </>
  )
}
