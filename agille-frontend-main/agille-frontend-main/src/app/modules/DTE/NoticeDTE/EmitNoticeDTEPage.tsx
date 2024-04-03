import {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import Table, {TablePropsRows} from '../../../components/Table/Table'
import {mapContent} from '../../../components/Table/TableHead'
import {TableRowProps} from '../../../components/Table/TableRow'
import {
  downloadNoticePreview,
  getNoticeTemplatesByType,
  getNoticeToText,
  NoticeType,
} from '../../../services/NoticeApi'
import EmptyStateList from '../../../utils/components/EmptyStateList'
import IsLoadingList from '../../../utils/components/IsLoadingList'
import {TablePagination} from '../../auth/components/TablePagination'
import {ModalEmit} from './NoticeDTEPage'

const EmitTable: React.FC<TablePropsRows> = (props) => {
  return <Table headColumns={mapContent(['NOME', 'TIPO', 'AÇÕES'])} rows={props.rows} />
}

export default function ConsultModelDTEPage() {
  const [emitLength, setEmitLength] = useState<number>(0)
  const [selectedPage, setSelectedPage] = useState<number>(1)
  const [emitTemplate, setEmitTemplate] = useState<TableRowProps[]>([])
  const [listIsLoading, setListIsLoading] = useState(false)
  const type = useParams<{type: string}>()
  const title = getNoticeToText(Number(type.type), true)
  const [selectedNotice, setSelectedNotice] = useState<any[]>([])
  const [showModal, setShowModal] = useState<boolean>(false)
  function onSelectedPageChanged(page: number) {
    setSelectedPage(page)
  }
  useEffect(() => {
    setListIsLoading(true)
    getNoticeTemplatesByType('2', type.type, selectedPage).then((response) => {
      setEmitTemplate(response.data)
      setEmitLength(response.metadata.dataSize)
      setListIsLoading(false)
    })
  }, [selectedPage])
  const emitTemplateList = emitTemplate.map(
    (model: any): TableRowProps => ({
      columns: mapContent([
        model.name,
        <span
          className={`${
            model.type == NoticeType.Notice ? 'text-warning' : 'text-danger'
          } fw-bolder d-block`}
        >
          {getNoticeToText(model.type, true)}
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
          content: 'Emitir',
          className: 'btn-primary',
          buttonAction: () => {
            setSelectedNotice(model)
            setShowModal(true)
          },
        },
      ],
    })
  )
  return (
    <>
      <ModalEmit
        title={title}
        noticeParams={selectedNotice}
        showModal={showModal}
        type={Number(type.type)}
        onHide={() => setShowModal(false)}
      />
      <div className='card'>
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bolder fs-3 mb-1'>Modelos {title}</span>
          </h3>
        </div>
        {listIsLoading ? (
          <IsLoadingList />
        ) : (
          <div className='card-body py-3'>
            {emitTemplate.length > 0 ? (
              <div className='table-responsive w-100'>
                <EmitTable rows={emitTemplateList} />
              </div>
            ) : (
              <EmptyStateList />
            )}
          </div>
        )}
        {emitTemplate.length > 0 && (
          <TablePagination
            onSelectedPageChanged={onSelectedPageChanged}
            selectedPage={selectedPage}
            arrayLength={emitLength}
            maxPageItens={6}
          ></TablePagination>
        )}
      </div>
    </>
  )
}
