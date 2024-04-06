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
import {getExportProperty} from '../../services/FiscalProcedureApi'
import * as V from 'victory'

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
        content: 'Laudo',
        className: 'btn-primary mx-2',
        buttonAction: () => {
          setCibReport(e.cibNumber)
          setShowModalLaudo(true)
          setCpfReport('')
          setNameReport('')
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
              <div>Laudo</div>
            </div>
          }
          body={
            <div className='d-flex justify-content-around'>
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
                </div>
              </div>
              <div className='d-flex flex-column'>
                <div>Dados do laudo </div>
                <DashboardPieComponente />
              </div>
            </div>
          }
          footer={
            <ModalErrorFooter
              error={error}
              modalFooter={
                <CustomButton
                  label='Gerar Laudo (PDF)'
                  isLoading={isLoadingReport}
                  disabled={isLoadingReport || nameReport.length < 0 || cpfReport.length < 11}
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
export function DashboardPieComponente() {
  const data = [
    {x: 'Lavoura Aptidão Boa', y: 10},
    {x: 'Lavoura Aptidão Regular', y: 20},
    {x: 'Lavoura Aptidão Restrita', y: 30},
    {x: 'Pastagem Plantada', y: 20},
    {x: 'Silvicultura ou Pastagem Natural', y: 10},
    {x: 'Preservação da Fauna ou Flora', y: 10},
  ]
  const itemColor = ['#0FC2C0', '#4C5958', '#008F8C', '#015958', '#023535', '#8AA6A3']
  return (
    <div className='d-flex align-items-center'>
      <div style={{width: 300, height: 300}}>
        <svg viewBox='0 0 400 400'>
          <V.VictoryPie
            colorScale={['#0FC2C0', '#4C5958', '#008F8C', '#015958', '#023535', '#8AA6A3']}
            standalone={false}
            width={400}
            height={400}
            data={data}
            innerRadius={68}
            labelRadius={100}
            labels={data.map((e) => e.y)}
            style={{labels: {fontSize: 20, fill: 'white'}}}
          />
          <V.VictoryLabel textAnchor='middle' style={{fontSize: 20}} x={200} y={200} text='' />
        </svg>
      </div>
      <div>
        <div>
          {data.map((e, i) => (
            <div className='d-flex align-items-center mb-4'>
              <div
                style={{
                  width: 8,
                  height: 8,
                  backgroundColor: itemColor[i],
                  marginRight: 8,
                  borderRadius: '50%',
                }}
              ></div>
              <div>
                {e.x} - {e.y}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
