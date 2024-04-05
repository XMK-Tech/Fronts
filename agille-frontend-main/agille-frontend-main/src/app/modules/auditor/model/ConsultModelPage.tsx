import {useEffect, useState} from 'react'
import Table, {TablePropsRows} from '../../../components/Table/Table'
import {mapContent} from '../../../components/Table/TableHead'
import {TableRowProps} from '../../../components/Table/TableRow'
import {downloadNoticePreview, getNoticeColor, getNoticeTemplate, NoticeType} from '../../../services/NoticeApi'
import EmptyStateList from '../../../utils/components/EmptyStateList'
import IsLoadingList from '../../../utils/components/IsLoadingList'
import {AdminSearchFilter} from '../../auth/components/AdminSearchFilter'
import {TablePagination} from '../../auth/components/TablePagination'

const ModelTable: React.FC<TablePropsRows> = (props) => {
  return <Table headColumns={mapContent(['NOME', 'TIPO', 'AÇÕES'])} rows={props.rows} />
}

type TableViewProps = {}

export default function NoticeListPage(props: TableViewProps) {
  const [noticesLength, setNoticesLength] = useState<number>(0)
  const [selectedPage, setSelectedPage] = useState<number>(1)
  const [noticeTemplate, setNoticeTemplate] = useState<TableRowProps[]>([])
  const [listIsLoading, setListIsLoading] = useState(false)
  function onSelectedPageChanged(page: number) {
    setSelectedPage(page)
  }
  const options = [
    {value: 'nome', label: 'Nome'},
    {value: 'CNPJ', label: 'CNPJ'},
    {value: 'Municipio', label: 'Município'},
    {value: 'Email', label: 'E-mail'},
  ]
  useEffect(() => {
    setListIsLoading(true)
    getNoticeTemplate('0').then((response) => {
      setNoticeTemplate(
        response.data.map(
          (model: any): TableRowProps => ({
            columns: mapContent([
              model.name,
              <span
                className={`${getNoticeColor(model.type)} fw-bolder d-block`}
              >
                {model.type === NoticeType.Notice ? 'Notificação' : 'Autuação'}
              </span>,
            ]),
            detailsColumn: [
              {
                content: 'Visualizar',
                className: 'btn-primary me-5',
                buttonAction: () => {
                  downloadNoticePreview(model.htmlTemplate)
                },
              },
              {
                content: 'Editar',
                className: 'btn-primary',
                href: '/auditor/cadastros/cadastro-modelo/' + model.id,
                buttonAction: () => {},
                useRouterLink: true,
              },
            ],
          })
        )
      )
      setNoticesLength(response.metadata.dataSize)
      setListIsLoading(false)
    })
  }, [selectedPage])
  return (
    <>
      <div className='card'>
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bolder fs-3 mb-1'>Modelos</span>
          </h3>
          <AdminSearchFilter
            options={options}
            search={setNoticeTemplate}
            path='/api/v1/franchise'
            setPage={setSelectedPage}
          ></AdminSearchFilter>
        </div>
        {listIsLoading ? (
          <IsLoadingList />
        ) : (
          <div className='card-body py-3'>
            {noticeTemplate.length > 0 ? (
              <div className='table-responsive w-100'>
                {/* begin::Table */}
                <ModelTable rows={noticeTemplate} />
                {/* end::Table */}
              </div>
            ) : (
              <EmptyStateList />
            )}
          </div>
        )}
        {noticeTemplate.length > 0 && (
          <TablePagination
            onSelectedPageChanged={onSelectedPageChanged}
            selectedPage={selectedPage}
            arrayLength={noticesLength}
            maxPageItens={6}
          ></TablePagination>
        )}
      </div>
    </>
  )
}
