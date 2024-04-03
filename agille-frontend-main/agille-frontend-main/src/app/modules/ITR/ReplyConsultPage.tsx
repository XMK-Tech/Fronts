import React from 'react'
import Table from '../../components/Table/Table'
import {mapContent} from '../../components/Table/TableHead'
import {CustomSearchFilter, useFilter} from '../auth/components/AdminSearchFilter'
import {ReplyModal} from './FIscalProcedure/FiscalProcedureDetails'

export default function ReplyConsultPage() {
  const [showModalReply, setShowModalReply] = React.useState(false)
  const filterConfig = useFilter([
    {
      value: 'userName',
      label: 'Nome',
    },
  ])
  const replys = [{userName: 'teste', document: '12341254'}]
  const replyList = replys.map((e) => ({
    columns: mapContent([e.userName, e.document]),
    detailsColumn: [
      {
        content: 'Responder',
        className: 'btn-primary',
        buttonAction: () => {
          setShowModalReply(true)
        },
      },
    ],
  }))

  return (
    <div className={`card`}>
      <ReplyModal
        refreshList={() => {}}
        setPhaseId={() => {}}
        showModalReply={showModalReply}
        setShowModalReply={setShowModalReply}
      />
      <div className='card-header border-0 pt-5 pb-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bolder fs-3 mb-1'>Respostas</span>
        </h3>
        <CustomSearchFilter {...filterConfig}></CustomSearchFilter>
      </div>
      <div>
        <Table headColumns={mapContent(['Nome', 'Documento', 'Ações'])} rows={replyList}></Table>
      </div>
    </div>
  )
}
