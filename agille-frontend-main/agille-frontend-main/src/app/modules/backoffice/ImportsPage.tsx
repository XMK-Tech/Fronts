import React, {useEffect, useState} from 'react'
import {Modal} from 'react-bootstrap-v5'
import {toAbsoluteUrl, KTSVG} from '../../../_metronic/helpers'
import Table, {TablePropsRows} from '../../components/Table/Table'
import {mapContent} from '../../components/Table/TableHead'
import {TableRowProps} from '../../components/Table/TableRow'
import {
  approveImport,
  getImports,
  notifyImportFileDownloaded,
  rejectImport,
  uploadManualFile,
} from '../../services/ImportsApi'
import DetailsModal from '../../utils/components/DetailsModal'
import DownloadArea from '../../utils/components/DownloadArea'
import {AttachmentDropZone} from '../../utils/components/DropZoneUp'
import EmptyStateList from '../../utils/components/EmptyStateList'
import IsLoadingList from '../../utils/components/IsLoadingList'
import ModeloModal from '../../utils/components/ModeloModal'
import {pageLimit} from '../../utils/constants'
import {getDate, spreadText} from '../../utils/functions'
import {
  AdminSearchFilter,
  CustomSearchFilter,
  useFilter,
} from '../auth/components/AdminSearchFilter'
import {TablePagination} from '../auth/components/TablePagination'

type ValidateModalSelectedProps = {
  selected: number
  footer?: React.ReactNode
}
type ImportsInfoCardProps = {
  imgUrl: string
  userInfo: ImportsModalInfoProps[]
}
type ImportsModalInfoProps = {
  item: string
  description: string
  status: ImportStatus
}
type ImportsTableRowProps = {
  id: string
  documento: string
  status: ImportStatus
  data: string
  responsavel: string
  url: string
  manualUrl: string
  reason: string
  onOpenModalClicked: () => void
  onOpenModal: () => void
  onDownloadClicked: () => void
  onUploadClicked: () => void
  changeSelectedDocumentModalProps: (status: string, label?: string) => void
}
type SelectedValidateModalProps = {
  selected: number
  footer?: React.ReactNode
  file: {id: string; url: string; manualUrl: string} | null
  onChecked: () => void
  checked: boolean
  reason: string
  setReason: (value: string) => void
}
type ValidadeModalBodyProps = {
  footer?: React.ReactNode
}
type WizardButtonProps = {
  selected: number
  onNext: () => void
  onPrevious: () => void
  onSubmit: () => void
  onSave?: boolean
}

export enum ImportApiStatus {
  WaitingForDownload,
  Typing,
  WaitingForValidation,
  ApprovedByValidator,
  RejectedByValidator,
  Processing,
  Done,
  DeniedForDuplicity,
  WaitingForReplacementValidation,
  ApprovedReplacement,
  Replaced,
}

export function getStatus(apiStatus: ImportApiStatus): ImportStatus {
  switch (apiStatus) {
    case ImportApiStatus.WaitingForDownload:
      return 'AGUARDANDO DOWNLOAD'
    case ImportApiStatus.Typing:
      return 'EM DIGITAÇÃO'
    case ImportApiStatus.WaitingForValidation:
      return 'AGUARDANDO VALIDAÇÃO'
    case ImportApiStatus.ApprovedByValidator:
      return 'APROVADO PELO VALIDADOR'
    case ImportApiStatus.RejectedByValidator:
      return 'RECUSADO PELO VALIDADOR'
    case ImportApiStatus.Done:
      return 'CONCLUÍDO'
  }
  return 'AGUARDANDO DOWNLOAD'
}
export type ImportStatus =
  | 'AGUARDANDO DOWNLOAD'
  | 'EM DIGITAÇÃO'
  | 'AGUARDANDO VALIDAÇÃO'
  | 'CONCLUÍDO'
  | 'APROVADO PELO VALIDADOR'
  | 'RECUSADO PELO VALIDADOR'

