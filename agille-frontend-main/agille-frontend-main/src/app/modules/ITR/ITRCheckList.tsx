import React, {useEffect, useState} from 'react'
import DropZoneModel from '../../../components/DropZoneModel'
import {CustomButton} from '../../components/CustomButton/CustomButton'
import Table from '../../components/Table/Table'
import {mapContent} from '../../components/Table/TableHead'
import {
  ChecklistAttachment,
  CheckListType,
  getChecklist,
  updateCheckList,
} from '../../services/CheckListApi'
import ModeloModal, {ModalErrorFooter} from '../../utils/components/ModeloModal'
import {formatDate} from '../../utils/functions'
import CheckListModel from './Components/CheckLIstModel'
import InfoModel from './Components/InfoModel'

export default function ITRCheckList() {
  const [checkList, setCheckList] = useState<CheckListType[]>([])
  const [loading, setLoading] = useState(false)

  function refreshList() {
    return getChecklist().then((res) => {
      setCheckList(res.data)
    })
  }

  useEffect(() => {
    refreshList()
  }, [])

  const [checkedItens, setCheckedItens] = useState<boolean[]>([])
  const [showModalCheck, setShowModalCheck] = useState(false)
  const [showModalInfo, setShowModalInfo] = useState(false)
  const [editId, setEditId] = useState('')
  const [attachmentIds, setAttachmentIds] = useState<string[]>([])
  const [selectedJustification, setSelectedJustification] = useState<string>('')
  const [selectedAttachments, setSelectedAttachments] = useState<ChecklistAttachment[]>([])
  const [error, setError] = useState<{message: any} | null>(null)
  const listCheck = checkList.map((e) => ({
    label: e.text,
    info: formatDate(e.lastUpdateAt),
    status: e.status,
  }))

  const editCheckList = async (id: string) => {
    setLoading(true)
    try {
      await updateCheckList(id, {
        attachments: attachmentIds,
      })
    } catch (err) {
      setError({
        message: err,
      })
    }
    setLoading(false)
    setShowModalCheck(false)
    refreshList()
  }
  const files = selectedAttachments.map((e) => ({
    columns: mapContent([
      e.displayName,
      <CustomButton
        margin={'0'}
        onSubmit={() => {}}
        label='Download'
        isLoading={false}
        href={e.url}
      />,
    ]),
  }))
  return (
    <div className='card card-body'>
      <div className='modal-header'>
        <div className='w-100 modal-title h4'>Documentos do convênio</div>
      </div>
      <div>
        <CheckListModel
          onInfoClick={(index) => {
            setSelectedAttachments(checkList[index].attachments)
            setSelectedJustification(checkList[index].justification)
            setShowModalInfo(true)
          }}
          onItemClick={(index) => {
            setEditId(checkList[index].id)
            setShowModalCheck(true)
          }}
          data={listCheck}
          checkedsItems={checkedItens}
          onCheckedChange={(checked, i) => {
            const newList = [...checkedItens]
            newList[i] = checked
            setCheckedItens(newList)
          }}
        />
      </div>
      <ModeloModal
        size='xl'
        body={
          <div className={`card w-100`}>
            <div className='card-header border-0 pt-5'>
              <h3 className='card-title align-items-start flex-column'>
                <span className='card-label fw-bolder fs-3 mb-1'>Arquivos</span>
              </h3>
            </div>
            <div className='d-flex'>
              <DropZoneModel
                onUploaded={(ids) => {
                  setAttachmentIds(ids)
                }}
                title='Upload de Arquivos'
              />
            </div>
          </div>
        }
        title={'Upload de arquivos'}
        onHide={() => setShowModalCheck(!showModalCheck)}
        show={showModalCheck}
        footer={
          <ModalErrorFooter
            error={error}
            modalFooter={
              <CustomButton
                label='Salvar'
                onSubmit={() => editCheckList(editId)}
                isLoading={loading}
                disabled={loading}
              />
            }
          />
        }
      ></ModeloModal>
      <ModeloModal
        body={
          <div>
            {!!selectedJustification && (
              <InfoModel
                message={selectedJustification}
                title='Recusado'
                infoColor='danger'
              ></InfoModel>
            )}

            <Table headColumns={mapContent(['Arquivo', 'Download'])} rows={files}></Table>
          </div>
        }
        title={'Detalhes'}
        onHide={() => setShowModalInfo(!showModalInfo)}
        show={showModalInfo}
      ></ModeloModal>
    </div>
  )
}
