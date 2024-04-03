import React from 'react'
import {ExportReportsButton} from './ITRDashboard'
import {ModalErrorFooter} from '../../utils/components/ModeloModal'
import {CustomButton} from '../../components/CustomButton/CustomButton'
import {CustomDropdown} from './CustomDropdown'
import environment from '../../../setup/environment'
import {RegisterFormModelInput} from '../../../components/RegisterFormModel'
import {masks} from '../../components/Form/FormInput'
import {getExportCity, getExportProperty} from '../../services/FiscalProcedureApi'

export default function ReportsPageITR() {
  return (
    <div className={`card`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bolder fs-3 mb-1'>Relatórios</span>
        </h3>
      </div>
      <div className='d-flex flex-column justify-content-center align-items-center p-20'>
        <div className='d-flex  mb-20'>
          <ExportReportsButton type='transfers' />
          <ExportReportsButton type='procedures' />
          <ExportReportsButton type='activity' />
        </div>
        <div className='d-flex mb-20'>
          <ExportReportsButton type='agriculture' />
          <ExportReportsButton type='animals' />
          <ExportReportsButton type='fish-area' />
        </div>
        <div className='d-flex mb-20'>
          <ExportReportAgronomicFeaturesButton />
        </div>
      </div>
    </div>
  )
}

function ExportReportAgronomicFeaturesButton() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<{message: any} | null>(null)
  const [isProperty, setIsProperty] = React.useState(true)
  const [year, setYear] = React.useState(new Date().getFullYear())
  const [name, setName] = React.useState('')
  const [document, setDocument] = React.useState('')
  const [cib, setCib] = React.useState('')
  const saveExport = async () => {
    setIsLoading(true)
    try {
      if (isProperty)
        await getExportProperty({
          name,
          document,
          cib,
          AllProprieties: false,
        })
      else
        await getExportCity({
          year,
          AllProprieties: true,
        })
    } catch (err) {
      setError({message: err})
    } finally {
      setIsLoading(false)
    }
  }

  return environment.enableReports ? (
    <div className='mx-3'>
      <CustomDropdown
        title={'Propriedade ou Municipio'}
        buttonText={`Relatório de Propriedade ou Municipio`}
        content={
          <>
            <p className='fw-bolder fs-5 text-center'>Selecione o tipo de Exportação</p>
            <div className='card-body d-flex flex-row justify-content-around my-8  '>
              <label htmlFor='property' className='form-check-label'>
                <input
                  className='form-check-input h-20px w-20px'
                  type='radio'
                  value={'true'}
                  id='property'
                  checked={isProperty}
                  onChange={() => setIsProperty(true)}
                />
                <strong>Propriedade</strong>
              </label>
              <label htmlFor='city' className='form-check-label'>
                <input
                  className='form-check-input h-20px w-20px'
                  type='radio'
                  value={'true'}
                  id='city'
                  checked={!isProperty}
                  onChange={() => setIsProperty(false)}
                />
                <strong>Município</strong>
              </label>
            </div>
            <div className='card-body d-flex flex-column justify-content-around my-8  '>
              {isProperty ? (
                <>
                  <RegisterFormModelInput
                    label={'Nome'}
                    placeholder='Digite o nome'
                    type='text'
                    touched={undefined}
                    errors={undefined}
                    fieldProps={{
                      value: name,
                      name: 'name',
                      onBlur: () => {},
                      onChange: (input: any) => {
                        setName(input.target.value)
                      },
                    }}
                  />
                  <RegisterFormModelInput
                    label={'CPF'}
                    placeholder='Digite o CPF'
                    type='text'
                    touched={undefined}
                    errors={undefined}
                    mask={masks.cpf}
                    fieldProps={{
                      value: document,
                      name: 'document',
                      onBlur: () => {},
                      onChange: (input: any) => {
                        setDocument(input.target.value)
                      },
                    }}
                  />
                  <RegisterFormModelInput
                    label={'CIB'}
                    placeholder='Digite o CIB'
                    type='text'
                    touched={undefined}
                    errors={undefined}
                    mask={masks.cib}
                    fieldProps={{
                      value: cib,
                      name: 'cib',
                      onBlur: () => {},
                      onChange: (input: any) => {
                        setCib(input.target.value)
                      },
                    }}
                  />
                </>
              ) : (
                <RegisterFormModelInput
                  label={'Ano'}
                  placeholder='YYYY'
                  type='number'
                  touched={undefined}
                  errors={undefined}
                  fieldProps={{
                    value: year,
                    name: 'year',
                    onBlur: () => {},
                    onChange: (input: any) => {
                      setYear(input.target.value > 9999 ? 9999 : input.target.value)
                    },
                  }}
                />
              )}
            </div>
            <ModalErrorFooter
              error={error}
              modalFooter={
                <CustomButton
                  label='Iniciar Exportação'
                  isLoading={isLoading}
                  disabled={isLoading || isProperty ? !name && !document && !cib : !year}
                  onSubmit={saveExport}
                />
              }
            />
          </>
        }
      />
    </div>
  ) : null
}