function getColorByStatus(status: ImportStatus): string | undefined {
  if (status == 'AGUARDANDO DOWNLOAD') {
    return 'badge-light-dark'
  }
  if (status == 'EM DIGITAÇÃO') {
    return 'badge-light-warning'
  }
  if (status == 'AGUARDANDO VALIDAÇÃO') {
    return 'badge-light-info'
  }
  if (status == 'CONCLUÍDO') {
    return 'badge-light-success'
  }
  if (status == 'APROVADO PELO VALIDADOR') {
    return 'badge-light-primary'
  } else {
    return 'badge-light-danger'
  }
}

const ImportsPageTable: React.FC<{imports: ImportsTableRowProps[]}> = (props) => {
  const rows: TableRowProps[] = props.imports.map((item) => {
    const colorClassName = getColorByStatus(item.status)
    const validateButton =
      item.status == 'AGUARDANDO VALIDAÇÃO'
        ? {
            content: 'Validar',
            className: 'btn-warning  mx-2',
            buttonAction: () => {
              item.onOpenModalClicked()
            },
          }
        : {
            content: 'Validar',
            className: 'btn-light-dark disabled mx-2',
            buttonAction: () => {},
          }
    return {
      columns: mapContent([
        <div
          onClick={() => {
            item.changeSelectedDocumentModalProps(
              item.status,
              item.status === 'RECUSADO PELO VALIDADOR' ? item.reason : undefined
            )
            item.onOpenModal()
          }}
          className='btn btn-color-primary position-relative fs-8 fw-bolder '
        >
          <div className='d-flex'>
            {item.status === 'RECUSADO PELO VALIDADOR' ? (
              <span className='position-absolute translate-middle badge badge-circle badge-danger'>
                !
              </span>
            ) : (
              ''
            )}
            <span className='w-150px'>{spreadText(item.documento, 15)}</span>
          </div>
        </div>,
        <span className={`mw-150px text-wrap badge ${colorClassName} fw-bolder`}>
          {item.status}
        </span>,
        <span className='text-dark fw-bolder d-block '>{item.data}</span>,
        item.status == 'AGUARDANDO DOWNLOAD' ? (
          <img
            className='logo-sticky h-35px'
            alt='Logo'
            src={toAbsoluteUrl('/media/illustrations/custom/backOfficeModule.png')}
          />
        ) : (
          <img
            className='logo-sticky h-35px'
            alt='Logo'
            src={toAbsoluteUrl('/media/illustrations/custom/defaultAvatar.svg')}
          />
        ),
      ]),
      detailsColumn: [
        {
          content: 'Download',
          className: 'btn-primary mx-2',
          buttonAction: () => {
            item.onDownloadClicked()
          },
        },
        {
          content: 'Upload',
          className: 'btn-success mx-2',
          buttonAction: () => {
            item.onUploadClicked()
          },
        },
        validateButton,
      ],
    }
  })
  return (
    <Table
      headColumns={mapContent(['DOCUMENTO', 'STATUS', 'DATA', 'RESPONSAVEL', 'AÇÕES'])}
      rows={rows}
    />
  )
}

