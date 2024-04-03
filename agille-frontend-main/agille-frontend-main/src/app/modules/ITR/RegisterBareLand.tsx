import {useFormik} from 'formik'
import {useEffect, useState} from 'react'
import {FormError} from '../../../components/FormError'
import {RegisterFormModelColumn} from '../../../components/RegisterFormModel'
import {CustomButton} from '../../components/CustomButton/CustomButton'
import {MaskedFieldInput} from '../../components/Form/FormInput'
import {getBareLand, putBareLand} from '../../services/DeclarationApi'
import {AttachmentDropZoneReview} from '../../utils/components/AttachmentDropZoneReview'
import IsLoadingList from '../../utils/components/IsLoadingList'
import SelectYear from '../../../components/SelectYear'
import {convertMoneyToNumber, moneyMask} from '../../utils/functions/masks'

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
      setGoodAptitude(res.data.goodAptitude.toString())
      setRegularAptitude(res.data.regularAptitude.toString())
      setRestrictedFitness(res.data.restrictedFitness.toString())
      setPlantedPastures(res.data.plantedPastures.toString())
      setForestryOrNaturalPasture(res.data.forestryOrNaturalPasture.toString())
      setPreservationOfFaunaOrFlora(res.data.preservationOfFaunaOrFlora.toString())
      setInitialValues({
        forestryOrNaturalPasture: res.data.forestryOrNaturalPasture.toString(),
        goodAptitude: res.data.goodAptitude.toString(),
        plantedPastures: res.data.plantedPastures.toString(),
        preservationOfFaunaOrFlora: res.data.preservationOfFaunaOrFlora.toString(),
        regularAptitude: res.data.regularAptitude.toString(),
        restrictedFitness: res.data.restrictedFitness.toString(),
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
          forestryOrNaturalPasture: convertMoneyToNumber(forestryOrNaturalPasture),
          goodAptitude: convertMoneyToNumber(goodAptitude),
          plantedPastures: convertMoneyToNumber(plantedPastures),
          preservationOfFaunaOrFlora: convertMoneyToNumber(preservationOfFaunaOrFlora),
          regularAptitude: convertMoneyToNumber(regularAptitude),
          restrictedFitness: convertMoneyToNumber(restrictedFitness),
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
              <RegisterFormModelColumn container='center'>
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
              </RegisterFormModelColumn>
              <RegisterFormModelColumn container='center'>
                <MaskedFieldInput
                  label='Lavoura Aptidão Boa'
                  value={moneyMask(goodAptitude)}
                  className='shadow form-control'
                  onChange={(e) => setGoodAptitude(moneyMask(e))}
                />
                <MaskedFieldInput
                  label='Lavoura Aptidão Regular'
                  value={moneyMask(regularAptitude)}
                  className='shadow form-control'
                  onChange={(e) => setRegularAptitude(moneyMask(e))}
                />
                <MaskedFieldInput
                  label='Lavoura Aptidão Restrita'
                  value={moneyMask(restrictedFitness)}
                  className='shadow form-control'
                  onChange={(e) => setRestrictedFitness(moneyMask(e))}
                />
              </RegisterFormModelColumn>

              <RegisterFormModelColumn container='center'>
                <MaskedFieldInput
                  label='Pastagens Plantadas'
                  value={moneyMask(plantedPastures)}
                  className='shadow form-control'
                  onChange={(e) => setPlantedPastures(moneyMask(e))}
                />
                <MaskedFieldInput
                  label='Silvicultura ou Pastagem Natural'
                  value={moneyMask(forestryOrNaturalPasture)}
                  className='shadow form-control'
                  onChange={(e) => setForestryOrNaturalPasture(moneyMask(e))}
                />
                <MaskedFieldInput
                  label='Preservação da Fauna ou Flora'
                  value={moneyMask(preservationOfFaunaOrFlora)}
                  className='shadow form-control'
                  onChange={(e) => setPreservationOfFaunaOrFlora(moneyMask(e))}
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
