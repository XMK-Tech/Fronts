import {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import Table, {TablePropsRows} from '../../components/Table/Table'
import {mapContent} from '../../components/Table/TableHead'
import {TableRowProps} from '../../components/Table/TableRow'
import {getNotices, getNoticeToText, NoticeType} from '../../services/NoticeApi'
import EmptyStateList from '../../utils/components/EmptyStateList'
import IsLoadingList from '../../utils/components/IsLoadingList'
import {formatCnpj, getDate} from '../../utils/functions'
import {CustomSearchFilter, useFilter} from '../auth/components/AdminSearchFilter'
import {TablePagination, usePagination} from '../auth/components/TablePagination'

const NoticeListTable: React.FC<TablePropsRows> = (props) => {
  return (
    <Table
      headColumns={mapContent([
        '#',
        'CNPJ',
        'RAZÃO SOCIAL',
        'DATA DE EMISSÃO',
        'DATA DE VENCIMENTO',
        'MODELO',
        'STATUS',
        'AÇÕES',
      ])}
      rows={props.rows}
    />
  )
}

export function WarningListPage() {
  return <NoticeList type={NoticeType.Warning} link={'/auditor/cruzamentos/autuacoes'} />
}

export function NoticeListPage() {
  return <NoticeList type={NoticeType.Notice} link={'/auditor/cruzamentos/notificacoes'} />
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  WarningListPage,
  NoticeListPage,
}

export function NoticeList(props: {type: NoticeType; link: string; emit?: boolean}) {
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
  const [notices, setNotices] = useState<TableRowProps[]>([])
  const [listIsLoading, setListIsLoading] = useState(false)
  const options = [
    {value: 'number', label: 'Número'},
    {value: 'document', label: 'CNPJ'},
    {value: 'companyName', label: 'Razão Social'},
    {value: 'name', label: 'Modelo'},
  ]
  const {selectedOption, setSelectedOption, searchText, setSearchText} = useFilter(options)
  const {pageSize, selectedPage, setSelectedPage, setSize, size} = usePagination()
  function onSelectedPageChanged(page: number) {
    setSelectedPage(page)
  }
  useEffect(() => {
    setListIsLoading(true)
    getNotices(props.type, searchText, selectedOption?.value, selectedPage).then((response) => {
      setSize(response.metadata.dataSize)
      setNotices(response.data)
      setListIsLoading(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.type, selectedPage, searchText, selectedOption])
  const noticesList = notices.map((notice: any): TableRowProps => {
    const buttons: TableRowProps['detailsColumn'] = [
      {
        content: 'Detalhes',
        className: 'btn-primary',
        buttonAction: () => {},
        // href: notice.url,
        href: `${props.link}/detalhes/${notice.id}`,
        useRouterLink: true,
      },
    ]
    return {
      columns: mapContent([
        notice.number,
        formatCnpj(notice.document),
        notice.companyName,
        getDate(notice.date),
        getDate(notice.dueDate),
        notice.name,
        <span
          className={`mw-150px text-wrap badge ${getColorByStatus(
            notice.statusDescription
          )}  fw-bolder`}
        >
          {notice.statusDescription}
        </span>,
      ]),
      detailsColumn: buttons,
    }
  })
  return (
    <>
      <div className='card'>
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bolder fs-3 mb-1'>
              {getNoticeToText(props.type, true)}
            </span>
          </h3>
          {props.emit ? (
            <Link to={`/DTE/emit/${props.type}`} className={'btn btn-primary btn-sm p-3 h-50'}>
              Emitir novas {getNoticeToText(props.type, true)}
            </Link>
          ) : null}
          <CustomSearchFilter
            onOptionSelected={(option) => setSelectedOption(option)}
            options={options}
            selectedOption={selectedOption}
            onTextChanged={(text) => setSearchText(text)}
            text={searchText}
          ></CustomSearchFilter>
        </div>
        {listIsLoading ? (
          <IsLoadingList />
        ) : (
          <div className='card-body py-3'>
            {notices.length > 0 ? (
              <div className='table-responsive w-100'>
                {/* begin::Table */}
                <NoticeListTable rows={noticesList} />
                {/* end::Table */}
              </div>
            ) : (
              <EmptyStateList />
            )}
          </div>
        )}
        {notices.length > 0 && (
          <TablePagination
            onSelectedPageChanged={onSelectedPageChanged}
            selectedPage={selectedPage}
            arrayLength={size}
            maxPageItens={pageSize}
          ></TablePagination>
        )}
      </div>
    </>
  )
}
