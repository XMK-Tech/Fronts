import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import {FormError} from '../../../components/FormError'
import {KTSVG, toAbsoluteUrl} from '../../../_metronic/helpers'
import {CustomButton} from '../../components/CustomButton/CustomButton'
import {ImportType, createImport} from '../../services/ImportsApi'
import {AttachmentDropZone} from '../../utils/components/DropZoneUp'
import ModeloModal from '../../utils/components/ModeloModal'

export default function AuditorImportsPage() {
  const [invoicesFile, setInvoicesFile] = useState<string | null>(null)
  const [transactionsFile, setTransactionsFile] = useState<string | null>(null)
  const [showModalConsolidated, setShowModalConsolidated] = useState(false)
  const [showModalSimplified, setShowModalSimplified] = useState(false)
  const [isSimplified, setIsSimplified] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<{message: any} | null>(null)

  const importFile = async (attachmentId: string, type: ImportType) => {
    setIsLoading(true)
    setError(null)
    try {
      await createImport({
        type,
        attachmentId,
        isSimplified: isSimplified,
      })
    } catch (err) {
      setError({message: err})
      setShowModalConsolidated(false)
      setShowModalSimplified(false)
      if (isSimplified) {
        return setIsSimplified(false)
      } else {
        return
      }
    } finally {
      setIsLoading(false)
    }

    const setter = type === ImportType.Invoice ? setInvoicesFile : setTransactionsFile
    setter(null)
    !isSimplified && setShowModalConsolidated(true)
    isSimplified && setShowModalSimplified(true)
  }

  const onStatusChange = (type: ImportType, attachmentId: string) => {
    const setter = type === ImportType.Invoice ? setInvoicesFile : setTransactionsFile
    setter(attachmentId)
  }

  const handleCloseModalConsolidated = () => setShowModalConsolidated(false)
  const handleCloseModalSimplified = () => setShowModalSimplified(false)

  return (
    <>
      <div className='card shadow-sm'>
        <div className='card-header'>
          <h3 className='card-title'>Importação de Documentos</h3>
        </div>
        <div className='card-body d-flex justify-content-around'>
          <div className='d-flex flex-column'>
            <AttachmentDropZone
              acceptArchive={isSimplified ? '.csv' : ''}
              title='Importação de Notas Fiscais e Declaração Mensais'
              onSubmit={(_fileWithMeta, attachmentId) =>
                onStatusChange(ImportType.Invoice, attachmentId)
              }
            />
            <div className='d-flex flex-column'>
              <div className='d-flex flex-row justify-content-center'>
                <label className='mt-13 form-check form-switch form-check-custom form-check-solid'>
                  <input
                    onChange={() => {
                      setIsSimplified(!isSimplified)
                    }}
                    className='form-check-input w-30px h-20px'
                    type='checkbox'
                    value='1'
                    checked={isSimplified}
                  />
                  <strong className='form-check-label fs-7'>
                    {isSimplified ? 'SIMPLIFICADO' : 'CONSOLIDADO'}
                  </strong>
                </label>
              </div>
              {isSimplified ? (
                <div className='d-flex flex-row justify-content-center mt-5 '>
                  <span className='fs-8 w-200px text-center text-muted'>
                    Você precisa inserir um arquivo do tipo csv simplificado
                    <br />
                    <a
                      href={toAbsoluteUrl('/samples/modeloImportacaoSimplificada.csv')}
                      target='_blank'
                    >
                      Baixar modelo do arquivo
                    </a>
                  </span>
                </div>
              ) : (
                <div className='d-flex flex-row justify-content-center mt-5 '>
                  <span className='fs-8 w-200px text-center text-muted'>
                    Você pode inserir o arquivo no formato fornecido pelo seu sistema de gestão.
                    <br />
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className='d-flex flex-column'>
            <AttachmentDropZone
              acceptArchive={'.csv'}
              title={'Importação de Arquivos da Receita Estadual'}
              onSubmit={(_fileWithMeta, attachmentId) =>
                onStatusChange(ImportType.Transactions, attachmentId)
              }
            />
            <div className='d-flex flex-row justify-content-center mt-5 '>
              <span className='fs-8 w-200px text-center text-muted'>
                Você precisa inserir um arquivo do tipo txt. outros tipos não serão aceitos
                <br />
              </span>
            </div>
          </div>
        </div>
        <div className='card-footer d-flex justify-content-center'>
          <FormError status={error} />
          <CustomButton
            label='Confirmar'
            isLoading={isLoading}
            disabled={isLoading}
            onSubmit={() => {
              if (invoicesFile) {
                importFile(invoicesFile, ImportType.Invoice)
              }
              if (transactionsFile) {
                importFile(transactionsFile, ImportType.Transactions)
              }
            }}
          />
        </div>
      </div>
      <ModeloModal
        title={'Importação em processamento'}
        show={isSimplified ? showModalSimplified : showModalConsolidated}
        onHide={isSimplified ? handleCloseModalSimplified : handleCloseModalConsolidated}
        body={
          <div className='d-flex alert alert-primary'>
            <KTSVG
              path='/media/icons/duotune/\communication/com009.svg'
              className='svg-icon svg-icon-2hx svg-icon-primary me-3'
            />
            {!isSimplified ? (
              <div className='d-flex flex-column'>
                <span className='text-dark'>
                  A sua importação está na fila de processamento, com o tempo estimado de 48:00 hrs.
                  Você pode acompanhar o status dessa importação em:
                  <Link to={'/auditor/importacao/status-importacao'}>
                    <div data-bs-dismiss='modal' aria-label='Close'>
                      Importação/status das importações
                    </div>
                  </Link>
                  .
                </span>
              </div>
            ) : (
              <div className='d-flex flex-column'>
                <span className='text-dark'>
                  A sua importação está na fila de processamento, Você pode acompanhar o status
                  dessa importação em:
                  <Link to={'/auditor/importacao/status-importacao'}>
                    <div data-bs-dismiss='modal' aria-label='Close'>
                      Importação/status das importações
                    </div>
                  </Link>
                  .
                </span>
              </div>
            )}
          </div>
        }
      />
    </>
  )
}
