import {abort} from 'process'
import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {KTSVG, toAbsoluteUrl} from '../../../_metronic/helpers'
import Table, {TablePropsRows} from '../../components/Table/Table'
import {mapContent} from '../../components/Table/TableHead'
import {TableRowProps} from '../../components/Table/TableRow'
import {getDataCrossing, getDataCrossingResults} from '../../services/DataCrossingApi'
import {getData, getFakeItemsByInterval} from '../../services/FakeApiData'
import {NoticeType} from '../../services/NoticeApi'
import EmptyStateList from '../../utils/components/EmptyStateList'
import IsLoadingList from '../../utils/components/IsLoadingList'
import {getDate, getMonthandYear} from '../../utils/functions'
import {AdminSearchFilter} from '../auth/components/AdminSearchFilter'
import {TablePagination} from '../auth/components/TablePagination'
import AuditorNotification from './AuditorNotification'
import CrossListDetails, {DataCrossResult, DataCrossResults} from './CrossListDetails'

const CrossListTable: React.FC<TablePropsRows> = (props) => {
  return (
    <Table
      headColumns={mapContent(['RESPONSÁVEL', 'STATUS', 'REFERÊNCIA', 'NOTIFICAÇÃO', 'DETALHES'])}
      rows={props.rows}
    />
  )
}

export type StatusImportTableRowProps = {
  id: string
  Responsavel: string
  status: ImportStatus
  referencia: string
  divergencias: number
  showDetails: (id: string) => void
}

type ImportStatus = 'AGUARDANDO IMPORTAÇÃO' | 'CONCLUÍDO' | 'EM PROCESAMENTO' | 'ERRO'
function getColorByStatus(status: ImportStatus): string | undefined {
  if (status == 'CONCLUÍDO') {
    return 'badge-light-success'
  }
  if (status == 'EM PROCESAMENTO') {
    return 'badge-light-warning'
  }
  if (status == 'ERRO') {
    return 'badge-light-danger'
  } else {
    return 'badge-light-dark'
  }
}

