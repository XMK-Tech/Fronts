import {useEffect, useState} from 'react'
import environment from '../../../setup/environment'
import {CustomButton} from '../../components/CustomButton/CustomButton'
import Table from '../../components/Table/Table'
import {mapContent} from '../../components/Table/TableHead'
import {getEntitiesITRSettingsAcount} from '../../services/EntitiesApi'
import {
  getExportActivity,
  getExportAgriculture,
  getExportAnimals,
  getExportFishArea,
  getExportProcedures,
  getFiscalProcedureDashboard,
  TaxProcedureApiTypes,
} from '../../services/FiscalProcedureApi'
import {getProprietyReport, ProprietyReport} from '../../services/ProprietyApi'
import {
  getExportTransfers,
  getUnionTransfersDashboard,
  UnionTransfersDashboard,
} from '../../services/UnionTransfersApi'
import {ModalErrorFooter} from '../../utils/components/ModeloModal'
import {formatAsDate} from '../../utils/functions'
import { IntervalDatePicker} from '../auth/components/DatePicker'
import CarMap from './Components/ITRCARMap'
import {ITRProceduresChart} from './Components/ITRProceduresChart'
import {ITRPropertiesChart, PropertyDashboardData} from './Components/ITRPropertiesChart'
import {ITRUnionTransfersChart} from './Components/ITRUnionTransfersChart'
import {CustomDropdown} from './CustomDropdown'
import {useITREntityData} from './useITREntityData'

type ITRDashboardProps = {
  mapType?: 'satellite' | 'roadmap' | 'hybrid' | 'terrain'
}
const groupConfig = [
  {
    key: '0 até 29,99ha',
    maxValue: 29.99,
  },
  {
    key: '30 até 49,99ha',
    maxValue: 49.99,
  },
  {
    key: '50 até 199,99ha',
    maxValue: 199.99,
  },
  {
    key: '200 até 499,99ha',
    maxValue: 499.99,
  },
  {
    key: '500 até 999,99ha',
    maxValue: 999.99,
  },
  {
    key: '1000 até 4999,99ha',
    maxValue: 4999.99,
  },
  {
    key: '>= 5000ha',
    maxValue: 0,
  },
]

function getGroup(hectare: number) {
  return groupConfig.find(({maxValue}) => hectare < maxValue || !maxValue)!!.key
}

function groupByHectareRange(
  proprieties: ProprietyReport['proprieties'] | undefined
): PropertyDashboardData[] | null {
  if (!proprieties) {
    return null
  }
  const intialReduceValue = {} as {[key: string]: ProprietyReport['proprieties']}
  for (const group of groupConfig) {
    intialReduceValue[group.key] = []
  }
  const grouped = proprieties.reduce((acc, cur) => {
    const hectare = getGroup(cur.hectares)
    if (acc[hectare]) {
      acc[hectare].push(cur)
    } else {
      acc[hectare] = [cur]
    }
    return acc
  }, intialReduceValue)
  return Object.keys(grouped).map((key) => ({
    hectares: key,
    quantityProperty: grouped[key].length,
    quantityFromOtherEntity: grouped[key].filter((p) => !p.hasOwnersFromAnotherEntity).length,
  }))
}

export function getEntityGmapsName(entityId: string | undefined): string {
  if (entityId?.toUpperCase() === '64F81313-0A8D-4D96-9AD6-5F3806FF8EFC') {
    return 'Taquara+-+RS'
  } else {
    return 'Itajaí+-+SC'
  }
}