type ImportsTableProps = {
  onValidateClicked: (data: {id: string; url: string; manualUrl: string}) => void
  onValidateClicked2: () => void
  onDownloadClicked: (data: {id: string; url: string}) => void
  onUploadClicked: (data: {id: string}) => void
  imports: Omit<ImportsTableRowProps, 'onOpenModalClicked' | 'onOpenModal'>[]
  changeImports: (items: any[]) => void
  setSelectedPage: (page: number) => void
  selectedPage: number
  importsLenght: number
  changeSelectedDocumentModalProps: (status: string, label?: string) => void
  listIsLoading: boolean
  filterConfig: any
}
const ImportsTable: React.FC<ImportsTableProps> = (props) => {
  let imports = props.imports.map((importFile, index) => {
    return {
      ...importFile,
      onDownloadClicked() {
        props.onDownloadClicked({id: importFile.id, url: importFile.url})
      },
      onOpenModalClicked() {
        props.onValidateClicked({
          id: importFile.id,
          manualUrl: importFile.manualUrl,
          url: importFile.url,
        })
      },
      changeSelectedDocumentModalProps() {
        props.changeSelectedDocumentModalProps(
          importFile.status,
          importFile.status === 'RECUSADO PELO VALIDADOR' ? importFile.reason : undefined
        )
      },
      onOpenModal() {
        props.onValidateClicked2()
      },
      onUploadClicked() {
        props.onUploadClicked({id: importFile.id})
      },
    }
  })
  return (
    <>
      <div className={`card`}>
        <div className='card-body p-5'>
          <div className='card-header border-0 pt-5'>
            <h3 className='card-title align-items-start flex-column'>
              <span className='card-label fw-bolder fs-3 mb-1'>Importações</span>
            </h3>
            <div>
              <CustomSearchFilter {...props.filterConfig} />
            </div>
          </div>
          {props.listIsLoading ? (
            <IsLoadingList />
          ) : (
            <div className='table-responsive h-450px'>
              {props.imports.length > 0 ? (
                <ImportsPageTable imports={imports} />
              ) : (
                <EmptyStateList />
              )}
            </div>
          )}
        </div>
        {/* begin::Body */}
        <TablePagination
          onSelectedPageChanged={props.setSelectedPage}
          selectedPage={props.selectedPage}
          arrayLength={props.importsLenght}
          maxPageItens={pageLimit}
        ></TablePagination>
      </div>
    </>
  )
}
const ValidadeModalBody: React.FC<ValidadeModalBodyProps> = (props) => {
  return (
    <form>
      <div className='p-4'>
        <div className='d-flex flex-row justify-content-center'>{props.children}</div>
      </div>

      {!!props.footer && props.footer}
    </form>
  )
}
const ValidateCardSelected: React.FC<SelectedValidateModalProps> = ({
  checked,
  onChecked,
  selected,
  footer,
  file,
  reason,
  setReason,
}) => {
  return (
    <ValidadeModalBody footer={footer}>
      <Steps
        reason={reason}
        setReason={setReason}
        onChecked={onChecked}
        checked={checked}
        file={file}
        selected={selected}
      />
    </ValidadeModalBody>
  )
}
const Steps: React.FC<{
  selected: number
  file: {id: string; url: string; manualUrl: string} | null
  onChecked: () => void
  checked: boolean
  reason: string
  setReason: (value: string) => void
}> = ({selected, file, onChecked, checked, reason, setReason}) => {
  if (selected === 1) {
    return (
      <>
        <div className='d-flex flex-column '>
          <DownloadArea url={file?.url || ''} title={'Download Arquivo Original'}></DownloadArea>
          <DownloadArea
            url={file?.manualUrl || ''}
            title={'Download Arquivo Editado'}
          ></DownloadArea>
        </div>
      </>
    )
  }
  if (selected === 2) {
    return (
      <>
        <div className='col'>
          <div className='row m-4 w-270px'>
            <label className=' d-flex  btn btn-outline btn-outline-dashed btn-outline-primary btn-active-light-primary text-start p-6'>
              <span className='form-check form-check-custom form-check-solid form-check-sm align-items-start mt-1'>
                <input
                  checked={checked}
                  onChange={onChecked}
                  className='form-check-input'
                  type='radio'
                  name='usage'
                ></input>
              </span>
              <span className='ms-5 w-300px'>
                <span className='fs-4 fw-bolder mb-1 d-block'>Aprovar edição</span>
                <span className='fw-bold fs-7 text-gray-600'>Documento Editado</span>
              </span>
            </label>
          </div>

          <div className='row m-4 w-270px'>
            <label className='d-flex btn btn-outline btn-outline-dashed btn-outline-danger btn-active-light-danger text-start p-6'>
              <span className='form-check form-check-custom form-check-solid form-check-sm align-items-start mt-1'>
                <input
                  onChange={onChecked}
                  className='form-check-input'
                  type='radio'
                  name='usage'
                ></input>
              </span>
              <span className='ms-5'>
                <span className='fs-4 fw-bolder mb-1 d-block'>Recusar edição</span>
                <span className='fw-bold fs-7 text-gray-600'>Documento Editado</span>
              </span>
            </label>
          </div>
        </div>
      </>
    )
  }
  if (selected === 3) {
    return (
      <>
        {checked ? (
          <div className='flex-row'>
            <h3 className='text-success text-center mb-10'>Edição Aprovada!</h3>
            <div>
              <label className='form-label tex-secondary text-center'>
                a edição do documento foi aprovado com sucesso, para finalizar o processo clique no
                botão de validar
              </label>
            </div>
          </div>
        ) : (
          <div className='flex-row'>
            <h3 className='text-danger text-center mb-10'>Reprovando edição</h3>
            <div>
              <label className='form-label'>Motivo da reprovação</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className='form-control w-400px h-150px'
                data-kt-autosize='true'
              ></textarea>
            </div>
          </div>
        )}
      </>
    )
  }
  return null
}

