import {useEffect, useState} from 'react'
import {ImportButton} from '../../../components/ImportButton'
import Table, {TablePropsRows} from '../../components/Table/Table'
import {mapContent} from '../../components/Table/TableHead'
import {getProprieties, getPropriety, ProprietyType} from '../../services/ProprietyApi'
import EmptyStateList from '../../utils/components/EmptyStateList'
import IsLoadingList from '../../utils/components/IsLoadingList'
import {CustomSearchFilter, useFilter} from '../auth/components/AdminSearchFilter'
import {TablePagination, usePagination} from '../auth/components/TablePagination'
import ITRCultureManagementModal from './Components/ITRCultureManagementModal'
import ITRModalHerds from './Components/ITRModalHerds'
import {convertNumberToStringValue} from '../../utils/functions/masks'
import ModeloModal, {ModalErrorFooter} from '../../utils/components/ModeloModal'
import {CustomButton} from '../../components/CustomButton/CustomButton'
import {getExportProperty} from '../../services/FiscalProcedureApi'
import * as V from 'victory'
import {getBareLand} from '../../services/DeclarationApi'

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
          setGetPropertyId(e.id || '')
          setShowModalLaudo(true)
          setCpfReport('')
          setNameReport('')
        },
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
          size='lg'
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
            <div className='d-flex justify-content-center align-items-center '>
              <div className='d-flex flex-column'>
                <h3>Dados do laudo </h3>
                <DashboardPieComponente proprietyId={getPropertyId} />
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
export function DashboardPieComponente(props: {proprietyId: string}) {
  const [goodAptitudeValueHa, setGoodAptitudeValueHa] = useState(0)
  const [regularAptitudeValueHa, setRegularAptitudeValueHa] = useState(0)
  const [restrictedFitnessValueHa, setRestrictedFitnessValueHa] = useState(0)
  const [plantedPasturesValueHa, setPlantedPasturesValueHa] = useState(0)
  const [forestryOrNaturalPastureValueHa, setForestryOrNaturalPastureValueHa] = useState(0)
  const [preservationOfFaunaOrFloraValueHa, setPreservationOfFaunaOrFloraValueHa] = useState(0)
  const [proprietyId, setProprietyId] = useState<ProprietyType>()

  useEffect(() => {
    getPropriety(props.proprietyId).then((res) => {
      setProprietyId(res.data)
    })
    getBareLand('2024').then((res) => {
      setGoodAptitudeValueHa(res.data.goodAptitude)
      setRegularAptitudeValueHa(res.data.regularAptitude)
      setRestrictedFitnessValueHa(res.data.restrictedFitness)
      setPlantedPasturesValueHa(res.data.plantedPastures)
      setForestryOrNaturalPastureValueHa(res.data.forestryOrNaturalPasture)
      setPreservationOfFaunaOrFloraValueHa(res.data.preservationOfFaunaOrFlora)
    })
  }, [])
  const goodAptitudeValueQnt = (proprietyId?.goodSuitabilityFarming || 0) * goodAptitudeValueHa
  const regularAptitudeValueQnt = (proprietyId?.regularFitnessFarming || 0) * regularAptitudeValueHa
  const restrictedFitnessQnt =
    (proprietyId?.restrictedAptitudeFarming || 0) * restrictedFitnessValueHa
  const plantedPasturesQnt = (proprietyId?.plantedPasture || 0) * plantedPasturesValueHa

  const forestryOrNaturalPastureQnt =
    ((proprietyId?.reforestation || 0) + (proprietyId?.permanentPreservation || 0)) *
    forestryOrNaturalPastureValueHa
  const preservationOfFaunaOrFloraQnt =
    ((proprietyId?.busyWithImprovements || 0) + (proprietyId?.reforestation || 0)) *
    preservationOfFaunaOrFloraValueHa
  const totalArea =
    goodAptitudeValueQnt +
    regularAptitudeValueQnt +
    restrictedFitnessQnt +
    plantedPasturesQnt +
    forestryOrNaturalPastureQnt +
    preservationOfFaunaOrFloraQnt

  const percentageGoodAptitude = (goodAptitudeValueQnt / totalArea) * 100
  const percentageRegularAptitudeValue = (regularAptitudeValueQnt / totalArea) * 100
  const percentageRestrictedFitness = (restrictedFitnessQnt / totalArea) * 100
  const percentagePlantedPastures = (plantedPasturesQnt / totalArea) * 100
  const percentageForestryOrNaturalPasture = (forestryOrNaturalPastureQnt / totalArea) * 100
  const percentagePreservationOfFaunaOrFlora = (preservationOfFaunaOrFloraQnt / totalArea) * 100

  const data = [
    {
      x: 'Lavoura Aptidão Boa',
      y: percentageGoodAptitude.toFixed(2),
    },
    {x: 'Lavoura Aptidão Regular', y: percentageRegularAptitudeValue.toFixed(2)},
    {x: 'Lavoura Aptidão Restrita', y: percentageRestrictedFitness.toFixed(2)},
    {x: 'Pastagem Plantada', y: percentagePlantedPastures.toFixed(2)},
    {x: 'Silvicultura ou Pastagem Natural', y: percentageForestryOrNaturalPasture.toFixed(2)},
    {x: 'Preservação da Fauna ou Flora', y: percentagePreservationOfFaunaOrFlora.toFixed(2)},
  ]
  const itemColor = ['#0FC2C0', '#4C5958', '#008F8C', '#015958', '#023535', '#8AA6A3']

  console.log(percentageForestryOrNaturalPasture)
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
            labels={data.map((e) => e.y.toString())}
            style={{labels: {fontSize: 20, fill: 'white'}}}
          />
          <V.VictoryLabel textAnchor='middle' style={{fontSize: 20}} x={200} y={200} text='' />
        </svg>
      </div>
      <div>
        <div>
          {data.map((e, i) => (
            <div className='d-flex align-items-center mb-8'>
              <div
                style={{
                  width: 12,
                  height: 12,
                  backgroundColor: itemColor[i],
                  marginRight: 12,
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
