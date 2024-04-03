import {FormikProps} from 'formik'
import React, {useState} from 'react'
import {toAbsoluteUrl} from '../../../../../_metronic/helpers'

import {RegisterFormSwitch} from '../../../../../components/RegisterFormSwitch'
import DropZoneModel from '../../../../../components/DropZoneModel'
import DrawMap, {DrawMapProps} from '../../../../components/DrawMap/DrawMap'
import {ValueType} from './schema'
import {masks} from '../../../../components/Form/FormInput'
import {ITRRegisterFormColumn, ITRRegisterFormInputDropdown} from '../../Components/ITRRegisterForm'
import {RegisterFormModelInput} from '../../../../../components/RegisterFormModel'

export function DrawMapStep({drawProps}: {drawProps: DrawMapProps}) {
  return (
    <>
      <DrawMap list points={drawProps.points} onPointsChanged={drawProps.onPointsChanged} />
    </>
  )
}
export function DigitalFilesStep() {
  return (
    <>
      <div className={`card w-100`}>
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bolder fs-3 mb-1'>Arquivos digitais</span>
          </h3>
        </div>
        <div className='d-flex'>
          <DropZoneModel title='Upload de Arquivos Digitais' />
        </div>
      </div>
    </>
  )
}
export function CharacteristicsStep({
  formik,
  stepSubmitted,
}: {
  formik: FormikProps<ValueType>
  stepSubmitted: boolean
}) {
  return (
    <>
      <ITRRegisterFormColumn>
        <strong className='mb-10 text-muted'>Certificado Imóvel</strong>
        <RegisterFormSwitch
          fieldProps={formik.getFieldProps('hasPropertyCertificate')}
          errors={formik.errors.hasPropertyCertificate}
          label='O Imóvel possui certificado conforme lei 10.267/01 ?'
        />
        <RegisterFormModelInput
          label='Número certificado INCRA'
          placeholder='Ex : 9002020212958'
          fieldProps={formik.getFieldProps('indentificationIncraCertified')}
          touched={
            formik.touched.indentificationIncraCertified ||
            stepSubmitted ||
            formik.touched.hasPropertyCertificate ||
            stepSubmitted
          }
          errors={formik.errors.indentificationIncraCertified}
          type='indentificationIncraCertified'
          mask={masks.number}
        />
      </ITRRegisterFormColumn>
      <ITRRegisterFormColumn>
        <strong className='mb-10 text-muted'>Reserva legal regularizada no órgão</strong>
        <RegisterFormSwitch
          fieldProps={formik.getFieldProps('haslegalReserve')}
          errors={formik.errors.haslegalReserve}
          label='O imóvel tem reserva legal regularizada no órgão?'
        />
        <RegisterFormModelInput
          label='Área(ha)'
          placeholder='Ex : 13'
          fieldProps={formik.getFieldProps('indetificationAreaHa')}
          touched={
            formik.touched.indetificationAreaHa ||
            stepSubmitted ||
            formik.touched.haslegalReserve ||
            stepSubmitted
          }
          errors={formik.errors.indetificationAreaHa}
          type='indetificationAreaHa'
          mask={masks.number}
        />
      </ITRRegisterFormColumn>
      <ITRRegisterFormColumn>
        <strong className='mb-10 text-muted'>Ocupação de terra</strong>
        <RegisterFormSwitch
          fieldProps={formik.getFieldProps('hasPosers')}
          errors={formik.errors.hasPosers}
          label='Existem posseiros na área?'
        />
        <RegisterFormModelInput
          label='Qual é o percentual de ocupação'
          placeholder='Ex : 20%'
          fieldProps={formik.getFieldProps('indentificationOccupancyPercentage')}
          touched={
            formik.touched.indentificationOccupancyPercentage ||
            stepSubmitted ||
            formik.touched.hasPosers ||
            stepSubmitted
          }
          errors={formik.errors.indentificationOccupancyPercentage}
          type='indentificationOccupancyPercentage'
          mask={masks.number}
        />
        <RegisterFormModelInput
          label='Qual é o tempo de ocupação (em anos)'
          placeholder='Ex : 2'
          fieldProps={formik.getFieldProps('indentificationOccupationTime')}
          touched={
            formik.touched.indentificationOccupationTime ||
            stepSubmitted ||
            formik.touched.hasPosers ||
            stepSubmitted
          }
          errors={formik.errors.indentificationOccupationTime}
          type='indentificationOccupationTime'
          mask={masks.number}
        />
      </ITRRegisterFormColumn>
    </>
  )
}