const ValidateForm = (props: {
  onClose: () => void
  file: {id: string; url: string; manualUrl: string} | null
}) => {
  const [formNumber, setFormNumber] = useState<number>(1)
  const [reason, setReason] = useState<string>('')
  const [checked, setChecked] = useState(true)
  const onChecked = () => {
    setChecked(!checked)
  }
  function nextForm(): void {
    setFormNumber((prev) => prev + 1)
  }
  function previousForm(): void {
    setFormNumber((prev) => prev - 1)
  }

  const approve = () => {
    if (!props.file?.id) return
    approveImport(props.file?.id).then(() => {
      props.onClose()
    })
  }

  const reprove = () => {
    if (!props.file?.id) return
    rejectImport(props.file?.id, reason).then(() => {
      props.onClose()
    })
  }

  return (
    <>
      <div className='mt-4'>
        <StepSelected selected={formNumber} />
      </div>
      <div className='modal-body'>
        <ValidateCardSelected
          checked={checked}
          onChecked={onChecked}
          file={props.file}
          reason={reason}
          setReason={setReason}
          footer={
            <div className='d-flex justify-content-center'>
              <div className='w-400px p-10 d-flex flex-row justify-content-around'>
                <StepButtons
                  selected={formNumber}
                  onPrevious={previousForm}
                  onNext={nextForm}
                  onSubmit={() => {
                    if (checked) {
                      approve()
                    } else {
                      reprove()
                    }
                    props.onClose()
                  }}
                />
              </div>
            </div>
          }
          selected={formNumber}
        />
      </div>
    </>
  )
}

const StepButtons: React.FC<WizardButtonProps> = ({selected, onNext, onPrevious, onSubmit}) => {
  if (selected === 1) {
    return (
      <>
        <button onClick={onNext} type='button' className='btn btn-sm btn-primary'>
          Próximo
        </button>
      </>
    )
  }
  if (selected === 2) {
    return (
      <>
        <button onClick={onPrevious} type='button' className='btn btn-sm btn-light-primary'>
          Anterior
        </button>
        <button onClick={onNext} type='button' autoFocus className='btn btn-sm btn-primary'>
          Próximo
        </button>
      </>
    )
  }
  if (selected === 3) {
    return (
      <button onClick={onSubmit} type='button' className='btn btn-sm btn-primary' autoFocus>
        Validar
      </button>
    )
  }

  return <></>
}

