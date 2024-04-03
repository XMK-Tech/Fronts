import {useFormik} from 'formik'
import {useEffect, useState} from 'react'
import {toAbsoluteUrl} from '../../../../_metronic/helpers'
import {CustomButton} from '../../../components/CustomButton/CustomButton'
import {
  createCultureType,
  CultureType,
  CultureTypeApi,
  getCultureType,
  updateCultureCheck,
} from '../../../services/CultureTypeApi'
import ModeloModal from '../../../utils/components/ModeloModal'
import ITRCultureType from './ITRCultureType'

type ITRModalCultureProps = {
  id?: string
}

export function getApiCultureValue(formValues: CultureFormData, cultureTypes: CultureTypeApi[]) {
  const cultureData = cultureTypes.map((e) => {
    let isChecked: boolean | undefined = false
    switch (e.type) {
      case CultureType.Agriculture:
        isChecked = formValues.agricultura?.[e.name]
        break
      case CultureType.FishFarms:
        isChecked = formValues.piscicultura?.[e.name]
        break
      default:
        isChecked = formValues.pecuaria?.[e.name]
    }
    return {
      cultureId: e.id,
      isChecked: isChecked,
    }
  })
  return cultureData.filter((e) => e.isChecked !== undefined) as {
    cultureId: string
    isChecked: boolean
  }[]
}

type CultureFormData = {
  agricultura?: Record<string, boolean>
  piscicultura?: Record<string, boolean>
  pecuaria?: Record<string, boolean>
}

export default function ITRCultureConfig(props: ITRModalCultureProps) {
  const [inputFishFarms, setInputFishFarmsValue] = useState('')
  const [inputAgriculture, setInputAgricultureValue] = useState('')
  const [inputLivestock, setInputLivestockValue] = useState('')
  const [cultereTypeData, setCultereTypeData] = useState<CultureTypeApi[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  function refreshCultureList() {
    getCultureType().then((res) => {
      setCultereTypeData(res.data)
    })
  }

  useEffect(() => {
    refreshCultureList()
  }, [])

  const formik = useFormik({
    initialValues: {},
    onSubmit: (values, {setStatus}) => {
      setIsLoading(true)
      updateCultureCheck(getApiCultureValue(values as any, cultereTypeData))
        .then(() => {
          refreshCultureList()
        })
        .catch((err) => setStatus({message: err}))
        .finally(() => {
          setIsLoading(false)
          setShowModal(true)
        })
    },
  })

  const fishFarms = cultereTypeData?.filter((e) => e.type === CultureType.FishFarms)
  const fishFarmsDefaultList = fishFarms.filter((e) => e.isDefault)
  const fishFarmsList = fishFarms.filter((e) => !e.isDefault)
  const agriculture = cultereTypeData?.filter((e) => e.type === CultureType.Agriculture)
  const agricultureDefaultList = agriculture.filter((e) => e.isDefault)
  const agricultureList = agriculture.filter((e) => !e.isDefault)
  const livestock = cultereTypeData?.filter((e) => e.type === CultureType.Livestock)
  const livestockDefaultList = livestock.filter((e) => e.isDefault)
  const livestockList = livestock.filter((e) => !e.isDefault)

  return (
    <>
      <div>
        <div className='d-flex flex-row'>
          <div>
            <ITRCultureType
              fieldNamePrefix='piscicultura'
              getFieldProps={formik.getFieldProps}
              checkBoxList={fishFarmsList}
              defaultCheckBoxList={
                fishFarmsDefaultList.length > 0 ? fishFarmsDefaultList : undefined
              }
              title='Piscicultura'
              placeholder='Nova Espécie'
              inputValue={inputFishFarms}
              onChangeInput={(input) => {
                setInputFishFarmsValue(input.target.value)
              }}
              isLoadingButton={isLoading}
              disabladButton={!inputFishFarms}
              onSubmitButton={() => {
                setIsLoading(true)
                createCultureType({
                  name: inputFishFarms,
                  type: CultureType.FishFarms,
                  isChecked: true,
                })
                  .catch((err) => {
                    formik.setStatus({message: err})
                  })
                  .finally(() => {
                    setIsLoading(false)
                    refreshCultureList()
                    setInputFishFarmsValue('')
                  })
              }}
            ></ITRCultureType>
            <ITRCultureType
              fieldNamePrefix='agricultura'
              getFieldProps={formik.getFieldProps}
              checkBoxList={agricultureList}
              title='Agricultura'
              placeholder='Nova Agricultura'
              inputValue={inputAgriculture}
              defaultCheckBoxList={
                agricultureDefaultList.length > 0 ? agricultureDefaultList : undefined
              }
              onChangeInput={(input) => {
                setInputAgricultureValue(input.target.value)
              }}
              isLoadingButton={isLoading}
              disabladButton={!inputAgriculture}
              onSubmitButton={() => {
                setIsLoading(true)
                createCultureType({
                  name: inputAgriculture,
                  type: CultureType.Agriculture,
                  isChecked: true,
                })
                  .catch((err) => {
                    formik.setStatus({message: err})
                  })
                  .finally(() => {
                    setIsLoading(false)
                    refreshCultureList()
                    setInputAgricultureValue('')
                  })
              }}
            ></ITRCultureType>
            <ITRCultureType
              fieldNamePrefix='pecuaria'
              getFieldProps={formik.getFieldProps}
              checkBoxList={livestockList}
              defaultCheckBoxList={
                livestockDefaultList.length > 0 ? livestockDefaultList : undefined
              }
              title='Pecuária'
              placeholder='Nova Pecuária'
              inputValue={inputLivestock}
              onChangeInput={(input) => {
                setInputLivestockValue(input.target.value)
              }}
              isLoadingButton={isLoading}
              disabladButton={!inputLivestock}
              onSubmitButton={() => {
                setIsLoading(true)
                createCultureType({
                  name: inputLivestock,
                  type: CultureType.Livestock,
                  isChecked: true,
                })
                  .catch((err) => {
                    formik.setStatus({message: err})
                  })
                  .finally(() => {
                    setIsLoading(false)
                    refreshCultureList()
                    setInputLivestockValue('')
                  })
              }}
            ></ITRCultureType>
          </div>
          <div className='d-flex align-items-center w-100 justify-content-center'>
            <img
              alt='Logo'
              src={toAbsoluteUrl('/media/illustrations/custom/logoAgilleBlack.png')}
              className='img-fluid mh-250px'
            />
          </div>
        </div>
      </div>
      <div className='d-flex justify-content-end'>
        <CustomButton
          label='Configurar Cultura'
          disabled={isLoading}
          isLoading={isLoading}
          onSubmit={formik.handleSubmit}
        />
      </div>
      <ModeloModal
        show={showModal}
        title={'Alterações concluídas'}
        onHide={() => window.location.reload()}
        body={
          <>
            Sua alterações foram concluídas com Sucesso ! clique em finalizar para concluir o
            processo
          </>
        }
        footer={
          <CustomButton
            isLoading={false}
            label='Finalizar'
            onSubmit={() => window.location.reload()}
          />
        }
      />
    </>
  )
}
