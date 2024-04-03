import {Modal} from 'react-bootstrap-v5'
import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {KTSVG, toAbsoluteUrl} from '../../../../../_metronic/helpers'
import {CustomButton} from '../../../../components/CustomButton/CustomButton'
import {TablePagination} from '../../../auth/components/TablePagination'
import {DatepickerInput} from '../../../auth/components/DatePicker'
import {createCrossing} from '../../../../services/CrossingsApi'
import {spreadText} from '../../../../utils/functions'
import {getEntries, ImportType} from '../../../../services/ImportsApi'
type CrossTableCardRowProps = {
  arquivo: string
  nota: string
  tipo: string
  notas: string
}
type CrossTableCardProps = {
  props: CrossTableCardRowProps[]
}

const CrossTableCard: React.FC<CrossTableCardProps> = (props) => {
  return (
    <table className='table align-middle gs-0 gy-4'>
      <CrossTableHead />
      <tbody>
        {props.props.map((info, index) => (
          <CrossTableCardRow key={index} {...info} />
        ))}
      </tbody>
    </table>
  )
}
const CrossTableCardRow: React.FC<CrossTableCardRowProps> = (props) => {
  return (
    <tr className='text-center'>
      <td className='ps-5'>
        <p className='fw-bolder d-block mb-1 fs-6'>{spreadText(props.arquivo, 11)}</p>
      </td>
      <td>
        <p className='fw-bolder d-block mb-1 fs-6'>{props.nota}</p>
      </td>
      <td>
        <p className='text-muted fw-bolder d-block mb-1 fs-6'>{props.tipo}</p>
      </td>
      <td>
        <p className='text-danger fw-bolder d-block mb-1 fs-6'>{props.notas}</p>
      </td>
    </tr>
  )
}
const CrossTableHead: React.FC<{}> = () => {
  return (
    <>
      {/* begin::Table head */}
      <thead>
        <tr className='fw-bolder text-muted bg-light justify-context-center'>
          <th className='rounded-start text-center'>Arquivo</th>
          <th className='text-center'>Nota</th>
          <th className='text-center'>Tipo</th>
          <th className='text-center text-end rounded-end'>Notas/Transações no período</th>
        </tr>
      </thead>
      {/* end::Table head */}
    </>
  )
}

type ImportFileCrossing = {
  id: string
  arquivo: string
  nota: string
  tipo: string
  notas: string
  data: string
}

function BuildingCardOperatorDetails({}) {
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [importFiles, setImportFiles] = useState<ImportFileCrossing[]>([])
  const [selectedPage, setSelectedPage] = useState(1)
  const [importFilesLength, setImportFilesLength] = useState(0)
  const [createLoading, setCreateLoading] = useState(false)
  const [showCreatedModal, setShowCreatedModal] = useState(false)

  useEffect(() => {
    getEntries(selectedPage, 4, startDate, endDate).then((res) => {
      setImportFiles(
        res.data.map(
          (item: any): ImportFileCrossing => ({
            id: item.id,
            arquivo: item.file,
            nota: item.type === ImportType.Invoice ? 'Fiscal' : 'Transacional',
            // TODO: Map type
            tipo: 'Simplificado',
            notas: item.total,
            data: item.data,
          })
        )
      )
      setImportFilesLength(res.metadata.dataSize)
    })
  }, [startDate, endDate, selectedPage])

  const createNewCrossing = () => {
    setCreateLoading(true)
    createCrossing(startDate, endDate).then((c) => {
      setCreateLoading(false)
      setShowCreatedModal(true)
    })
  }
  const handleCloseModal = () => {
    setShowCreatedModal(false)
  }
  return (
    <>
      <div className={`card`}>
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bolder fs-3 mb-1'>Cruzamentos por período</span>
          </h3>
        </div>
        <div className='card-body d-flex flex-row justify-content-center'>
          <div className='card-body d-flex flex-column justify-content-center shadow rounded bg-light me-4 w-50 text-center'>
            <p className='fw-bolder fs-3'>Selecione o período</p>

            <div className='card-body d-flex flex-row justify-content-around   '>
              <div className='d-flex flex-column justify-content-center text-center'>
                <p className='fw-bolder fs-5'>Data Inicial</p>
                <DatepickerInput changeDate={setStartDate} />
              </div>
              <div className='d-flex flex-column justify-content-center text-center'>
                <p className='fw-bolder fs-5'>Data Final</p>

                <DatepickerInput changeDate={setEndDate} />
              </div>
            </div>
            <div className='p-10 d-flex flex-row justify-content-around'>
              <CustomButton
                isLoading={createLoading}
                onSubmit={createNewCrossing}
                label={'Salvar'}
              />
            </div>
          </div>
          {importFiles.length ? (
            <div className='card-body d-flex flex-column justify-content-center  shadow rounded bg-light ms-4 w-50 text-center'>
              <p className='fw-bolder fs-3'>Arquivos referentes ao período</p>
              {/* TODO: Pagination */}
              <CrossTableCard props={importFiles} />
              {importFiles.length > 0 && (
                <TablePagination
                  onSelectedPageChanged={setSelectedPage}
                  selectedPage={selectedPage}
                  arrayLength={importFilesLength}
                  maxPageItens={4}
                ></TablePagination>
              )}
            </div>
          ) : (
            <div className='card-body d-flex flex-column justify-content-center  shadow rounded bg-light ms-4 w-50 text-center'>
              <p className='fw-bolder fs-3'>Não existem relatórios para o período selecionado</p>
              <p className=' fs-7 text-muted'>
                Você pode fazer a{' '}
                <Link to='/auditor/importacao/nova-importacao'>
                  <strong className='text-primary'>importação</strong>{' '}
                </Link>{' '}
                dos arquivos ou mudar o período selecionado
              </p>

              <img
                alt='Logo'
                src={toAbsoluteUrl('/media/illustrations/custom/emptySheet.svg')}
                className='img-fluid mh-200px'
              />
            </div>
          )}
        </div>
      </div>
      <Modal show={showCreatedModal} onHide={handleCloseModal}>
        <Modal.Header>
          <h4>Cruzamento realizado</h4>
          <div
            className='btn btn-icon btn-sm btn-active-light-primary ms-2'
            onClick={handleCloseModal}
            aria-label='Close'
          >
            <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className='d-flex alert alert-primary'>
            <KTSVG
              path='/media/icons/duotune/\communication/com009.svg'
              className='svg-icon svg-icon-2hx svg-icon-primary me-3'
            />
            <div className='d-flex flex-column'>
              <span className='text-dark'>
                Cruzamento de dados efetuados com sucesso. Você pode acessar os cruzamentos em:
                <Link to={'/auditor/cruzamentos/lista-cruzamentos'}>
                  <div data-bs-dismiss='modal' aria-label='Close'>
                    Cruzamentos/Lista de Cruzamentos
                  </div>
                </Link>
              </span>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default function CardOperatorDetails() {
  return <BuildingCardOperatorDetails />
}