export function AreaDistributionStep({
  formik,
  stepSubmitted,
}: {
  formik: FormikProps<ValueType>
  stepSubmitted: boolean
}) {
  return (
    <>
      <ITRRegisterFormColumn>
        <RegisterFormModelInput
          label='Área de Preservação Permanente'
          placeholder='Ex : 13'
          fieldProps={formik.getFieldProps('permanentPreservation')}
          touched={
            formik.touched.permanentPreservation ||
            stepSubmitted ||
            formik.touched.permanentPreservation ||
            stepSubmitted
          }
          errors={formik.errors.permanentPreservation}
          type='permanentPreservation'
          mask={masks.area}
        />
      </ITRRegisterFormColumn>
      <ITRRegisterFormColumn>
        <RegisterFormModelInput
          label='Área de Reserva Legal'
          placeholder='Ex : 13'
          fieldProps={formik.getFieldProps('legalReserve')}
          touched={
            formik.touched.legalReserve ||
            stepSubmitted ||
            formik.touched.legalReserve ||
            stepSubmitted
          }
          errors={formik.errors.legalReserve}
          type='legalReserve'
          mask={masks.area}
        />
      </ITRRegisterFormColumn>
      <ITRRegisterFormColumn>
        <RegisterFormModelInput
          label='Área Ocupada Com Benfeitorias'
          placeholder='Ex : 13'
          fieldProps={formik.getFieldProps('busyWithImprovements')}
          touched={
            formik.touched.busyWithImprovements ||
            stepSubmitted ||
            formik.touched.busyWithImprovements ||
            stepSubmitted
          }
          errors={formik.errors.busyWithImprovements}
          type='busyWithImprovements'
          mask={masks.area}
        />
        <RegisterFormModelInput
          label='Area com Reflorestamento'
          placeholder='Ex : 13'
          fieldProps={formik.getFieldProps('reforestation')}
          touched={
            formik.touched.reforestation ||
            stepSubmitted ||
            formik.touched.reforestation ||
            stepSubmitted
          }
          errors={formik.errors.reforestation}
          type='reforestation'
          mask={masks.area}
        />
      </ITRRegisterFormColumn>
    </>
  )
}
export function GeneralInfoStep({
  formik,
  stepSubmitted,
}: {
  formik: FormikProps<ValueType>
  stepSubmitted: boolean
}) {
  return (
    <>
      <ITRRegisterFormColumn>
        <RegisterFormSwitch
          fieldProps={formik.getFieldProps('hasRiseArea')}
          errors={formik.errors.hasRiseArea}
          touched={formik.touched.hasRiseArea || stepSubmitted}
          label='Área de assentamento?'
        />
        <RegisterFormModelInput
          label='Nome do assentamento'
          placeholder='Ex : minha área'
          fieldProps={formik.getFieldProps('identificationRiseArea')}
          touched={formik.touched.identificationRiseArea || stepSubmitted}
          errors={formik.errors.identificationRiseArea}
          type='identificationRiseArea'
        />
        <ITRRegisterFormInputDropdown
          label='Tipo do assentamento'
          placeholder='Adicione o tipo do assentamento'
          fieldProps={formik.getFieldProps('identificationSettlement')}
          type='identificationSettlement'
          data={[
            {id: '1', name: 'Domínio'},
            {id: '2', name: 'Possessão'},
          ]}
        />
      </ITRRegisterFormColumn>
      <ITRRegisterFormColumn>
        <RegisterFormSwitch
          fieldProps={formik.getFieldProps('hasEletricity')}
          errors={formik.errors.hasEletricity}
          touched={formik.touched.hasEletricity || stepSubmitted}
          label='Possui Energia Elétrica?'
        />
        <RegisterFormSwitch
          fieldProps={formik.getFieldProps('hasPhone')}
          errors={formik.errors.hasPhone}
          touched={formik.touched.hasPhone || stepSubmitted}
          label='Possui Telefone?'
        />
        <RegisterFormSwitch
          fieldProps={formik.getFieldProps('hasInternet')}
          errors={formik.errors.hasInternet}
          label='Possui Internet?'
        />
      </ITRRegisterFormColumn>
      <ITRRegisterFormColumn>
        <RegisterFormSwitch
          label='Possui potencial pesqueiro?'
          fieldProps={formik.getFieldProps('hasFishingPotential')}
          errors={formik.errors.hasFishingPotential}
        />
        <RegisterFormSwitch
          fieldProps={formik.getFieldProps('hasEcotourism')}
          errors={formik.errors.hasEcotourism}
          label='Possui potencial para ecoturismo?'
        />
        <RegisterFormSwitch
          fieldProps={formik.getFieldProps('hasSource')}
          errors={formik.errors.hasSource}
          label='Possui nascentes?'
        />
      </ITRRegisterFormColumn>
    </>
  )
}
export function AddressStep({
  formik,
  states,
  cities,
  stepSubmitted,
}: {
  formik: FormikProps<ValueType>
  states: {id: string; name: string}[] | undefined
  cities: {id: string; name: string}[] | undefined
  stepSubmitted: boolean
}) {
  return (
    <>
      <ITRRegisterFormColumn>
        <RegisterFormModelInput
          label='CEP'
          placeholder='Insira o CEP'
          fieldProps={formik.getFieldProps('adrresContactZipCode')}
          touched={formik.touched.adrresContactZipCode || stepSubmitted}
          errors={formik.errors.adrresContactZipCode}
          type='adrresContactZipCode'
          mask={masks.cep}
        />
        <RegisterFormModelInput
          label='Logradouro'
          placeholder='Insira o Logradouro'
          fieldProps={formik.getFieldProps('adrresContactPubilcStreet')}
          touched={formik.touched.adrresContactPubilcStreet || stepSubmitted}
          errors={formik.errors.adrresContactPubilcStreet}
          type='adrresContactPubilcStreet'
        />
        <RegisterFormModelInput
          label='Número'
          placeholder='Insira o Número'
          fieldProps={formik.getFieldProps('adrresContactNumber')}
          touched={formik.touched.adrresContactNumber || stepSubmitted}
          errors={formik.errors.adrresContactNumber}
          type='adrresContactNumber'
        />
        <RegisterFormModelInput
          label='Complemento'
          placeholder='Insira o Compemento'
          fieldProps={formik.getFieldProps('adrresContactComplement')}
          touched={formik.touched.adrresContactComplement || stepSubmitted}
          errors={formik.errors.adrresContactComplement}
          type='adrresContactComplement'
        />
        <RegisterFormModelInput
          label='Fax'
          placeholder='Insira o FAX'
          fieldProps={formik.getFieldProps('adrresContactFax')}
          touched={formik.touched.adrresContactFax || stepSubmitted}
          errors={formik.errors.adrresContactFax}
          type='adrresContactFax'
          mask={masks.phone}
        />
        <RegisterFormModelInput
          label='Telefone'
          placeholder='Insira o Telefone'
          fieldProps={formik.getFieldProps('adrresContacttelephone')}
          touched={formik.touched.adrresContacttelephone || stepSubmitted}
          errors={formik.errors.adrresContacttelephone}
          type='adrresContacttelephone'
          mask={masks.phone}
        />
      </ITRRegisterFormColumn>

      <ITRRegisterFormColumn>
        <RegisterFormModelInput
          label='Caixa Postal'
          placeholder='Insira a Caixa Postal'
          fieldProps={formik.getFieldProps('adrresContactMailbox')}
          touched={formik.touched.adrresContactMailbox || stepSubmitted}
          errors={formik.errors.adrresContactMailbox}
          type='adrresContactMailbox'
        />

        <ITRRegisterFormInputDropdown
          label='Estado'
          placeholder='Insira o Estado'
          fieldProps={formik.getFieldProps('state')}
          touched={formik.touched.state || stepSubmitted}
          errors={formik.errors.state}
          type='state'
          data={states}
        />
        <ITRRegisterFormInputDropdown
          label='Municipio'
          placeholder='Insira o Municipio'
          fieldProps={formik.getFieldProps('adrresContactCounty')}
          touched={formik.touched.adrresContactCounty || stepSubmitted}
          errors={formik.errors.adrresContactCounty}
          type='adrresContactCounty'
          data={cities}
        />

        <div className='mb-5'>
          <RegisterFormModelInput
            label='Email'
            placeholder='Insira o Email'
            fieldProps={formik.getFieldProps('adrresContactEmail')}
            touched={formik.touched.adrresContactEmail || stepSubmitted}
            errors={formik.errors.adrresContactEmail}
            type='adrresContactEmail'
          />
        </div>
      </ITRRegisterFormColumn>
      <ITRRegisterFormColumn>
        <img
          alt='Logo'
          src={toAbsoluteUrl('/media/illustrations/custom/adminRegisterIllustration.svg')}
          className='img-fluid mb-12'
        />
      </ITRRegisterFormColumn>
    </>
  )
}
export function IdentificationStep({
  formik,
  stepSubmitted,
}: {
  formik: FormikProps<ValueType>
  stepSubmitted: boolean
}) {
  return (
    <>
      <ITRRegisterFormColumn>
        <RegisterFormModelInput
          label='Número do CIB'
          placeholder='Adicione o número do CIB'
          fieldProps={formik.getFieldProps('identificationCIB')}
          touched={formik.touched.identificationCIB || stepSubmitted}
          errors={formik.errors.identificationCIB}
          type='text'
          mask={masks.cib}
        />
        <RegisterFormModelInput
          label='CIB-Vinculado'
          placeholder='Adicione o número do CIB-Vinculado'
          fieldProps={formik.getFieldProps('identificationLinkedCIB')}
          touched={formik.touched.identificationLinkedCIB}
          errors={undefined}
          type='text'
          mask={masks.cib}
        />
        <RegisterFormModelInput
          label='Nome do Imóvel'
          placeholder='Ex.: Fazenda do rio grande'
          fieldProps={formik.getFieldProps('identificationimmobile')}
          touched={formik.touched.identificationimmobile || stepSubmitted}
          errors={formik.errors.identificationimmobile}
          type='countyStreet'
        />
        <ITRRegisterFormInputDropdown
          label='Tipo do Imóvel'
          placeholder='Adicione o tipo do imóvel'
          fieldProps={formik.getFieldProps('identificationType')}
          type='identificationType'
          data={[
            {id: '1', name: 'Chácara'},
            {id: '2', name: 'Fazenda'},
            {id: '3', name: 'Estância'},
            {id: '4', name: 'Haras'},
            {id: '5', name: 'Pesqueiro'},
            {id: '6', name: 'Rancho'},
            {id: '7', name: 'Sítio'},
            {id: '8', name: 'Outro'},
          ]}
          touched={formik.touched.identificationType || stepSubmitted}
          errors={formik.errors.identificationType}
        />
        <RegisterFormModelInput
          mask={masks.area}
          label='Área declarada'
          placeholder='Adicione a área declarada'
          fieldProps={formik.getFieldProps('identificationArea')}
          touched={formik.touched.identificationArea || stepSubmitted}
          errors={formik.errors.identificationArea}
          type='identificationArea'
        />
      </ITRRegisterFormColumn>

      <ITRRegisterFormColumn>
        <RegisterFormModelInput
          label='Código do Incra'
          placeholder='Adicione o Código do Incra'
          fieldProps={formik.getFieldProps('identificationIncra')}
          touched={formik.touched.identificationIncra || stepSubmitted}
          errors={formik.errors.identificationIncra}
          type='identificationIncra'
          mask={masks.incra}
        />
        <RegisterFormModelInput
          label='Inscrição Municipal'
          placeholder='Adicione a Inscrição Municipal'
          fieldProps={formik.getFieldProps('identificationMunicipalRegistration')}
          touched={formik.touched.identificationMunicipalRegistration || stepSubmitted}
          errors={formik.errors.identificationMunicipalRegistration}
          type='identificationMunicipalRegistration'
          mask={masks.municipalRegistration}
        />
        <RegisterFormModelInput
          label='Número do CAR'
          placeholder='Adicione o número do CAR'
          fieldProps={formik.getFieldProps('identificationCAR')}
          touched={formik.touched.identificationCAR || stepSubmitted}
          errors={formik.errors.identificationCAR}
          type='identificationCAR'
          mask={masks.car}
        />
        <RegisterFormModelInput
          label='Matricula'
          placeholder='Adicione a Matricula'
          fieldProps={formik.getFieldProps('identificationRegistration')}
          touched={formik.touched.identificationRegistration || stepSubmitted}
          errors={formik.errors.identificationRegistration}
          type='identificationRegistration'
        />
      </ITRRegisterFormColumn>
      <ITRRegisterFormColumn>
        <img
          alt='Logo'
          src={toAbsoluteUrl('/media/illustrations/custom/worldMap.svg')}
          className='img-fluid'
        />
      </ITRRegisterFormColumn>
    </>
  )
}
