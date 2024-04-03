import {useFormik} from 'formik'
import {set} from 'immer/dist/internal'
import {useState, useEffect} from 'react'
import {Nav} from 'react-bootstrap-v5'
import {SelectInput} from '../../../../components/SelectInput'
import {CustomButton} from '../../../components/CustomButton/CustomButton'
import {CultureDeclaration, getCultureDeclaration} from '../../../services/CultureDeclarationApi'
import {CultureType, CultureTypeApi, getCultureType} from '../../../services/CultureTypeApi'
import {updateTaxProcedureCultureDeclaration} from '../../../services/FiscalProcedureApi'
import ModeloModal, {ModalErrorFooter} from '../../../utils/components/ModeloModal'
import {showConfirmSubmit} from '../../../utils/functions'
import ITRCultureConfig from './ITRCultureConfig'
import ITRAgricultureManagement, {ITRFishFarmManagement} from './ITRCultureManagement'
import SelectYear from '../../../../components/SelectYear'

type ITRModalCultureManagementProps = {
  show: boolean
  onHide: () => void
  id: string
}

export function getApiDeclarationValue(
  formValues: CultureDeclarationFormData,
  cultureTypes: CultureTypeApi[]
) {
  const cultureData = cultureTypes.map((e) => {
    if (e.type === CultureType.Agriculture) {
      if (!formValues.agricultura?.[e.name]) {
        return undefined
      }
      return {
        cultureId: e.id,
        area: Number(formValues.agricultura?.[e.name]),
        month: 1,
      }
    }
    if (e.type === CultureType.FishFarms) {
      if (!formValues.piscicultura?.[e.name]?.area && !formValues.piscicultura?.[e.name]?.count) {
        return undefined
      }
      return {
        cultureId: e.id,
        area: formValues.piscicultura?.[e.name]?.area
          ? Number(formValues.piscicultura?.[e.name].area)
          : undefined,
        count: formValues.piscicultura?.[e.name]?.count
          ? Number(formValues.piscicultura?.[e.name].count)
          : undefined,
        month: 1,
      }
    }
  })
  return {
    year: formValues.year,
    declarations: cultureData.filter((e) => e) as {
      count: number
      area: number
      cultureId: string
      month: number
    }[],
  }
}

export function getDeclarationInitialValue(cultureDeclaration: CultureDeclaration[], year: string) {
  const Agro: CultureDeclarationFormData['agricultura'] = {}
  const Piscicultura: CultureDeclarationFormData['piscicultura'] = {}
  const currentYearDeclaration = cultureDeclaration.filter((e) => e.year === year)

  for (const culture of currentYearDeclaration) {
    if (culture.type === CultureType.Agriculture) {
      Agro[culture.cultureName] = culture.area ? String(culture.area) : ''
    } else if (culture.type === CultureType.FishFarms) {
      Piscicultura[culture.cultureName] = {
        area: culture.area ? String(culture.area) : '',
        count: culture.count ? String(culture.count) : '',
      }
    }
  }
  return {agricultura: Agro, piscicultura: Piscicultura, year}
}

type CultureDeclarationFormData = {
  agricultura?: Record<string, string>
  piscicultura?: Record<
    string,
    {
      area?: string
      count?: string
    }
  >
  year?: string
}
const defaultInitialValues: CultureDeclarationFormData = {agricultura: {}}

export default function ITRCultureManagementModal(props: ITRModalCultureManagementProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [cultureTypeList, setCultureTypeList] = useState<CultureTypeApi[]>([])
  const [initialValues, setInitialValues] = useState(defaultInitialValues)
  const [showModalCulture, setShowModalCulture] = useState(false)
  const [dataTabId, setDataTabId] = useState(0)
  const updateTabId = (id: number) => {
    setDataTabId(id)
  }

  function refreshCultureList() {
    getCultureDeclaration(props.id).then((res) => {
      setInitialValues(getDeclarationInitialValue(res.data, formik.values.year ?? ''))
    })
    getCultureType().then((res) => {
      setCultureTypeList(res.data)
    })
  }

  const CultureCheckedList = cultureTypeList.filter((e) => e.isChecked)
  const CultureCheckedAgricultureList = CultureCheckedList.filter(
    (e) => e.type === CultureType.Agriculture
  )
  const CultureCheckedFishFarmList = CultureCheckedList.filter(
    (e) => e.type === CultureType.FishFarms
  )

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: '',
    enableReinitialize: true,
    onSubmit: (values, {setStatus}) => {
      setIsLoading(true)
      updateTaxProcedureCultureDeclaration(
        props.id,
        getApiDeclarationValue(values, CultureCheckedList)
      )
        .then(() => {
          refreshCultureList()
          props.onHide()
        })
        .catch((err) => setStatus({message: err}))
        .finally(() => setIsLoading(false))
    },
  })
  useEffect(() => {
    refreshCultureList()
  }, [formik.values.year])
  return (
    <ModeloModal
      size='xl'
      show={props.show}
      onHide={() => {
        if (formik.dirty) {
          const confirmed = showConfirmSubmit()
          if (confirmed) {
            formik.resetForm()
            props.onHide()
          }
        } else {
          props.onHide()
        }
      }}
      title={
        <div className='d-flex align-items-center justify-content-between'>
          <div>Gestão de culturas</div>
          <SelectYear
            label=''
            fieldProps={formik.getFieldProps('year')}
            touched={formik.touched.year}
            errors={formik.errors.year}
          />
        </div>
      }
      body={
        <div className='d-flex flex-column'>
          <TabModel
            handerId={updateTabId}
            items={[
              {
                name: 'Agricultura',
                content: (
                  <>
                    {CultureCheckedAgricultureList.length > 0 && (
                      <ITRAgricultureManagement
                        getFieldProps={formik.getFieldProps}
                        title='Agricultura'
                        inputAgricultureList={CultureCheckedAgricultureList}
                      />
                    )}
                  </>
                ),
              },
              {
                name: 'Piscicultura',
                content: (
                  <>
                    {CultureCheckedFishFarmList.length > 0 && (
                      <ITRFishFarmManagement
                        getFieldProps={formik.getFieldProps}
                        title='Piscicultura'
                        inputFishFarmList={CultureCheckedFishFarmList}
                      ></ITRFishFarmManagement>
                    )}
                  </>
                ),
              },
              {
                name: 'Configurar Cultura',
                content: (
                  <>
                    <ITRCultureConfig></ITRCultureConfig>
                  </>
                ),
              },
            ]}
          ></TabModel>
        </div>
      }
      footer={
        <ModalErrorFooter
          error={formik.status}
          modalFooter={
            <>
              {dataTabId === 2 ? (
                <></>
              ) : (
                <CustomButton
                  label='Salvar'
                  disabled={formik.values.year == '' ? true : isLoading}
                  isLoading={isLoading}
                  onSubmit={formik.handleSubmit}
                />
              )}
            </>
          }
        />
      }
    ></ModeloModal>
  )
}
type TabModelProps = {
  items: {name: string; content: React.ReactNode}[]
  handerId: (id: number) => void
}
function TabModel(props: TabModelProps) {
  const [getId, setGetId] = useState(0)

  return (
    <>
      <Nav variant='pills' className='mb-10'>
        {props.items.map((e, i) => (
          <Nav.Item>
            <Nav.Link
              className='mb-10'
              onClick={() => {
                setGetId(i)
                props.handerId(i)
              }}
              active={getId == i ? true : false}
            >
              {e.name}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
      <div>{props.items.map((e, i) => getId == i && e.content)}</div>
    </>
  )
}
