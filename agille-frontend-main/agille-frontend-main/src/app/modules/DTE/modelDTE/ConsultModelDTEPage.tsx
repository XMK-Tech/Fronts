import {useEffect, useState} from 'react'
import Table, {TablePropsRows} from '../../../components/Table/Table'
import {mapContent} from '../../../components/Table/TableHead'
import {TableRowProps} from '../../../components/Table/TableRow'
import {
  downloadNoticePreview,
  getNoticeColor,
  getNoticeTemplate,
  getNoticeToText,
  NoticeType,
} from '../../../services/NoticeApi'
import EmptyStateList from '../../../utils/components/EmptyStateList'
import IsLoadingList from '../../../utils/components/IsLoadingList'
import {AdminSearchFilter} from '../../auth/components/AdminSearchFilter'
import {TablePagination} from '../../auth/components/TablePagination'

const ModelTable: React.FC<TablePropsRows> = (props) => {
  return <Table headColumns={mapContent(['NOME', 'TIPO', 'AÇÕES'])} rows={props.rows} />
}

type TableViewProps = {}

export default function ConsultModelDTEPage(props: TableViewProps) {
  const [modelsLength, setModelsLength] = useState<number>(0)
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
    getNoticeTemplate('2').then((response) => {
      setNoticeTemplate(response.data)
      setModelsLength(response.metadata.dataSize)
      setListIsLoading(false)
    })
  }, [selectedPage])
  const noticeTemplateList = noticeTemplate.map(
    (model: any): TableRowProps => ({
      columns: mapContent([
        model.name,
        <span
          className={`${getNoticeColor(model.type)} fw-bolder d-block`}
        >
          {getNoticeToText(model.type)}
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
          href: '/DTE/modelos-dte/cadastro/' + model.id,
          buttonAction: () => {},
          useRouterLink: true,
        },
      ],
    })
  )
  return (
    <>
      <div className='card'>
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bolder fs-3 mb-1'>Modelos DTE</span>
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
                <ModelTable rows={noticeTemplateList} />
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
            arrayLength={modelsLength}
            maxPageItens={6}
          ></TablePagination>
        )}
      </div>
    </>
  )
}
