import {useFormik} from 'formik'
import React, {useEffect, useState} from 'react'
import {FormError} from '../../../components/FormError'
import {
  RegisterFormModelColumn,
  RegisterFormModelInput,
} from '../../../components/RegisterFormModel'
import {SelectInput} from '../../../components/SelectInput'
import {useEntities} from '../../../setup/redux/hooks'
import {CustomButton} from '../../components/CustomButton/CustomButton'
import {masks} from '../../components/Form/FormInput'
import {getTaxPayerDeclaration, putTaxPayerDeclaration} from '../../services/DeclarationApi'
import CheckBoxITem from './Components/CheckBoxItem'
import {ITRRegisterFormInputDropdown} from './Components/ITRRegisterForm'
import SuccessFullScreen from './Components/SuccessFullScreen'
import {actualYear} from './RegisterBareLand'
import SelectYear from '../../../components/SelectYear'

const defaultInitialValues = {
  areaOccupiedWithWorks: '',
  areaUsedInRuralActivity: '',
  areaWithReforestation: '',
  legalReserveArea: '',
  permanentPreservationArea: '',
  taxableArea: '',
  total: '',
  usableArea: '',
  cib: '',
  year: actualYear.toString(),
}

type ValueType = typeof defaultInitialValues

export default function ITRDeclaration() {
  const {entities, changeEntities} = useEntities()
  const [initialValues, setInitialValues] = useState(defaultInitialValues)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingFomr, setLoadingForm] = useState(false)
  const [checkCertificate, setCheckCertificate] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<{message: any} | null>(null)
  const refreshInitialValues = (year: string, cib: string) => {
    setLoadingForm(true)
    setError(null)
    getTaxPayerDeclaration(year, cib)
      .then((res) => {
        setInitialValues({
          areaOccupiedWithWorks: res.data.areaOccupiedWithWorks.toString(),
          areaUsedInRuralActivity: res.data.areaUsedInRuralActivity.toString(),
          areaWithReforestation: res.data.areaWithReforestation.toString(),
          legalReserveArea: res.data.legalReserveArea.toString(),
          permanentPreservationArea: res.data.permanentPreservationArea.toString(),
          taxableArea: res.data.taxableArea.toString(),
          total: res.data.total.toString(),
          usableArea: res.data.usableArea.toString(),
          year: year,
          cib: cib,
        })
        setLoadingForm(false)
        setIsLoading(false)
      })
      .catch((err) => {
        setError({message: err})
        setLoadingForm(false)
        setIsLoading(false)
      })
  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: '',
    enableReinitialize: true,
    onSubmit: async (values: ValueType, {setStatus}) => {
      setIsLoading(true)
      setStatus(undefined)
      try {
        await putTaxPayerDeclaration({
          areaOccupiedWithWorks: Number(values.areaOccupiedWithWorks),
          areaUsedInRuralActivity: Number(values.areaUsedInRuralActivity),
          areaWithReforestation: Number(values.areaWithReforestation),
          legalReserveArea: Number(values.legalReserveArea),
          permanentPreservationArea: Number(values.permanentPreservationArea),
          taxableArea: Number(values.taxableArea),
          total: Number(values.total),
          usableArea: Number(values.usableArea),
          year: values.year,
          cib: values.cib,
        })
        setSuccess(true)
      } catch (err) {
        setStatus({message: err})
      } finally {
        setIsLoading(false)
      }
    },
  })

  useEffect(() => {
    if (isCibValud(formik.values.cib) && formik.values.year.length > 0) {
      refreshInitialValues(formik.values.year, formik.values.cib)
    }
  }, [formik.values.year, formik.values.cib])

  return (
    <div className={`card`}>
      <div className='card-header border-0 pt-5 mb-15'>
        <h3 className='card-title align-items-start flex-column'>
          <LoadingHeader title='Declaração do ITR' loading={loadingFomr} />
        </h3>
        <div className=' d-flex align-items-center'>
          <span className='card-label fw-bolder fs-5 me-5'>Selecione o Ano</span>
          <SelectYear
            label=''
            fieldProps={formik.getFieldProps('year')}
            touched={formik.touched.year}
            errors={formik.errors.year}
          />
        </div>
      </div>

      <div className='card-body  py-3 mb-10'>
        <>
          <div className='d-flex justify-content-center'>
            <RegisterFormModelColumn>
              <RegisterFormModelInput
                label='CIB da propriedade '
                placeholder=''
                fieldProps={formik.getFieldProps('cib')}
                touched={undefined}
                errors={formik.errors.cib}
                type='text'
                mask={masks.cib}
              />
              {entities.length < 1 && (
                <ITRRegisterFormInputDropdown
                  label='Município'
                  placeholder='Insira o Municipio'
                  onChange={(e) => changeEntities(e.target.value)}
                  type='adrresContactCounty'
                  data={entities}
                />
              )}

              <RegisterFormModelInput
                label='Área Total do Imóvel '
                placeholder=''
                fieldProps={formik.getFieldProps('total')}
                touched={formik.touched.total}
                errors={formik.errors.total}
                type='text'
                mask={masks.number}
              />
              <RegisterFormModelInput
                label='Área de Preservação Permanente'
                placeholder=''
                fieldProps={formik.getFieldProps('permanentPreservationArea')}
                touched={formik.touched.permanentPreservationArea}
                errors={formik.errors.permanentPreservationArea}
                type='text'
                mask={masks.number}
              />
            </RegisterFormModelColumn>
            <RegisterFormModelColumn>
              <RegisterFormModelInput
                label='Área de Reserva Legal'
                placeholder=''
                fieldProps={formik.getFieldProps('legalReserveArea')}
                touched={formik.touched.legalReserveArea}
                errors={formik.errors.legalReserveArea}
                type='text'
                mask={masks.number}
              />

              <RegisterFormModelInput
                label='Área tributável '
                placeholder=''
                fieldProps={formik.getFieldProps('taxableArea')}
                touched={formik.touched.taxableArea}
                errors={formik.errors.taxableArea}
                type='text'
                mask={masks.number}
              />
              <RegisterFormModelInput
                label='Área Ocupada com Bendeitorias'
                placeholder=''
                fieldProps={formik.getFieldProps('areaOccupiedWithWorks')}
                touched={formik.touched.areaOccupiedWithWorks}
                errors={formik.errors.areaOccupiedWithWorks}
                type='text'
                mask={masks.number}
              />
            </RegisterFormModelColumn>
            <RegisterFormModelColumn>
              <RegisterFormModelInput
                label='Área Aproveitável '
                placeholder=''
                fieldProps={formik.getFieldProps('usableArea')}
                touched={formik.touched.usableArea}
                errors={formik.errors.usableArea}
                type='text'
                mask={masks.number}
              />
              <RegisterFormModelInput
                label='Área com Reflorestamento'
                placeholder=''
                fieldProps={formik.getFieldProps('areaWithReforestation')}
                touched={formik.touched.areaWithReforestation}
                errors={formik.errors.areaWithReforestation}
                type='text'
                mask={masks.number}
              />
              <RegisterFormModelInput
                label='Área Utilizada na Atividade Rural'
                placeholder=''
                fieldProps={formik.getFieldProps('areaUsedInRuralActivity')}
                touched={formik.touched.areaUsedInRuralActivity}
                errors={formik.errors.areaUsedInRuralActivity}
                type='text'
                mask={masks.number}
              />
            </RegisterFormModelColumn>
          </div>
          <CheckBoxITem
            value={checkCertificate}
            onChange={(e) => {
              setCheckCertificate(e.target.checked)
            }}
            label='DECLARO, PARA OS DEVIDOS FINS, ASSUMINDO TODA E QUALQUER RESPONSABILIDADE, QUE AS INFORMAÇÕES NO PRESENTE FORMULÁRIO SÃO VERDADEIRAS.'
          />
        </>
      </div>
      <div className='card-footer'>
        <div className='d-flex flex-column align-items-center justify-content-center'>
          <CustomButton
            label='Salvar'
            margin='0'
            isLoading={isLoading}
            disabled={!checkCertificate || isLoading}
            onSubmit={formik.handleSubmit}
          ></CustomButton>
          <FormError className='mt-4' status={formik.status || error} />
        </div>
      </div>
      <SuccessFullScreen show={success} onHide={() => setSuccess(false)} />
    </div>
  )
}

function isCibValud(cib: string) {
  return cib.replace(/\D/g, '').length > 7
}
type LoadingHeaderProps = {
  title: string
  loading: boolean
}
export const LoadingHeader = (props: LoadingHeaderProps) => (
  <div className='d-flex align-items-center justify-content-center'>
    <span className='card-label fw-bolder fs-3 mb-1'>{props.title}</span>
    {props.loading && <span className='spinner-border spinner-border-sm align-middle ms-2'></span>}
  </div>
)
