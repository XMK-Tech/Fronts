import {useEffect, useState} from 'react'
import {ImportButton} from '../../../components/ImportButton'
import Table, {TablePropsRows} from '../../components/Table/Table'
import {mapContent} from '../../components/Table/TableHead'
import {getProprieties, ProprietyType} from '../../services/ProprietyApi'
import EmptyStateList from '../../utils/components/EmptyStateList'
import IsLoadingList from '../../utils/components/IsLoadingList'
import {CustomSearchFilter, useFilter} from '../auth/components/AdminSearchFilter'
import {TablePagination, usePagination} from '../auth/components/TablePagination'
import ITRCultureManagementModal from './Components/ITRCultureManagementModal'
import ITRModalHerds from './Components/ITRModalHerds'
import {convertNumberToStringValue} from '../../utils/functions/masks'
import ModeloModal, {ModalErrorFooter} from '../../utils/components/ModeloModal'
import {CustomButton} from '../../components/CustomButton/CustomButton'
import {RegisterFormModelInput} from '../../../components/RegisterFormModel'
import {masks} from '../../components/Form/FormInput'
import {CustomDropdown} from './CustomDropdown'
import {getExportProperty} from '../../services/FiscalProcedureApi'

const PropietyListTable: React.FC<TablePropsRows> = (props) => {
  return (
    <Table
      headColumns={mapContent([
        'CIB',
        'Cidade',
        'INSCRIÇÃO MUNICIPAL',
        'NOME',
        'MUNICÍPIO',
        'ÁREA DECLARADA',
        'AÇÕES',
      ])}
      rows={props.rows}
    />
  )
}

