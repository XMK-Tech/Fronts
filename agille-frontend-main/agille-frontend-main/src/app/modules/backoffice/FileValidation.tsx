import {useEffect, useState} from 'react'
import {CustomButton} from '../../components/CustomButton/CustomButton'
import Table from '../../components/Table/Table'
import {mapContent} from '../../components/Table/TableHead'
import {
  ChecklistAttachment,
  CheckListStatus,
  CheckListType,
  getChecklist,
  postChecklistStatus,
} from '../../services/CheckListApi'
import IsLoadingList from '../../utils/components/IsLoadingList'
import ModeloModal, {ModalErrorFooter} from '../../utils/components/ModeloModal'
import {formatDate} from '../../utils/functions'
import {CheckListStatusBadge, getStatus} from '../ITR/Components/CheckLIstModel'
import InfoModel from '../ITR/Components/InfoModel'

export default function FileValidation() {
  const [checkList, setCheckList] = useState<CheckListType[]>([])
  const [showModalAproved, setShowModalAproved] = useState(false)
  const [showModalCancel, setModalCancel] = useState(false)
  const [showModalFiles, setShowModalFiles] = useState(false)
  const [validate, setValidate] = useState(false)
  const [justification, setJustification] = useState('')
  const [selectedAttachments, setSelectedAttachments] = useState<ChecklistAttachment[]>([])
  const [selectedId, setSelectedId] = useState<any>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<{message: any} | null>(null)

  const refreshList = async () => {
    setIsLoading(true)
    try {
      await getChecklist().then((res) => {
        setCheckList(res.data)
      })
    } catch (err) {
      setError({message: err})
    }
    setIsLoading(false)
  }
  useEffect(() => {
    refreshList()
  }, [])
  const aproved = async (id: string) => {
    setIsLoading(true)
    try {
      await postChecklistStatus(id, {
        status: CheckListStatus.APROVED,
      })
    } catch (err) {}
    setIsLoading(false)
    setJustification('')
    refreshList()
  }
  const cancel = async (id: string) => {
    setIsLoading(true)
    try {
      await postChecklistStatus(id, {
        status: CheckListStatus.REJECTED,
        justification: justification,
      })
    } catch (err) {
      console.error(err)
    }
    setIsLoading(false)
    setJustification('')
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
  const checkListItems = checkList.map((e, i) => ({
    columns: mapContent([
      formatDate(e.lastUpdateAt),
      e.text,
      <CheckListStatusBadge status={e.status} />,
    ]),
    detailsColumn: [
      {
        content: 'Aprovar',
        className: 'btn-primary mx-2',
        buttonAction: () => {
          setShowModalAproved(true)
          setSelectedId(e.id)
        },
      },
      {
        content: 'Reprovar',
        className: 'btn-danger mx-2',
        buttonAction: () => {
          setModalCancel(true)

          setSelectedId(e.id)
        },
      },
      {
        content: 'Download',
        className: 'btn-success mx-2',
        buttonAction: () => {
          setShowModalFiles(true)
          setSelectedAttachments(checkList[i].attachments)
        },
      },
    ],
  }))

  return (
    <div className='card'>
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bolder fs-3 mb-1'>Validação de arquivos</span>
        </h3>
      </div>
      <div className='card-body py-3'>
        {isLoading ? (
          <IsLoadingList />
        ) : (
          <Table
            rows={checkListItems}
            headColumns={mapContent(['Data', 'Documento', 'Status', 'Ação'])}
          ></Table>
        )}
      </div>
      <ModeloModal
        title='Validação de arquivos'
        onHide={() => {
          setShowModalAproved(!showModalAproved)
          setValidate(false)
        }}
        show={showModalAproved}
        body={
          <>
            {validate ? (
              <div className='flex-row'>
                <h3 className='text-success text-center mb-10'>Validação Aprovada!</h3>
                <div>
                  <label className='form-label tex-secondary text-center'>
                    a validação dos arquivos foi aprovada com sucesso, para finalizar o processo
                    clique no botão de validar
                  </label>
                  <div className='d-flex justify-content-center mt-4'>
                    <CustomButton
                      isLoading={false}
                      label='Validar'
                      onSubmit={() => {
                        aproved(selectedId)

                        setValidate(false)
                        setShowModalAproved(!showModalAproved)
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <InfoModel
                message='Tem certeza que deseja aprovar ?'
                title='Aprovar'
                infoColor='info'
                button={[
                  {
                    label: 'Não',
                    onClick: () => setShowModalAproved(false),
                    type: 'outline',
                  },
                  {
                    label: 'Sim',
                    onClick: () => setValidate(true),
                  },
                ]}
              />
            )}
          </>
        }
        footer={<ModalErrorFooter modalFooter={<></>} error={error} />}
      ></ModeloModal>
      <ModeloModal
        title='Validação de arquivos'
        onHide={() => {
          setModalCancel(!showModalCancel)
          setValidate(false)
        }}
        show={showModalCancel}
        body={
          <>
            {validate ? (
              <div className='flex-row'>
                <h3 className='text-danger text-center mb-10'>Reprovando validação dos arquivos</h3>
                <div>
                  <label className='form-label'>Motivo da Reprovação</label>
                  <textarea
                    value={justification}
                    onChange={(e) => {
                      setJustification(e.target.value)
                    }}
                    className='form-control w-400px h-150px'
                    data-kt-autosize='true'
                  ></textarea>
                </div>
                <div className='d-flex justify-content-center mt-4'>
                  <CustomButton
                    isLoading={false}
                    label='Validar'
                    onSubmit={() => {
                      cancel(selectedId)
                      setModalCancel(!showModalCancel)
                      setValidate(false)
                    }}
                  />
                </div>
              </div>
            ) : (
              <InfoModel
                message='Tem certeza que deseja Reprovar ?'
                title='Reprovar'
                infoColor='danger'
                button={[
                  {
                    label: 'Não',
                    onClick: () => {
                      setModalCancel(false)
                    },
                    type: 'outline',
                  },
                  {
                    label: 'Sim',
                    onClick: () => {
                      setValidate(true)
                    },
                  },
                ]}
              />
            )}
          </>
        }
      ></ModeloModal>
      <ModeloModal
        title='Download de arquivos'
        onHide={() => setShowModalFiles(!showModalFiles)}
        show={showModalFiles}
        body={
          <>
            <Table headColumns={mapContent(['Arquivo', 'Download'])} rows={files}></Table>
          </>
        }
      ></ModeloModal>
    </div>
  )
}
