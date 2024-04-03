import {useEffect, useState} from 'react'
import Table, {TablePropsRows} from '../../../components/Table/Table'
import {mapContent} from '../../../components/Table/TableHead'
import {getCardOperatorDataCrossing} from '../../../services/DataCrossingApi'
import {getData} from '../../../services/FakeApiData'
import EmptyStateList from '../../../utils/components/EmptyStateList'
import IsLoadingList from '../../../utils/components/IsLoadingList'
import {pageLimit} from '../../../utils/constants'
import {getMonthandYear} from '../../../utils/functions'
import {
  AdminSearchFilter,
  CustomSearchFilter,
  useFilter,
} from '../../auth/components/AdminSearchFilter'
import {TablePagination} from '../../auth/components/TablePagination'

const CrossListTable: React.FC<TablePropsRows> = (props) => {
  return (
    <Table
      headColumns={mapContent(['RESPONSÁVEL', 'REFERÊNCIA', 'DIVERGÊNCIAS', 'STATUS', 'DETALHES'])}
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
  if (status === 'CONCLUÍDO') {
    return 'badge-light-success'
  }
  if (status === 'EM PROCESAMENTO') {
    return 'badge-light-warning'
  }
  if (status === 'ERRO') {
    return 'badge-light-danger'
  } else {
    return 'badge-light-dark'
  }
}

function getStatus(statusNumber: number) {
  if (statusNumber === 0) return 'AGUARDANDO IMPORTAÇÃO'
  if (statusNumber === 1) return 'CONCLUÍDO'
  if (statusNumber === 2) return 'ERRO'
  if (statusNumber === 3) return 'EM PROCESAMENTO'
  else return 'CONCLUÍDO'
}

export const UserTableCrossList: React.FC<{}> = () => {
  const [selectedPage, setSelectedPage] = useState<number>(1)
  const [dataCrossing, setDataCrossing] = useState<DataCrossReport[]>([])

  const filterConfig = useFilter([
    {value: 'Responsible', label: 'Responsável'},
    {
      options: [
        {value: '0', label: 'Aguardando Importação'},
        {value: '1', label: 'Concluído'},
        {value: '2', label: 'Erro'},
        {value: '3', label: 'Em Processamento'},
      ],
      label: 'Status',
      value: 'Status',
      type: 'select',
    },
    {value: 'Reference', label: 'Referência'},
  ])
  useEffect(() => {
    getCardOperatorDataCrossing(
      selectedPage,
      pageLimit,
      filterConfig.searchText,
      filterConfig.selectedOption.value
    ).then((data) => {
      setDataCrossing(data.data)
      setDataCrossingLenght(data.metadata.dataSize)
    })
  }, [selectedPage, pageLimit, filterConfig.searchText, filterConfig?.selectedOption.value])
  const [dataCrossingLenght, setDataCrossingLenght] = useState<number>(0)
  const [listIsLoading, setListIsLoading] = useState(false)
  function onSelectedPageChanged(page: number) {
    setSelectedPage(page)
  }

  return (
    <div className={`card`}>
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bolder fs-3 mb-1'>Cruzamentos</span>
        </h3>
        <CustomSearchFilter {...filterConfig} />
      </div>
      {listIsLoading ? (
        <IsLoadingList />
      ) : (
        <div className='card-body p-5'>
          {/* begin::Table container */}
          {dataCrossing.length > 0 ? (
            <div className='table-responsive'>
              {/* begin::Table */}
              <CrossListTable rows={dataCrossing.map(mapToTableProps)} />
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
  )
}

type DataCrossReport = {
  status: number
  requesterName: string
  id: string
  startingReference: string
  endingReference: string
  divergencyCount: number
}
function getDivergencyLabel(divergencyCount: number): string {
  if (divergencyCount === 0) {
    return 'Não há divergências'
  } else {
    return `${divergencyCount} Divergências`
  }
}

function getColorByDivergency(divergencyCount: number): string {
  if (divergencyCount === 0) {
    return 'bg-light-dark border-dark text-dark'
  } else {
    return 'bg-light-danger border-danger text-danger'
  }
}

function mapToTableProps(dataCross: DataCrossReport) {
  const status = getStatus(dataCross.status)
  const colorClassName = getColorByStatus(status)
  const colorClassDivergency = getColorByDivergency(dataCross.divergencyCount)

  return {
    columns: mapContent([
      <span className='text-dark fw-bolder d-block fs-6 '>{dataCross.requesterName}</span>,
      <span className='text-dark fw-bolder d-block'>
        {`${getMonthandYear(dataCross.startingReference)} - ${getMonthandYear(
          dataCross.endingReference
        )}`}
      </span>,
      <span className={`fs-7 badge fw-bolder d-block ${colorClassDivergency}`}>
        {getDivergencyLabel(dataCross.divergencyCount)}
      </span>,
      <span className={`mw-150px text-wrap badge ${colorClassName} fw-bolder`}>{status}</span>,
    ]),
    detailsColumn: [
      {
        content: 'Detalhes',
        className: 'btn-primary',
        href: `/auditor/cruzamentos/operadoras/detalhes/${dataCross.id}`,
        useRouterLink: true,
      },
    ],
  }
}

export default function CrossListPage() {
  return <UserTableCrossList></UserTableCrossList>
}