type PropertyConsultPageProps = {
  type: number
}
export default function PropertyConsultPage(props: PropertyConsultPageProps) {
  const options = [
    {value: 'cib', label: 'CIB'},
    {value: 'year', label: 'Ano'},
    {value: 'name', label: 'Nome'},
    {value: 'cityName', label: 'Múnicipio'},
  ]
  const {selectedOption, setSelectedOption, searchText, setSearchText} = useFilter(options)
  const {pageSize, selectedPage, setSelectedPage, setSize, size} = usePagination()
  function onSelectedPageChanged(page: number) {
    setSelectedPage(page)
  }
  const [listIsLoading, setListIsLoading] = useState(false)
  const [proprietys, setProprietys] = useState<ProprietyType[]>([])
  const [showModalHerds, setShowModalHerds] = useState(false)
  const [showModalCultureDeclaration, setShowModalCultureDeclaration] = useState(false)
  const [getPropertyId, setGetPropertyId] = useState('')
  const [showModalLaudo, setShowModalLaudo] = useState(false)
  const [error, setError] = useState<{message: any} | null>(null)
  const [isLoadingReport, setIsLoadingReport] = useState(false)
  const [nameReport, setNameReport] = useState('')
  const [cpfReport, setCpfReport] = useState('')
  const [cibReport, setCibReport] = useState('')
  useEffect(() => {
    setListIsLoading(true)
    getProprieties(searchText, selectedOption?.value, selectedPage)
      .then((res) => {
        setProprietys(res.data)
        setSize(res.metadata.dataSize)
      })
      .finally(() => setListIsLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPage, size, searchText, selectedOption])

  const proprietysList = proprietys.map((e) => ({
    columns: mapContent([
      e.cibNumber,
      e.address?.cityName,
      e.municipalRegistration,
      e.name,
      e.address?.cityName,
      convertNumberToStringValue(e.declaredArea),
    ]),
    detailsColumn: [
      {
        content: 'Ajuste de Rebanho',
        className: 'btn-primary ',
        buttonAction: () => {
          setGetPropertyId(e.id || '')
          setShowModalHerds(!showModalHerds)
        },
      },
      {
        content: 'Gestão de Propriedades',
        className: 'btn-primary mx-2',

        buttonAction: () => {
          console.log(getPropertyId)
          setGetPropertyId(e.id || '')
          setShowModalCultureDeclaration(!showModalCultureDeclaration)
        },
      },
      {
        content: 'Detalhes',
        className: 'btn-primary',
        buttonAction: () => {},
        href: '/ITR/ITRMainPage/DetailsProperty/' + e.id,
        useRouterLink: true,
      },
      {
        content: 'Gerar laudo',
        className: 'btn-primary mx-2',
        buttonAction: () => {
          setCibReport(e.cibNumber)
          setShowModalLaudo(true)
        },
        // href: '/ITR/RegisterBareLand',
        // useRouterLink: true,
      },
    ],
  }))
  const saveExport = async () => {
    setIsLoadingReport(true)
    setError({message: ''})
    try {
      await getExportProperty({
        name: nameReport,
        document: cpfReport,
        cib: cibReport,
        AllProprieties: false,
      })
    } catch (err) {
      setError({message: err})
    } finally {
      setIsLoadingReport(false)
    }
  }
  return (
    <>
      <div className='card'>
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bolder fs-3 mb-1'>Imóveis</span>
          </h3>
          <div className='d-flex'>
            <ImportButton type='propriety' />
            <CustomSearchFilter
              onOptionSelected={(option) => setSelectedOption(option)}
              options={options}
              selectedOption={selectedOption}
              onTextChanged={(text) => setSearchText(text)}
              text={searchText}
            ></CustomSearchFilter>
          </div>
        </div>
        {listIsLoading ? (
          <IsLoadingList />
        ) : (
          <div className='card-body py-3'>
            {proprietysList.length > 0 ? (
              <div className='table-responsive w-100'>
                <PropietyListTable rows={proprietysList} />
              </div>
            ) : (
              <EmptyStateList />
            )}
          </div>
        )}
        {!!proprietysList.length && (
          <TablePagination
            onSelectedPageChanged={onSelectedPageChanged}
            selectedPage={selectedPage}
            arrayLength={size}
            maxPageItens={pageSize}
          ></TablePagination>
        )}
        <ITRModalHerds
          id={getPropertyId}
          onHide={() => setShowModalHerds(!showModalHerds)}
          show={showModalHerds}
        ></ITRModalHerds>
        <ITRCultureManagementModal
          onHide={() => setShowModalCultureDeclaration(!showModalCultureDeclaration)}
          show={showModalCultureDeclaration}
          id={getPropertyId}
        />
        <ModeloModal
          size='xl'
          show={showModalLaudo}
          onHide={() => {
            setShowModalLaudo(false)
            setError({message: ''})
          }}
          title={
            <div className='d-flex align-items-center justify-content-between'>
              <div>Gerar Laudo</div>
            </div>
          }
          body={
            <div className='d-flex flex-column'>
              <div>Digite seu nome e cpf para gerar o laudo da propriedade</div>
              <div className='card-body d-flex flex-column justify-content-around my-8  '>
                <RegisterFormModelInput
                  label={'Nome'}
                  placeholder='Digite o nome'
                  type='text'
                  touched={undefined}
                  errors={undefined}
                  fieldProps={{
                    value: nameReport,
                    name: 'name',
                    onBlur: () => {},
                    onChange: (input: any) => {
                      setNameReport(input.target.value)
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
                    value: cpfReport,
                    name: 'document',
                    onBlur: () => {},
                    onChange: (input: any) => {
                      setCpfReport(input.target.value)
                    },
                  }}
                />
                {/* <RegisterFormModelInput
                            label={'CIB'}
                            placeholder='Digite o CIB'
                            type='text'
                            touched={undefined}
                            errors={undefined}
                            mask={masks.cib}
                            fieldProps={{
                              value: 'cib',
                              name: 'cib',
                              onBlur: () => {},
                              onChange: (input: any) => {
                                // setCib(input.target.value)
                              },
                            }}
                          /> */}
              </div>
            </div>
          }
          footer={
            <ModalErrorFooter
              error={error}
              modalFooter={
                <CustomButton
                  label='Gerar Laudo'
                  isLoading={isLoadingReport}
                  disabled={isLoadingReport}
                  onSubmit={() => {
                    saveExport()
                  }}
                />
              }
            />
          }
        ></ModeloModal>
      </div>
    </>
  )
}