const StepSelected: React.FC<ValidateModalSelectedProps> = ({selected}) => {
  const activeStepStyle =
    'px-4 card-label fw-bolder fs-6 mb-1 border-bottom border-primary text-primary'
  const disabledStepStyle = 'px-4 card-label fw-bolder fs-6 mb-1 '

  return (
    <div className=' d-flex flex-row justify-content-center'>
      <span className={selected === 1 ? activeStepStyle : disabledStepStyle}>Download</span>
      <span className={selected === 2 ? activeStepStyle : disabledStepStyle}>Aprovação</span>
      <span className={selected === 3 ? activeStepStyle : disabledStepStyle}>Validação</span>
    </div>
  )
}
const ValidationModal: React.FC<{
  visible: boolean
  onVisibleChanged: (value: boolean) => void
  file: {id: string; url: string; manualUrl: string} | null
}> = ({onVisibleChanged, visible, file}) => {
  const handleClose = () => onVisibleChanged(false)

  return (
    <Modal show={visible} onHide={handleClose}>
      <div className='modal-content'>
        <Modal.Header>
          <span className='fw-bolder fs-3 '>Validação de Importação</span>
          <div
            className='btn btn-icon btn-sm btn-active-light-primary ms-2'
            aria-label='Close'
            onClick={handleClose}
          >
            <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
          </div>
        </Modal.Header>
        <ValidateForm file={file} onClose={handleClose} />
      </div>
    </Modal>
  )
}
export default function ImportsPage() {
  const [imports, setImports] = useState<
    Omit<ImportsTableRowProps, 'onOpenModalClicked' | 'onOpenModal'>[]
  >([])
  const [importsLenght, setImportsLenght] = useState<number>(0)
  const [listIsLoading, setListIsLoading] = useState(true)

  const [selectedPage, setSelectedPage] = useState<number>(1)

  const filterConfig = useFilter([
    {
      options: [
        {value: 'WaitingForDownload', label: 'Aguardando download'},
        {value: 'Typing', label: 'Em digitação'},
        {value: 'WaitingForValidation', label: 'Aguardando validação'},
        {value: 'ApprovedByValidator', label: 'Aprovado pelo validador'},
        {value: 'RejectedByValidator', label: 'Recusado pelo validador'},
        {value: 'Done', label: 'Concluído'},
      ],
      label: 'Status',
      value: 'Status',
      type: 'select',
    },
  ])

  function fetchImports() {
    setListIsLoading(true)

    getImports(
      selectedPage,
      pageLimit,
      filterConfig.searchText,
      filterConfig.selectedOption.value
    ).then((imports) => {
      setImports(
        imports.data.map((importItem: any) => ({
          documento: importItem?.attachment?.displayName,
          status: getStatus(importItem.status),
          data: getDate(importItem.createdAt),
          responsavel: 'CRISTIANO RONALDO',
          id: importItem.id,
          url: importItem.attachment?.url,
          manualUrl: importItem.manualFile?.url,
          reason: importItem.reason,
        }))
      )
      setImportsLenght(imports.metadata.dataSize)
      setListIsLoading(false)
    })
  }

  useEffect(() => {
    fetchImports()
  }, [selectedPage, filterConfig.selectedOption.value, filterConfig.searchText])
  const [downloadingFile, setDownloadingFile] = useState<{id: string; url: string} | null>(null)
  const [uploadingFile, setUploadingFile] = useState<{id: string} | null>(null)
  const [validatingFile, setValidatingFile] = useState<{
    id: string
    url: string
    manualUrl: string
  } | null | null>(null)
  const [uploadAttachmentId, setUploadAttachmentId] = useState<string | null>(null)
  const showDownloadModal = !!downloadingFile
  const handleDownloadModalClose = () => setDownloadingFile(null)
  const [show, setShow] = useState(false)
  const Close = () => setShow(false)
  const Show = () => setShow(true)
  const handleUploadModalClose = () => setUploadingFile(null)
  const showUploadModal = !!uploadingFile
  const download = () => {
    if (!downloadingFile) return
    notifyImportFileDownloaded(downloadingFile.id).then(() => {
      handleDownloadModalClose()
      fetchImports()
    })
  }
  const upload = () => {
    if (!uploadingFile || !uploadAttachmentId) return
    uploadManualFile(uploadingFile.id, uploadAttachmentId).then(() => {
      handleUploadModalClose()
      fetchImports()
    })
  }
  const validationModalVisible = !!validatingFile
  const setValidationModalVisible = (value: boolean) => {
    if (!value) {
      setValidatingFile(null)
      fetchImports()
    }
  }
  const changeImports = (items: any[]) => {
    setImports(items)
  }
  const documentModalProps = {
    aguardandoDownload: {
      title: 'Aguardando Download',
      color: 'dark',
      label:
        'Ainda não foi feito o download  nem a importação do arquivo! Faça o Download para iniciar o processo .',
    },
    emDigitacao: {
      title: 'Em digitação',
      color: 'warning',
      label:
        'Ainda não foi feita a importação desse documento! Termine o processo de digitação para poder realizar a importarção.',
    },
    aguardandoValidacao: {
      title: 'Aguardando Validação',
      color: 'info',
      label:
        'Foi realizada a importação do documento digitato! Agora está na fila de espera do resultado',
    },
    concluido: {
      title: 'Concluído',
      color: 'success',
      label: 'Sua importação foi concluída com sucesso!',
    },
    aprovado: {
      title: 'Aprovado pelo Validador',
      color: 'primary',
      label:
        'Sua importação foi aprovada com sucesso! Agora está na fila de espera para término de conclusão',
    },
    recusado: {
      title: 'Recusado pelo Validador',
      color: 'danger',
      label: 'Texto de recusado pelo validador',
    },
  }

  const [selectedDocumentModalProps, setSelectedDocumentModalProps] = useState(
    documentModalProps.aguardandoDownload
  )
  function changeSelectedDocumentModalProps(status: string, label?: string) {
    if (status == 'AGUARDANDO DOWNLOAD')
      setSelectedDocumentModalProps(documentModalProps.aguardandoDownload)
    if (status == 'EM DIGITAÇÃO') setSelectedDocumentModalProps(documentModalProps.emDigitacao)
    if (status == 'AGUARDANDO VALIDAÇÃO')
      setSelectedDocumentModalProps(documentModalProps.aguardandoValidacao)
    if (status == 'CONCLUÍDO') setSelectedDocumentModalProps(documentModalProps.concluido)
    if (status == 'APROVADO PELO VALIDADOR')
      setSelectedDocumentModalProps(documentModalProps.aprovado)
    if (status == 'RECUSADO PELO VALIDADOR')
      setSelectedDocumentModalProps({
        title: documentModalProps.recusado.title,
        color: documentModalProps.recusado.color,
        label: label ? label : '',
      })
  }
  return (
    <>
      <ImportsTable
        filterConfig={filterConfig}
        listIsLoading={listIsLoading}
        imports={imports}
        onValidateClicked={(file) => {
          setValidatingFile(file)
        }}
        onDownloadClicked={(file) => {
          setDownloadingFile(file)
        }}
        onValidateClicked2={() => {
          setShow(true)
        }}
        onUploadClicked={(file) => {
          setUploadingFile(file)
        }}
        setSelectedPage={setSelectedPage}
        changeImports={changeImports}
        importsLenght={importsLenght}
        selectedPage={selectedPage}
        changeSelectedDocumentModalProps={changeSelectedDocumentModalProps}
      />
      <ModeloModal
        title={'Download de arquivo'}
        show={showDownloadModal}
        onHide={handleDownloadModalClose}
        body={
          <div className='d-flex flex-column align-items-center'>
            <h3>Você Realmente Deseja Fazer Download?</h3>
            <p className='pb-3 pt-5 text-muted text-wrap text-center mw-350px'>
              Se você fizer o Download, se tornará o <b>responsável</b> pelo lançamento do
              documento.
            </p>
          </div>
        }
        footer={
          <div>
            <button onClick={handleDownloadModalClose} type='button' className='btn btn-light'>
              Cancelar
            </button>
            <a
              href={downloadingFile?.url}
              target='_blank'
              onClick={download}
              className='btn btn-primary'
            >
              Confirmar
            </a>
          </div>
        }
      />

      <ModeloModal
        show={showUploadModal}
        onHide={handleUploadModalClose}
        title='Upload de Arquivo'
        body={
          <AttachmentDropZone
            title={'Insira o arquivo'}
            onSubmit={(_file, atId) => {
              setUploadAttachmentId(atId)
            }}
          ></AttachmentDropZone>
        }
        footer={
          <>
            <button
              onClick={handleUploadModalClose}
              type='button'
              className='btn btn-light'
              data-bs-dismiss='modal'
            >
              Cancelar
            </button>
            <button
              onClick={upload}
              type='button'
              className='btn btn-primary'
              data-bs-dismiss='modal'
            >
              Confirmar
            </button>
          </>
        }
      />
      <ModeloModal
        title={'Status da importação'}
        body={
          <DetailsModal
            corStatus={selectedDocumentModalProps.color}
            label={selectedDocumentModalProps.label}
            title={selectedDocumentModalProps.title}
          />
        }
        footer={
          <>
            <button className='btn btn-sm btn-primary' onClick={Close}>
              OK
            </button>
          </>
        }
        show={show}
        onHide={Close}
      ></ModeloModal>
      <ValidationModal
        file={validatingFile}
        visible={validationModalVisible}
        onVisibleChanged={setValidationModalVisible}
      />
    </>
  )
}
