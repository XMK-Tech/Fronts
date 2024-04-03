import { useEffect, useState } from 'react'
import NumberFormat from 'react-number-format'
import { useHistory } from "react-router-dom";
import { RegisterFormModelColumn } from '../../../../components/RegisterFormModel'
import SelectModel from '../../../../components/SelectModel'
import { CustomButton } from '../../../components/CustomButton/CustomButton'
import { createNoticeManual, getNoticeTemplateFields, NoticeType } from '../../../services/NoticeApi'
import ModeloModal from '../../../utils/components/ModeloModal'
import { NoticeList } from '../../auditor/NotificationListPage'
import { useProprietaries } from '../../ITR/Propriety/Registration/useProprietaries'

export default {
  LaunchListPage,
  FindingListPage,
  SummonsListPage,
}

export function LaunchListPage() {
  return <NoticeList type={NoticeType.Launch} link={'/DTE/cruzamentos/launch'} emit={true} />
}

export function FindingListPage() {
  return <NoticeList type={NoticeType.Finding} link={'/DTE/cruzamentos/finding'} emit={true} />
}

export function SummonsListPage() {
  return <NoticeList type={NoticeType.Summons} link={'/DTE/cruzamentos/summons'} emit={true} />
}

export function ModalEmit(props: {
  title: string
  type: NoticeType
  noticeParams: any
  showModal: boolean
  onHide: () => void
}) {
  const history = useHistory();
  const [noticeAliquot, setNoticeAliquot] = useState<number>(0)
  const [dueDate, setDueDate] = useState<number>(10)
  const [listIsLoading, setListIsLoading] = useState(true)
  const [noticeNotes, setNoticeNotes] = useState<string>('')
  const [selectedRateType, setSelectedRateType] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<string[]>()
  const [selectedSubject, setSelectedSubject] = useState('')
  const [fileUrl, setFileUrl] = useState('')
  const personList = useProprietaries()
  const [variablesList, setVariablesList] = useState<{ title: string; value: string }[]>([])
  useEffect(() => {
    if (props.noticeParams.id) {
      getNoticeTemplateFields(props.noticeParams.id).then((response) => {
        setSelectedTemplate(response.data)
        setListIsLoading(false)
        setVariablesList(
          response.data?.map((variable: any) => ({
            title: variable,
            value: '',
          }))
        )
      })
    }
  }, [props.noticeParams])
  const handleList = (e: string, i: number) => {
    setVariablesList(
      variablesList?.map((list, index) => (index === i ? { ...list, value: e } : list))
    )
  }

  const calculationBaselist = [
    {
      id: '0',
      name: `Taxa padrão`,
    },
    {
      id: '1',
      name: `Taxa média`,
    },
  ]
  return (
    <ModeloModal
      title={`Emitir ${props.title}`}
      show={props.showModal}
      onHide={props.onHide}
      body={
        !fileUrl ? (
          <div className='d-flex justify-content-around'>
            <div className='d-flex flex-column align-items-center'>
              <strong className='d-flex align-items-center strongx-5 fw-bowlder fs-6 w-400px'>
                Insira a porcentagem da alíquota e as observações da {props.title}
              </strong>
              <RegisterFormModelColumn>
                <div className='py-3'>
                  <strong className=''>Alíquota</strong>

                  <NumberFormat
                    className='w-400px shadow form-control'
                    format='##%'
                    placeholder='Ex.: 10%'
                    value={noticeAliquot}
                    onChange={(e: any) => setNoticeAliquot(Number(e.target.value.slice(0, 2)))}
                  />
                </div>
                <div className='py-3'>
                  <strong className=''>Vencimento (dias)</strong>

                  <NumberFormat
                    className='w-400px shadow form-control'
                    format='##'
                    placeholder='Ex.: 10'
                    value={dueDate}
                    onChange={(e: any) => setDueDate(e.target.value)}
                  />
                </div>
                <div>
                  <SelectModel
                    value={selectedRateType}
                    label='Base de Cálculo'
                    onChange={(item: any) => setSelectedRateType(item.id)}
                    data={calculationBaselist}
                  ></SelectModel>
                </div>
                <div className='py-3'>
                  <SelectModel
                    value={selectedSubject}
                    label='Recebedor'
                    onChange={(item: any) => setSelectedSubject(item.id)}
                    data={personList}
                  ></SelectModel>
                </div>
                <div className='py-3'>
                  <strong className=''>Observações</strong>
                  <textarea
                    className=' h-150px w-400px shadow form-control'
                    placeholder='Insira as observações'
                    value={noticeNotes}
                    onChange={(e) => setNoticeNotes(e.target.value)}
                  />
                </div>
              </RegisterFormModelColumn>
              <RegisterFormModelColumn>
                {variablesList && variablesList.length > 0 ? (
                  <>
                    <strong className='mt-5'>Variáveis</strong>
                    {variablesList.map((variable, i) => (
                      <div className='py-3' key={i}>
                        <strong className=''>{variable.title}</strong>
                        <input
                          type={'text'}
                          className=' w-400px shadow form-control'
                          placeholder={variable.title}
                          value={variable.value}
                          onChange={(e) => handleList(e.target.value, i)}
                        />
                      </div>
                    ))}
                  </>
                ) : (
                  <strong className='mt-5'>Sem variáveis para este modelo</strong>
                )}
              </RegisterFormModelColumn>
            </div>
          </div>
        ) : (
          <p>
            {props.title} emitida com sucesso! Clique{' '}
            <a href={fileUrl} target='_blank' className='fw-bolder fs-6'>
              {' '}
              aqui{' '}
            </a>{' '}
            para baixar
          </p>
        )
      }
      footer={
        <>
          {fileUrl ? (
            <button
              className='btn btn-primary'
              onClick={() => {
                props.onHide()
                history.goBack();
              }}
            >
              OK
            </button>
          ) : (
            <>
              <CustomButton
                label='Emitir'
                isLoading={listIsLoading}
                onSubmit={() => {
                  setListIsLoading(true)
                  createNoticeManual(
                    props.noticeParams.id,
                    selectedSubject,
                    props.type,
                    noticeAliquot,
                    noticeNotes,
                    dueDate,
                    Number(selectedRateType),
                    variablesList?.reduce((acc, item) => {
                      acc[item.title] = item.value
                      return acc
                    }, {} as any)
                  ).then((response) => {
                    setFileUrl(response.data);
                    setListIsLoading(false);
                  })
                }}
              />
              <button className='btn btn-secondary' onClick={props.onHide}>
                Cancelar
              </button>
            </>
          )}
        </>
      }
    />
  )
}
