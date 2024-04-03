import {useFormik} from 'formik'
import {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {RegisterFormModelInput} from '../../../../components/RegisterFormModel'
import {SelectInput} from '../../../../components/SelectInput'
import {CustomButton} from '../../../components/CustomButton/CustomButton'
import {masks} from '../../../components/Form/FormInput'
import Table from '../../../components/Table/Table'
import {mapContent} from '../../../components/Table/TableHead'
import {CultureDeclaration, getCultureDeclaration} from '../../../services/CultureDeclarationApi'
import {CultureType, CultureTypeApi, getCultureType} from '../../../services/CultureTypeApi'
import {updateTaxProcedureCultureDeclaration} from '../../../services/FiscalProcedureApi'
import ModeloModal, {ModalErrorFooter} from '../../../utils/components/ModeloModal'
import SelectYear from '../../../../components/SelectYear'

type ITRModalHerdsProps = {
  show: boolean
  onHide: () => void
  id: string
}

type HerdsFormData = {
  year?: string
  model: (
    | Record<
        string,
        {
          maleCount: string
          femaleCount: string
        }
      >
    | undefined
  )[]
}

/**
 * Constrói o payload da chamada de API para atualizar a declaração de culturas (para ajuste de rebanho).
 * Recebe como arguments os valores do formulário e a lista de tipos de cultura.
 */
export function getApiLiveStockValue(formValues: HerdsFormData, cultureTypes: CultureTypeApi[]) {
  const cultureData = cultureTypes
    // Apenas para o tipo de cultura "Rebanho"
    .filter((e) => e.type === CultureType.Livestock)
    .flatMap((type, i) => {
      return formValues.model.map((monthData, monthIndex) => {
        if (!monthData || !monthData[type.name]) {
          return undefined
        }
        return {
          month: monthIndex + 1,
          cultureId: type.id,
          maleCount: monthData[type.name].maleCount ? Number(monthData[type.name].maleCount) : 0,
          femaleCount: monthData[type.name].femaleCount
            ? Number(monthData[type.name].femaleCount)
            : 0,
        }
      })
    })
  return {
    year: formValues.year,
    declarations: cultureData.filter((e) => e) as {
      maleCount: number
      femaleCount: number
      cultureId: string
      month: number
    }[],
  }
}

export function getModalHerdsInitialValue(cultureDeclaration: CultureDeclaration[], year: string) {
  const LiveStock: HerdsFormData['model'] = Array.from(new Array(12).map((e) => undefined))
  const currentYearDeclaration = cultureDeclaration.filter((e) => e.year === year)

  for (const culture of currentYearDeclaration) {
    if (culture.type === CultureType.Livestock) {
      if (!LiveStock[culture.month - 1]) {
        LiveStock[culture.month - 1] = {}
      }
      ;(
        LiveStock[culture.month - 1] as Record<
          string,
          {
            maleCount: string
            femaleCount: string
          }
        >
      )[culture.cultureName] = {
        maleCount: String(culture.maleCount),
        femaleCount: String(culture.femaleCount),
      }
    }
  }
  return {model: LiveStock, year}
}

export default function ITRModalHerds(props: ITRModalHerdsProps) {
  const [cultureTypeList, setCultureTypeList] = useState<CultureTypeApi[]>([])
  const [initialValues, setInitialValues] = useState<HerdsFormData>({model: []})
  const [isLoading, setIsLoading] = useState(false)
  // const {id} = useParams<{id: string}>()

  function refreshCultureList() {
    getCultureDeclaration(props.id).then((res) => {
      setInitialValues(getModalHerdsInitialValue(res.data, formik.values.year ?? ''))
    })
    getCultureType().then((res) => {
      setCultureTypeList(res.data)
    })
  }

  const livestockList = cultureTypeList.filter((e) => e.type === CultureType.Livestock)

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: '',
    enableReinitialize: true,
    onSubmit: (values, {setStatus}) => {
      setIsLoading(true)
      updateTaxProcedureCultureDeclaration(props.id, getApiLiveStockValue(values, livestockList))
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

  const meses = [
    {mes: 'Janeiro'},
    {mes: 'Fevereiro'},
    {mes: 'Março'},
    {mes: 'Abril'},
    {mes: 'Maio'},
    {mes: 'Junho'},
    {mes: 'Julho'},
    {mes: 'Agosto'},
    {mes: 'Setembro'},
    {mes: 'Outubro'},
    {mes: 'Novembro'},
    {mes: 'Dezembro'},
  ]
  const herds = meses.map((e, i) => ({
    mes: e.mes,
    model: livestockList.map((e) => (
      <div className='d-flex flex-row justify-content-center'>
        <RegisterFormModelInput
          mask={masks.number}
          label=''
          placeholder='Quantidade'
          fieldProps={formik.getFieldProps(`model.${i}.${e.name}.maleCount`)}
          touched={undefined}
          errors={undefined}
          type='text'
          className='w-100px h-25px shadow form-control'
        />
        <div style={{marginLeft: 10}}>
          <RegisterFormModelInput
            mask={masks.number}
            label=''
            placeholder='Quantidade'
            fieldProps={formik.getFieldProps(`model.${i}.${e.name}.femaleCount`)}
            touched={undefined}
            errors={undefined}
            type='text'
            className='w-100px h-25px shadow form-control'
          />
        </div>
      </div>
    )),
  }))

  const herdsList = herds.map((e) => ({
    columns: mapContent([e.mes, ...e.model]),
  }))
  return (
    <ModeloModal
      size='xl'
      show={props.show}
      onHide={props.onHide}
      title={
        <div className='d-flex justify-content-between align-items-center'>
          <div>Ajuste de Rebanho</div>
          <div className='d-flex  align-items-center'>
            <span className='card-label fw-bolder fs-5 me-5'>Selecione o Ano</span>
            <SelectYear
              label=''
              fieldProps={formik.getFieldProps('year')}
              touched={formik.touched.year}
              errors={formik.errors.year}
            />
          </div>
        </div>
      }
      body={
        <div style={{overflowX: 'scroll'}}>
          <Table
            className='w-100'
            rows={herdsList || []}
            headColumns={mapContent([
              'MESES',
              ...livestockList.map((e) => (
                <div className='d-flex flex-column'>
                  <div>{e.name}</div>
                  <div
                    style={{
                      color: '#33691e',
                    }}
                  >
                    Macho | Fêmea
                  </div>
                </div>
              )),
            ])}
          ></Table>
        </div>
      }
      footer={
        <ModalErrorFooter
          error={formik.status}
          modalFooter={
            <CustomButton
              label='Salvar'
              disabled={formik.values.year === '' ? true : isLoading}
              isLoading={isLoading}
              onSubmit={formik.handleSubmit}
            />
          }
        />
      }
    ></ModeloModal>
  )
}
