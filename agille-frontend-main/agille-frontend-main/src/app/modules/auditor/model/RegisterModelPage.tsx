/* eslint-disable react/jsx-no-target-blank */
import AccordionModel from '../../../utils/AccordionModel'
import React, {useEffect, useState} from 'react'
import {Modal} from 'react-bootstrap-v5'
import {Link, useHistory, useParams} from 'react-router-dom'
import {
  createNoticeTemplate,
  downloadNoticePreview,
  editNoticeTemplate,
  getNoticeTemplateDetaisl,
  getNoticeToText,
  NoticeType,
} from '../../../services/NoticeApi'
import {RichEditor} from '../../../components/RichEditor/RichEditor'
import {CustomButton} from '../../../components/CustomButton/CustomButton'
import {FormError} from '../../../../components/FormError'

function getTypeNumber(isNotification: boolean) {
  if (isNotification) {
    return NoticeType.Notice
  } else {
    return NoticeType.Warning
  }
}

const InstructionsModal: React.FC<{
  visible: boolean
  onVisibleChanged: (value: boolean) => void
}> = ({onVisibleChanged, visible}) => {
  const handleClose = () => onVisibleChanged(false)

  return (
    <Modal show={visible} onHide={handleClose} className='d-flex align-items-center'>
      <div className='modal-content flex-column'>
        <Modal.Header className='flex-column'>
          <div className='d-flex justify-content-center flex-column'>
            <span className='fw-bolder fs-3'>Instruções</span>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className='d-flex align-items-center flex-column'>
            <div className='fs-6 text-muted text-center pb-10'>
              No editor digite e formate o texto que deseja. Adicione as variáves que estão no campo
              ao lado do editor onde deseja que seja escrito, como por exemplo, a razão social
              (@NomedaEmpresa).
            </div>
            <div
              className='btn btn-icon btn-sm btn-active-light-primary ms-2 pb-6'
              aria-label='Close'
              onClick={handleClose}
            >
              <div className='d-flex justify-content-center'>
                <div className='btn btn-primary'>Continuar</div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </div>
    </Modal>
  )
}
export function RegisterModelForm(props: {
  label: string
  id: string
  saveLink: string
  module: number
}) {
  const [instructionsModalVisible, setInstructionsModalVisible] = useState(false)
  const [instructionsModalSaveVisible, setInstructionsModalSaveVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [template, setTemplate] = useState('')
  const [modelName, setModelName] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [notificationType, setNotificationType] = useState<NoticeType>(0)
  const [detaisNoticeTemplate, setDetailsNoticeTemplate] = useState()
  const [error, setError] = useState<{message: any} | null>(null)
  const history = useHistory()

  useEffect(() => {
    if (!props.id) return
    getNoticeTemplateDetaisl(props.id).then((res) => {
      setDetailsNoticeTemplate(res.data)
      setTemplate(res.data.htmlTemplate)
      setModelName(res.data.name)
      setDueDate(res.data.daysToExpire)
      setNotificationType(res.data.type)
    })
  }, [props.id])

  const save = () => {
    setIsLoading(true)
    createNoticeTemplate(
      props.module,
      template,
      modelName,
      Number(notificationType),
      Number(dueDate)
    )
      .then(() => {
        setInstructionsModalSaveVisible(false)
        setIsLoading(false)
        history.push(props.saveLink)
      })
      .catch((err) => {
        setError({message: err})
      })
      .finally(() => setIsLoading(false))
  }

  const edit = () => {
    setIsLoading(true)
    editNoticeTemplate(
      props.module,
      props.id,
      template,
      modelName,
      Number(notificationType),
      Number(dueDate)
    )
      .then(() => {
        setInstructionsModalSaveVisible(false)
        setIsLoading(false)
        history.push(props.saveLink)
      })
      .catch((err) => {
        setError({message: err})
      })
      .finally(() => setIsLoading(false))
  }
  const data = [
    {
      id: 2,
      name: getNoticeToText(2),
    },
    {
      id: 3,
      name: getNoticeToText(3),
    },
    {
      id: 4,
      name: getNoticeToText(4),
    },
  ]
  const disabledNotice = template.length <= 0 ? true : false
  const accordion = [
    {lista: '@cnpj', content: 'CNPJ do contribuinte.'},
    {lista: '@aliquota', content: 'alíquota.'},
    {lista: '@observacao', content: 'observação.'},
  ]
  const [show, setShow] = useState(accordion.map((i) => false))
  const openCloseAccordion = (index: number) => {
    const aux = [...show]
    aux[index] = !aux[index]
    setShow(aux)
  }
  var accordionList = accordion.map((l, index) => (
    <AccordionModel
      key={index}
      title={l.lista}
      content={l.content}
      show={show[index]}
      openClose={() => openCloseAccordion(index)}
    ></AccordionModel>
  ))
  return (
    <>
      <div className='card-body d-flex flex-column justify-content-center shadow rounded bg-light '>
        <div className=' border-0 pt-5 p-3 mx-3  '>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bolder fs-3 '>{props.label}</span>
          </h3>
        </div>
        <div className='card p-3 mx-3 '>
          <div className='d-flex justify-content-between px-10'>
            <div className='p-4'>
              <strong className=''>Nome do modelo</strong>
              <input
                className=' w-300px shadow form-control'
                type={'text'}
                placeholder={'Insira o nome do modelo'}
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
              />
            </div>
            <div className='p-4'>
              <strong className=''>Prazo para vencimento (dias)</strong>
              <input
                className=' w-300px shadow form-control'
                type={'number'}
                placeholder={'Insira o prazo para vencimento do modelo'}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            {props.module != 2 ? (
              <div className='d-flex flex-row justify-content-center'>
                <label className='mt-13 form-check form-switch form-check-custom form-check-solid'>
                  <input
                    onChange={() => {
                      setNotificationType(notificationType === 0 ? 1 : 0)
                    }}
                    className='form-check-input w-30px h-20px'
                    type='checkbox'
                    checked={notificationType == 1}
                  />
                  <strong className='form-check-label fs-7'>
                    {getNoticeToText(notificationType)}
                  </strong>
                </label>
              </div>
            ) : (
              <div className='p-4'>
                <strong className=''>Tipo</strong>
                <select
                  onChange={(e) => {
                    setNotificationType(Number(e.target.value))
                  }}
                  value={notificationType}
                  className=' w-300px shadow form-control h-40px'
                  aria-label='Select example'
                >
                  <option>Selecione</option>
                  {data.map((e, i) => (
                    <option key={i} value={e.id}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div className='px-10 mb-4'>
            <div className='d-flex align-items-center justify-content-between'>
              <h3 className='p-3 m-0 fs-6'>Variáveis</h3>
            </div>
            <p className='ms-3 fw-bold'>Expanda a variável para mais detalhes</p>
            {accordionList}
          </div>
        </div>
        <div className='card p-3 mx-3 mt-6'>
          <div className='d-flex flex-column px-10'>
            <div className='d-flex justify-content-between p-3 mx-3  align-items-center'>
              <span className='fs-6 fw-bolder'>
                Insira no editor abaixo o template para ser usado na geração de
                notificações/autuações
              </span>
              <Link
                to={'#'}
                className='fw-bolder fs-6 '
                onClick={() => setInstructionsModalVisible(!instructionsModalVisible)}
              >
                Instruções
              </Link>
            </div>
            <div className=' bg-light-primary rounded p-5 m-2 d-flex align-items-start justify-content-start h-700px'>
              <RichEditor template={template} setTemplate={setTemplate} />
            </div>
          </div>
        </div>
        <div className='d-flex justify-content-center pt-6 pb-3'>
          <div className='d-flex justify-content-center pe-6'>
            <CustomButton
              label='Visualizar prévia'
              isLoading={false}
              disabled={disabledNotice}
              onSubmit={() => downloadNoticePreview(template)}
            />
          </div>
          <div className='d-flex justify-content-center'>
            <CustomButton
              label='Salvar'
              disabled={isLoading}
              isLoading={isLoading}
              onSubmit={!props.id ? save : edit}
            />
          </div>
        </div>
        <div>
          <FormError status={error} />
        </div>
      </div>
      <InstructionsModal
        visible={instructionsModalVisible}
        onVisibleChanged={setInstructionsModalVisible}
      ></InstructionsModal>
    </>
  )
}

export default function RegisterModelPage() {
  const {id} = useParams<{id: string}>()
  return (
    <RegisterModelForm
      label={id ? 'Editar Modelo' : 'Cadastro de Modelos'}
      id={id}
      saveLink={'/auditor/cadastros/consulta-modelos'}
      module={0}
    />
  )
}