type ImportNotification = 'AGUARDANDO IMPORTAÇÃO' | 'CONCLUÍDO' | 'EM PROCESAMENTO' | 'ERRO'
function getStatus(statusNumber: number) {
  if (statusNumber == 0) return 'AGUARDANDO IMPORTAÇÃO'
  if (statusNumber == 1) return 'CONCLUÍDO'
  if (statusNumber == 2) return 'ERRO'
  if (statusNumber == 3) return 'EM PROCESAMENTO'
  else return 'ERRO'
}
function getColorByNotification(status: ImportNotification): string | undefined {
  if (status != 'CONCLUÍDO') {
    return 'bg-light-danger border-danger text-danger'
  } else {
    return 'bg-light-dark border-dark text-dark'
  }
}
function getColorByDivergency(divergencyCount: number): string {
  if (divergencyCount == 0) {
    return 'bg-light-dark border-dark text-dark'
  } else {
    return 'bg-light-danger border-danger text-danger'
  }
}
function getDivergencyLabel(divergencyCount: number): string {
  if (divergencyCount == 0) {
    return 'Não há divergências'
  } else {
    return `${divergencyCount} Divergências`
  }
}
export const StatusImportTableRow: React.FC<StatusImportTableRowProps> = (props) => {
  const colorClassName = getColorByStatus(props.status)
  const colorClassNameNotification = getColorByNotification(props.status)
  const colorClassDivergency = getColorByDivergency(props.divergencias)
  return (
    <tr className='text-center'>
      <td>
        <span className='text-dark fw-bolder d-block fs-6 '>{props.Responsavel}</span>
      </td>
      <td>
        <span className={`mw-150px text-wrap badge ${colorClassName} fw-bolder`}>
          {props.status}
        </span>
      </td>
      <td>
        <span className='text-dark fw-bolder d-block'>{props.referencia}</span>
      </td>
      <td>
        <div
          className={`'mb-0 m-0 alert alert-dismissible ${colorClassDivergency} border-dashed  d-flex flex-column flex-sm-row p-1 justify-content-center`}
        >
          <div className='justify-content-center align-items-center d-flex  pe-0'>
            <span className={`fs-7 fw-bolder d-block ${colorClassDivergency}`}>
              {getDivergencyLabel(props.divergencias)}
            </span>
          </div>
        </div>
      </td>

      <td className='text-end'>
        <Link to='/auditor/cruzamentos/lista-cruzamentos/detalhes'>
          <button
            className='btn btn-primary btn-sm '
            onClick={() => {
              props.showDetails(props.id)
            }}
          >
            Detalhes
          </button>
        </Link>
      </td>
    </tr>
  )
}
export const UserTableCrossList: React.FC<{}> = () => {
  const [crossDetails, setCrossDetails] = useState<number>(0)
  const [selectedPage, setSelectedPage] = useState<number>(1)
  const [items, setItems] = useState<any[]>(getData('/api/v1/cross-list'))
  const [crossDataResults, setCrossDataResults] = useState<DataCrossResults>({results: []})
  const [dataCrossing, setDataCrossing] = useState<TableRowProps[]>([])
  const [dataCrossingLenght, setDataCrossingLenght] = useState<number>(0)
  const [listIsLoading, setListIsLoading] = useState(true)
  const [dataCrossId, setDataCrossId] = useState<string | null>(null)
  const [selectedDivergencies, setSelectedDivergencies] = useState<string[]>([])
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('')
  function onSelectedPageChanged(page: number) {
    setSelectedPage(page)
  }
  const showCrossListDetails = (id: string) => {
    setDataCrossId(id)
    setListIsLoading(true)
    getDataCrossingResults(id)
    setCrossDetails(1)
    getDataCrossingResults(id).then((results) => {
      setCrossDataResults({
        results: results.data.map(
          (result: any): DataCrossResult => ({
            isCompanyRegistered: result.isCompanyRegistered,
            document: result.companyDocument,
            referente: getMonthandYear(result.referenceDate),
            emitido: result.invoiceAmount,
            transacionado: result.transactionAmount,
            divergente: result.difference,
            id: result.id,
            companyId: result.companyId,
          })
        ),
      })
      setListIsLoading(false)
    })
  }
  useEffect(() => {
    setListIsLoading(true)
    getDataCrossing(selectedPage).then((dataCrossing) => {
      setDataCrossing(
        dataCrossing.data.map((dataCross: any): TableRowProps => {
          const status = getStatus(dataCross.status)
          const colorClassName = getColorByStatus(status)
          const colorClassNameNotification = getColorByNotification(status)
          const colorClassDivergency = getColorByDivergency(dataCross.divergencyCount)
          return {
            columns: mapContent([
              <span className='text-dark fw-bolder d-block fs-6 '>
                {dataCross.responsibleName}
              </span>,
              <span className={`mw-150px text-wrap badge ${colorClassName} fw-bolder`}>
                {status}
              </span>,
              <span className='text-dark fw-bolder d-block'>
                {`${getMonthandYear(dataCross.startingReference)} - ${getMonthandYear(
                  dataCross.endingReference
                )}`}
              </span>,
              <div
                className={`'mb-0 m-0 alert alert-dismissible ${colorClassDivergency} border-dashed  d-flex flex-column flex-sm-row p-1 justify-content-center`}
              >
                <div className='justify-content-center align-items-center d-flex  pe-0'>
                  <span className={`fs-7 fw-bolder d-block ${colorClassDivergency}`}>
                    {getDivergencyLabel(dataCross.divergencyCount)}
                  </span>
                </div>
              </div>,
            ]),
            detailsColumn: [
              {
                content: 'Detalhes',
                className: 'btn-primary',
                buttonAction: () => {
                  showCrossListDetails(dataCross.id)
                },
              },
            ],
          }
        })
      )
      setDataCrossingLenght(dataCrossing.metadata.dataSize)
      setListIsLoading(false)
    })
  }, [selectedPage, items])
  const options = [
    {value: 'Responsavel', label: 'Responsável'},
    {value: 'status', label: 'Status'},
    {value: 'referencia', label: 'Referência'},
    {value: 'notificacao', label: 'Notificação'},
  ]
  return (
    <>
      {crossDetails == 0 && (
        <div className={`card`}>
          <div className='card-header border-0 pt-5'>
            <h3 className='card-title align-items-start flex-column'>
              <span className='card-label fw-bolder fs-3 mb-1'>Cruzamentos</span>
            </h3>
            <AdminSearchFilter
              options={options}
              path='/api/v1/cross-list'
              search={setItems}
              setPage={setSelectedPage}
            ></AdminSearchFilter>
          </div>
          {listIsLoading ? (
            <IsLoadingList />
          ) : (
            <div className='card-body p-5'>
              {/* begin::Table container */}
              {dataCrossing.length > 0 ? (
                <div className='table-responsive'>
                  {/* begin::Table */}
                  <CrossListTable rows={dataCrossing} />
                  {/* end::Table */}
                </div>
              ) : (
                <EmptyStateList />
              )}
              {/* end::Table container */}
            </div>
          )}
          {dataCrossing.length > 0 && (
            <TablePagination
              onSelectedPageChanged={onSelectedPageChanged}
              selectedPage={selectedPage}
              arrayLength={dataCrossingLenght}
              maxPageItens={6}
            ></TablePagination>
          )}
        </div>
      )}
      {crossDetails === 1 && (
        <CrossListDetails
          dataCrossId={dataCrossId}
          isLoading={listIsLoading}
          setCrossDetails={setCrossDetails}
          crossDetails={crossDetails}
          dataCrossResults={crossDataResults}
          onDivergenciesSelected={(value, companyId) => {
            setSelectedDivergencies(value)
            setSelectedCompanyId(companyId)
          }}
        ></CrossListDetails>
      )}
      {crossDetails === 3 && (
        <AuditorNotification
          isLoading={listIsLoading}
          noticeType={NoticeType.Notice}
          dataCrossIds={selectedDivergencies}
          selectedCompanyId={selectedCompanyId}
          setCrossDetails={setCrossDetails}
          crossDetails={crossDetails}
          dataCrossResults={crossDataResults}
        ></AuditorNotification>
      )}
      {crossDetails === 2 && (
        <AuditorNotification
          isLoading={listIsLoading}
          noticeType={NoticeType.Warning}
          dataCrossIds={selectedDivergencies}
          selectedCompanyId={selectedCompanyId}
          setCrossDetails={setCrossDetails}
          crossDetails={crossDetails}
          dataCrossResults={crossDataResults}
        ></AuditorNotification>
      )}
    </>
  )
}

export default function CrossListPage() {
  return (
    <>
      <UserTableCrossList></UserTableCrossList>
    </>
  )
}
