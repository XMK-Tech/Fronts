import React, {useState} from 'react'
import {importPersons} from '../app/services/PersonApi'
import {CustomButton} from '../app/components/CustomButton/CustomButton'
import ModeloModal from '../app/utils/components/ModeloModal'
import {AttachmentDropZone} from '../app/utils/components/DropZoneUp'
import AccordionCustom from './AccordionCustom'
import {importProprieties} from '../app/services/ProprietyApi'
import {importDeclarations} from '../app/services/DeclarationApi'

export function ImportButton(props: {
  type: 'propriety' | 'person' | 'declaration'
  refreshList?: () => void
}) {
  type DataItems = {
    errors: string[]
    line: number
  }
  function getTitle(type: string) {
    switch (type) {
      case 'person':
        return 'Importar Pessoas'
      case 'declaration':
        return 'Importar Declarações'
      case 'propriety':
      default:
        return 'Importar Propriedades'
    }
  }

  const [showModal, setShowModal] = useState(false)
  const [attachmentId, setAttachmentId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [dataItems, setDataItems] = useState<DataItems[] | null>([])
  const [unknownError, setUnknownError] = useState(false)
  const [success, setSuccess] = useState(false)
  const [fileUrl, setFileUrl] = useState('')

  async function getReturnImport() {
    if (props.type === 'propriety') {
      return await importProprieties(attachmentId)
    }
    if (props.type === 'person') {
      return await importPersons(attachmentId)
    }
    if (props.type === 'declaration') {
      return await importDeclarations(attachmentId)
    }
    return await importProprieties(attachmentId)
  }

  const doImport = async () => {
    setIsLoading(true)
    setUnknownError(false)
    try {
      const response = await getReturnImport()

      setDataItems(response.data.itens)
      setFileUrl(response.data.fileUrl)
      if (response.data.itens.length <= 0) {
        setSuccess(true)
        setUnknownError(false)
        setIsLoading(false)
      } else {
        setUnknownError(false)
        setIsLoading(false)
      }
    } catch (error) {
      setUnknownError(true)
      setIsLoading(false)
    }
  }
  return (
    <div className='py-1'>
      <CustomButton
        isLoading={false}
        label='Importar'
        onSubmit={() => {
          setShowModal(true)
          setUnknownError(false)
        }}
      />
      <ModeloModal
        title={getTitle(props.type)}
        onHide={() => {
          setShowModal(false)
        }}
        show={showModal}
        body={
          <>
            {unknownError && (
              <div className='alert alert-danger mb-8'>
                Erro ao importar. por favor tente novamente com um arquivo compativel
              </div>
            )}
            {success ? (
              <div className='d-flex fw-bolder text-center fs-1 mb-1 '>
                A sua importação foi realizada com Sucesso !
              </div>
            ) : (
              <>
                {dataItems?.length ?? 0 ? (
                  <div>
                    <span className='card-label fw-bolder fs-3 mb-1'>Lista de Erros</span>
                    <AccordionCustom title='Linha' listItems={dataItems || []}></AccordionCustom>
                  </div>
                ) : (
                  <AttachmentDropZone
                    onSubmit={(_file, attId) => {
                      setAttachmentId(attId)
                    }}
                    title={'Arraste o arquivo aqui'}
                  />
                )}
              </>
            )}
          </>
        }
        footer={
          <>
            {success ? (
              <CustomButton
                isLoading={false}
                onSubmit={() => {
                  setShowModal(false)
                  props.refreshList && props.refreshList()
                  setSuccess(false)
                }}
                label='Continuar'
              ></CustomButton>
            ) : (
              <>
                {dataItems?.length == 0 ? (
                  <CustomButton
                    isLoading={isLoading}
                    label='Iniciar importação'
                    onSubmit={doImport}
                  />
                ) : (
                  <CustomButton
                    href={fileUrl}
                    isLoading={false}
                    label='Baixar'
                    onSubmit={() => setShowModal(false)}
                  />
                )}
              </>
            )}
          </>
        }
      />
    </div>
  )
}
