import {FormikProps, useFormik} from 'formik'
import React, {useEffect, useState} from 'react'
import {Link, useParams} from 'react-router-dom'
import {DrawMapPoint} from '../../../../components/DrawMap/DrawMap'
import {createPropriety, getPropriety, updatePropriety} from '../../../../services/ProprietyApi'
import {FormSteps} from '../../../../components/FormSteps/FormSteps'
import {useCities, useStates} from '../../../../../components/RegisterFormModel'
import {
  ValueType,
  propertyRegistrationSchema,
  defaultInitialValues,
  proprietyToValueType,
  valueTypeToPropriety,
} from './schema'

import {Stepper, validateFields} from '../../../../components/Stepper/Stepper'
import {
  IdentificationStep,
  AddressStep,
  GeneralInfoStep,
  CharacteristicsStep,
  DrawMapStep,
  AreaDistributionStep,
} from './Steps'
type EditPropertyProps = {
  id: string
}
const LastStep = (props: EditPropertyProps) => (
  <div className='d-flex justify-content-center card-body pt-3 pb-15'>
    <div className='w-800px d-flex p-15 shadow rounded bg-light justify-content-center'>
      <div className='d-flex flex-column p-10 w-500px h-300px rounded bg-white justify-content-center'>
        <div className='d-flex fw-bolder text-center fs-1 mb-1 '>
          O seu Cadastro de Imóvel foi efetuado com Sucesso !
        </div>
        <br />

        <div className=' fw-bolder text-center fs-6 text-muted mb-1 '>
          Você pode visualizar e editar em: <br /> Propriedades/Consulta de Propriedades
        </div>
        <Link
          to={
            props.id
              ? '/ITR/ITRMainPage/DetailsProperty/' + props.id
              : '/ITR/ITRMainPage/ConsultProperty'
          }
          className='p-10 d-flex flex-row justify-content-around'
        >
          <button type='button' className='btn btn-sm btn-primary'>
            Continuar
          </button>
        </Link>
      </div>
    </div>
  </div>
)

const Steps: React.FC<{
  selected: number
  formik: FormikProps<ValueType>
  stepSubmitted: boolean
}> = ({selected, formik, stepSubmitted}) => {
  const drawProps = {
    points: formik.values.coordinates,
    onPointsChanged: (points: DrawMapPoint[]) => formik.setFieldValue('coordinates', points),
  }

  const states = useStates('agille')
  const cities = useCities(formik.values.state, 'agille')
  const {id} = useParams<{id: string}>()

  return (
    <FormSteps selectedStep={selected}>
      <IdentificationStep stepSubmitted={stepSubmitted} formik={formik} />
      <AddressStep stepSubmitted={stepSubmitted} formik={formik} states={states} cities={cities} />
      <GeneralInfoStep stepSubmitted={stepSubmitted} formik={formik} />
      <CharacteristicsStep stepSubmitted={stepSubmitted} formik={formik} />
      <AreaDistributionStep stepSubmitted={stepSubmitted} formik={formik}></AreaDistributionStep>
      <DrawMapStep drawProps={drawProps} />
      <LastStep id={id} />
    </FormSteps>
  )
}

const RegistrationForm: React.FC<{}> = () => {
  const {id} = useParams<{id: string}>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  async function startSave(values: ValueType) {
    setIsLoading(true)
    if (id) {
      await updatePropriety(id, valueTypeToPropriety(values))
    } else {
      await createPropriety(valueTypeToPropriety(values))
    }
    setIsFinished(true)
  }
  function endSave(): void {
    setIsLoading(false)
  }

  const [isFinished, setIsFinished] = useState<boolean>(false)
  const [initialValues, setInitialValues] = useState(defaultInitialValues)

  useEffect(() => {
    if (id) {
      getPropriety(id).then(({data: propriety}) => {
        setInitialValues(proprietyToValueType(propriety))
      })
    }
  }, [id])

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: propertyRegistrationSchema,
    validateOnMount: true,
    enableReinitialize: true,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values, {setStatus}) => {
      try {
        startSave && (await startSave(values))
        endSave && endSave()
      } catch (err) {
        setStatus({message: err})
      } finally {
        setIsLoading(false)
      }
    },
  })

  const handleNextStep = (step: number): boolean => {
    switch (step) {
      case 0:
        return !validateFields(formik, [
          'identificationCIB',
          'identificationIncra',
          'identificationLinkedCIB',
          'identificationMunicipalRegistration',
          'identificationimmobile',
          'identificationCAR',
          'identificationType',
          'identificationRegistration',
          'identificationArea',
        ])
      case 1:
        return !validateFields(formik, [
          'adrresContactZipCode',
          'adrresContactCounty',
          'adrresContactComplement',
          'adrresContactEmail',
          'adrresContactFax',
          'adrresContactMailbox',
          'adrresContactNumber',
          'adrresContactPubilcStreet',
          'adrresContacttelephone',
        ])
      case 2:
        return !validateFields(formik, [
          'hasRiseArea',
          'identificationRiseArea',
          'identificationSettlement',
          'hasEletricity',
          'hasPhone',
          'hasInternet',
          'hasFishingPotential',
          'hasEcotourism',
          'hasSource',
        ])
      case 3:
        return !validateFields(formik, [
          'hasPropertyCertificate',
          'indentificationIncraCertified',
          'haslegalReserve',
          'indetificationAreaHa',
          'hasPosers',
          'indentificationOccupancyPercentage',
          'indentificationOccupationTime',
        ])
      case 4:
        return !validateFields(formik, [
          'permanentPreservation',
          'legalReserve',
          'busyWithImprovements',
          'reforestation',
        ])
    }
    return true
  }

  return (
    <>
      <div className={`card`}>
        <div className='d-flex flex-row'>
          <div className='card-header border-0 pt-5'>
            <h3 className='card-title align-items-start flex-column'>
              <span className='card-label fw-bolder fs-3 mb-1'>
                {id ? 'Editar' : 'Cadastro de'} Imóvel
              </span>
            </h3>
          </div>
        </div>
        <Stepper
          canGoToNextStep={handleNextStep}
          renderStep={(i, stepSubmitted) => (
            <Steps key={i} formik={formik} selected={i} stepSubmitted={stepSubmitted} />
          )}
          isLoading={isLoading}
          showLastStep={isFinished}
          onSubmit={formik.handleSubmit}
          error={formik.status}
          canSelectStep={!!id}
          steps={[
            'Identificação',
            'Endereço e Contato',
            'Informações Gerais',
            'Características',
            'Distribuição da Área',
            'Área da Propriedade',
            'Concluído',
          ]}
        />
      </div>
    </>
  )
}

export default function CountyRegister() {
  return <RegistrationForm />
}