export default function ITRDashboard(props: ITRDashboardProps) {
  const [table, setTable] = useState(false)
  const {center, } = useITREntityData()
  const [carMapUrl, setCarMapUrl] = useState('')
  //TODO: Armazenar no município
  const [cityMap, setCityMap] = useState('')
  const [proprietiesReport, setProprietiesReport] = useState<ProprietyReport | null>(null)
  const [taxProcedureDashboard, setTaxProcedureDashboard] = useState<TaxProcedureApiTypes | null>(
    null
  )
  const [unionTransfersValues, setUnionTransfersValues] = useState<UnionTransfersDashboard | null>(
    null
  )
  useEffect(() => {
    getProprietyReport().then((res) => setProprietiesReport(res.data))
    getEntitiesITRSettingsAcount().then((res) => {
      setCarMapUrl(res.data?.itr?.carShapeFileUrl ?? '')
      setCityMap(res.data?.itr?.cityLimitsFile ?? '')
    })
    getUnionTransfersDashboard().then((res) => setUnionTransfersValues(res.data))
    getFiscalProcedureDashboard().then((res) => setTaxProcedureDashboard(res.data))
  }, [])
  const grouped = groupByHectareRange(proprietiesReport?.proprieties)
  const list: PropertyDashboardData[] = grouped ?? [
    {hectares: '0 até 29,99', quantityProperty: 1797, quantityFromOtherEntity: 140},
    {hectares: '30 até 49,99', quantityProperty: 164, quantityFromOtherEntity: 140},
    {hectares: '50 até 199,99', quantityProperty: 140, quantityFromOtherEntity: 140},
    {hectares: '200 até 499,99', quantityProperty: 19, quantityFromOtherEntity: 140},
    {hectares: '500 até 999,99', quantityProperty: 4, quantityFromOtherEntity: 140},
    {hectares: '1000 até 4999,99', quantityProperty: 0, quantityFromOtherEntity: 140},
    {hectares: '>= 5000 hs', quantityProperty: 0, quantityFromOtherEntity: 140},
  ]

  const listTable = list.map((e) => ({
    columns: mapContent([e.hectares, e.quantityProperty, e.quantityFromOtherEntity]),
  }))

  const listValues = unionTransfersValues?.itens?.map((e) => ({
    date: `${e.month}/${e.year}`,
    value: e.value,
  }))
  const fullYear = new Date().getFullYear()

  const listProcedures = taxProcedureDashboard?.itens?.map((e) => ({
    date: `${e.month}/${e.year}`,
    value: e.count,
  }))

  return (
    <div className='d-flex flex-column'>
      <div className='d-flex flex-row'>
        <div className='card h-650px w-50 me-5 d-flex flex-column '>
          <div className='card-header'>
            <h3 className='card-title fw-bolder fs-3'>Mapa CAR</h3>
          </div>
          <div className='h-100 card-body pt-0'>
            <CarMap center={center} url={carMapUrl} cityMapUrl={cityMap} zoom={10} />
          </div>
        </div>

        <div className='card w-50 h-650px d-flex flex-column '>
          <div className='card-header'>
            <h3 className='card-title fw-bolder fs-3'>Propriedades por área (hectares)</h3>
            <div className='d-flex align-items-center'>
              <CustomButton
                isLoading={false}
                margin={'0'}
                onSubmit={() => setTable(!table)}
                label={table ? 'Gráfico' : 'Tabela'}
              />
            </div>
          </div>
          <div className='card-body'>
            {table ? (
              <Table
                headColumns={mapContent([
                  'Hectares',
                  'Quantidades de proprietários',
                  'Com proprietários de outro município',
                ])}
                rows={listTable}
              />
            ) : (
              <ITRPropertiesChart data={list} />
            )}
          </div>
        </div>
      </div>
      <ITRUnionTransfersChart
        year={fullYear}
        data={listValues || []}
        total={unionTransfersValues?.totalValue || 0}
        className='w-100 card-xl-stretch my-5'
      />
      <ITRProceduresChart
        data={listProcedures || []}
        total={taxProcedureDashboard?.total || 0}
        className='w-100 card-xl-stretch my-5'
      />
    </div>
  )
}

type ExportaReportButtonProps = {
  type: 'procedures' | 'transfers' | 'activity' | 'agriculture' | 'animals' | 'fish-area'
}
export function ExportReportsButton(props: ExportaReportButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<{message: any} | null>(null)
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  function getTitleExport() {
    if (props.type === 'procedures') {
      return 'Procedimentos'
    }
    if (props.type === 'transfers') {
      return 'Transferências'
    }
    if (props.type === 'activity') {
      return 'Atividade'
    }
    if (props.type === 'animals') {
      return 'Cabeça por Especie'
    }
    if (props.type === 'agriculture') {
      return 'Área de Plantio'
    }
    if (props.type === 'fish-area') {
      return 'Pisciculturas'
    }

    return
  }
  const saveExport = async () => {
    setIsLoading(true)
    try {
      const params = {
        startDate: formatAsDate(startDate),
        endDate: formatAsDate(endDate),
        url: 'http://localhost:3000/api/itr/export-procedures',
      }
      if (props.type === 'procedures') {
        await getExportProcedures(params)
      }
      if (props.type === 'transfers') {
        await getExportTransfers(params)
      }
      if (props.type === 'activity') {
        await getExportActivity(params)
      }
      if (props.type === 'animals') {
        await getExportAnimals(params)
      }
      if (props.type === 'agriculture') {
        await getExportAgriculture(params)
      }
      if (props.type === 'fish-area') {
        await getExportFishArea(params)
      }
    } catch (err) {
      setError({message: err})
    } finally {
      setIsLoading(false)
    }
  }

  return environment.enableReports ? (
    <div className='mx-3'>
      <CustomDropdown
        title={getTitleExport() ?? ''}
        buttonText={`Relatório de ${getTitleExport()}`}
        content={
          <>
            <p className='fw-bolder fs-5 text-center'>
              Selecione o período que deseja para realizar a Exportação
            </p>
            <div className='card-body d-flex flex-row justify-content-around my-8  '>
              <IntervalDatePicker changeEndDate={setEndDate} changeStartDate={setStartDate} />
            </div>
            <ModalErrorFooter
              error={error}
              modalFooter={
                <CustomButton
                  label='Iniciar Exportação'
                  isLoading={isLoading}
                  disabled={isLoading}
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
