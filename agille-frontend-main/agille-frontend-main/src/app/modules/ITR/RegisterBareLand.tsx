import {useFormik} from 'formik'
import {useEffect, useState} from 'react'
import {FormError} from '../../../components/FormError'
import {RegisterFormModelColumn} from '../../../components/RegisterFormModel'
import {CustomButton} from '../../components/CustomButton/CustomButton'
import {MaskedFieldInput} from '../../components/Form/FormInput'
import {getBareLand, putBareLand} from '../../services/DeclarationApi'
import IsLoadingList from '../../utils/components/IsLoadingList'
import SelectYear from '../../../components/SelectYear'
import {clearMoneyMask, convertToMonetaryValue, moneyMask} from '../../utils/functions/masks'

export const actualYear = new Date().getFullYear()

const defaultInitialValues = {
  forestryOrNaturalPasture: '',
  goodAptitude: '',
  plantedPastures: '',
  preservationOfFaunaOrFlora: '',
  regularAptitude: '',
  restrictedFitness: '',
  year: actualYear.toString(),
  report: '',
}

type ValueType = typeof defaultInitialValues
export default function RegisterBareLand() {
  const [isLoading, setIsLoading] = useState(false)
  const [initialValues, setInitialValues] = useState(defaultInitialValues)
  const [loadingList, setLoadingList] = useState(false)
  const [reporUrl, setReportUrl] = useState('')
  const [goodAptitude, setGoodAptitude] = useState('')
  const [regularAptitude, setRegularAptitude] = useState('')
  const [restrictedFitness, setRestrictedFitness] = useState('')
  const [plantedPastures, setPlantedPastures] = useState('')
  const [forestryOrNaturalPasture, setForestryOrNaturalPasture] = useState('')
  const [preservationOfFaunaOrFlora, setPreservationOfFaunaOrFlora] = useState('')
  const refreshList = (year: string) => {
    setLoadingList(true)
    getBareLand(year).then((res) => {
      setGoodAptitude(convertToMonetaryValue(res.data.goodAptitude))
      setRegularAptitude(convertToMonetaryValue(res.data.regularAptitude))
      setRestrictedFitness(convertToMonetaryValue(res.data.restrictedFitness))
      setPlantedPastures(convertToMonetaryValue(res.data.plantedPastures))
      setForestryOrNaturalPasture(convertToMonetaryValue(res.data.forestryOrNaturalPasture))
      setPreservationOfFaunaOrFlora(convertToMonetaryValue(res.data.preservationOfFaunaOrFlora))
      setInitialValues({
        forestryOrNaturalPasture: convertToMonetaryValue(
          res.data.forestryOrNaturalPasture
        ),
        goodAptitude: convertToMonetaryValue(res.data.goodAptitude),
        plantedPastures: convertToMonetaryValue(res.data.plantedPastures),
        preservationOfFaunaOrFlora: convertToMonetaryValue(
          res.data.preservationOfFaunaOrFlora
        ),
        regularAptitude: convertToMonetaryValue(res.data.regularAptitude),
        restrictedFitness: convertToMonetaryValue(res.data.restrictedFitness),
        year: year,
        report: res.data.report,
      })
      setLoadingList(false)
    })
  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: '',
    enableReinitialize: true,
    onSubmit: async (values: ValueType, {setStatus}) => {
      setIsLoading(true)
      try {
        await putBareLand({
          forestryOrNaturalPasture: clearMoneyMask(forestryOrNaturalPasture),
          goodAptitude: clearMoneyMask(goodAptitude),
          plantedPastures: clearMoneyMask(plantedPastures),
          preservationOfFaunaOrFlora: clearMoneyMask(preservationOfFaunaOrFlora),
          regularAptitude: clearMoneyMask(regularAptitude),
          restrictedFitness: clearMoneyMask(restrictedFitness),
          year: values.year,
          report: reporUrl,
        })
        refreshList(values.year)
      } catch (err) {
        setStatus({message: err})
      } finally {
        setIsLoading(false)
      }
    },
  })
  useEffect(() => {
    refreshList(formik.values.year)
  }, [formik.values.year])

  return (
    <div className={`card`}>
      <div className='card-header border-0 pt-5 mb-15'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bolder fs-3 mb-1'>Valores de terra nua</span>
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

      <div className='card-body d-flex justify-content-center py-3 mb-10'>
        <>
          {loadingList ? (
            <IsLoadingList />
          ) : (
            <>
              {/* <RegisterFormModelColumn container='center'>
                <div className='d-flex justify-content-center'>
                  <AttachmentDropZoneReview
                    value={formik.values.report}
                    acceptArchive='application/pdf'
                    title='Laudo'
                    onSubmit={(_file, _attachmentId, _fileWithMeta, fileUrl) =>
                      setReportUrl(fileUrl)
                    }
                  />
                </div>
              </RegisterFormModelColumn> */}
              <RegisterFormModelColumn container='center'>
                <MaskedFieldInput
                  label='Lavoura Aptidão Boa'
                  value={moneyMask(goodAptitude)}
                  className='shadow form-control'
                  onChange={(e) => setGoodAptitude(e)}
                />
                <MaskedFieldInput
                  label='Lavoura Aptidão Regular'
                  value={moneyMask(regularAptitude)}
                  className='shadow form-control'
                  onChange={(e) => setRegularAptitude(e)}
                />
                <MaskedFieldInput
                  label='Lavoura Aptidão Restrita'
                  value={moneyMask(restrictedFitness)}
                  className='shadow form-control'
                  onChange={(e) => setRestrictedFitness(e)}
                />
              </RegisterFormModelColumn>

              <RegisterFormModelColumn container='center'>
                <MaskedFieldInput
                  label='Pastagens Plantadas'
                  value={moneyMask(plantedPastures)}
                  className='shadow form-control'
                  onChange={(e) => setPlantedPastures(e)}
                />
                <MaskedFieldInput
                  label='Silvicultura ou Pastagem Natural'
                  value={moneyMask(forestryOrNaturalPasture)}
                  className='shadow form-control'
                  onChange={(e) => setForestryOrNaturalPasture(e)}
                />
                <MaskedFieldInput
                  label='Preservação da Fauna ou Flora'
                  value={moneyMask(preservationOfFaunaOrFlora)}
                  className='shadow form-control'
                  onChange={(e) => setPreservationOfFaunaOrFlora(e)}
                />
              </RegisterFormModelColumn>
            </>
          )}
        </>
      </div>
      <div className='card-footer'>
        <div className='d-flex flex-column justify-content-center align-items-center'>
          <CustomButton
            label='Salvar'
            margin='0'
            isLoading={isLoading}
            disabled={isLoading}
            onSubmit={formik.handleSubmit}
          ></CustomButton>
          <FormError className='mt-4' status={formik.status}></FormError>
        </div>
      </div>
    </div>
  )
}
