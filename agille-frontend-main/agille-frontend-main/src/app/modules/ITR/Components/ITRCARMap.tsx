import {GeoJSON} from 'leaflet'
import {useEffect, useState} from 'react'
import {
  MapContainer,
  TileLayer,
  LayersControl,
  GeoJSON as GeoJSONComponent,
  useMap,
} from 'react-leaflet'
import shp, {FeatureCollectionWithFilename, ShpJSBuffer} from 'shpjs'
import {FormError} from '../../../../components/FormError'
import {getProprietyCar, ProprietyCarType} from '../../../services/ProprietyApi'
import {formatArea} from '../../../utils/functions'

type ShapeFileProps = {
  data: string | ShpJSBuffer
  style: any
  onEachFeature: (feature: any, layer: any) => void
  car?: string
  onError: (error: any) => void
}

const ShapeFile = (props: ShapeFileProps) => {
  const [geoJSONData, setGeoJSONData] = useState<
    FeatureCollectionWithFilename | FeatureCollectionWithFilename[] | null
  >(null)
  const {data, ...geoJSONProps} = props

  useEffect(() => {
    const parseData = async () => setGeoJSONData(await shp(props.data))

    parseData().catch((err) => props.onError(err))
  }, [props.data])
  //@ts-ignore
  return <GeoJSONComponent key={Math.random()} data={geoJSONData} {...geoJSONProps} />
}

const {BaseLayer, Overlay} = LayersControl

type CarMapProps = {
  zoom?: number
  url: string
  center: CenterType | null
  cityMapUrl?: string
}
export type CenterType = [number, number]
const defaultCenter: CenterType = [-26.9052599, -48.7640237]
function ChangeView({center, zoom}: {center: CenterType; zoom?: number}) {
  const map = useMap()
  map.setView(center, zoom)
  return null
}
export default function CarMap(props: CarMapProps) {
  const [geodata, setGeodata] = useState<string | ShpJSBuffer | null>(null)
  const [cityMap, setCityMap] = useState<GeoJSON.Feature | GeoJSON.FeatureCollection | null>(null)
  const center = props.center
  const [error, setError] = useState<string | null>(null)
  function handleFile(e: any) {
    var reader = new FileReader()
    var file = e.target.files[0]
    reader.readAsArrayBuffer(file)
    reader.onload = function (buffer) {
      setGeodata(buffer.target?.result ?? null)
    }
  }

  useEffect(() => {
    setError(null)
    props.url &&
      fetch(props.url)
        .then((res) => res.arrayBuffer())
        .then((buffer) => setGeodata(buffer))
        .catch((err) => setError(err.message))
  }, [props.url])
  useEffect(() => {
    setError(null)
    props.cityMapUrl &&
      fetch(props.cityMapUrl)
        .then((res) => res.json())
        .then((buffer) => setCityMap(buffer))
        .catch((err) => setError(err.message))
  }, [props.cityMapUrl])

  function onEachFeature(feature: any, layer: any) {
    if (feature.properties) {
      const carNumber = feature.properties.COD_IMOVEL
      layer.bindPopup(buildPopupFields(carNumber, listProprietyCar), {
        maxHeight: 300,
        maxWidth: 500,
      })
    }
  }

  function style() {
    return {
      weight: 2,
      opacity: 1,
      color: 'blue',
      dashArray: '3',
      fillOpacity: 0.7,
    }
  }

  let ShapeLayers = null
  if (geodata !== null) {
    ShapeLayers = (
      <Overlay checked name='Feature group'>
        <ShapeFile
          onError={(_err) => {
            setError('Erro ao carregar arquivo. Tente novamente com outro arquivo')
          }}
          data={geodata}
          style={style}
          onEachFeature={onEachFeature}
        />
      </Overlay>
    )
  }
  const [listProprietyCar, setListProprietyCar] = useState<ProprietyCarType[]>([])
  useEffect(() => {
    getProprietyCar().then((res) => setListProprietyCar(res.data))
  }, [])

  return (
    <div className='h-100 p-2'>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          zIndex: 2,
        }}
      >
        <FormError status={error ? {message: error} : null} />
      </div>
      {!!center && (
        <MapContainer
          style={{
            overflow: 'hidden',
            height: '100%',
          }}
          center={center || defaultCenter}
          zoom={props.zoom || 11}
          zoomControl={true}
        >
          <LayersControl position='topleft'>
            <BaseLayer checked name='OpenStreetMap.Mapnik'>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              />
            </BaseLayer>
            {cityMap && (
              <Overlay checked name='Limites'>
                <GeoJSONComponent
                  data={cityMap}
                  style={{
                    weight: 2.5,
                    opacity: 1,
                    color: 'red',
                    dashArray: '1',
                    fillOpacity: 0,
                    fillColor: 'white',
                  }}
                />
              </Overlay>
            )}
            {ShapeLayers}
          </LayersControl>
        </MapContainer>
      )}
    </div>
  )
}

function buildPopupFields(
  carNumber: string | undefined,
  propertiesList: ProprietyCarType[]
): string {
  const listProperties = propertiesList.find((property) => property.car === carNumber)
  if (listProperties?.declarations) {
    return [
      '<b>' + carNumber + '</b>',
      'CIB: ' + listProperties?.cib,
      'Proprietário: ' + listProperties?.declarations.owner ?? '',
      '<b>' + 'Declarações' + '</b>',
      'Área Total: ' + formatArea(listProperties?.declarations.total ?? 0),
      'Área de Preservação: ' +
        formatArea(listProperties?.declarations.permanentPreservationArea ?? 0),
      'Área de Reserva: ' + formatArea(listProperties?.declarations.legalReserveArea ?? 0),
      'Área tributável: ' + formatArea(listProperties?.declarations.taxableArea ?? 0),
      'Área com Bendeitorias: ' +
        formatArea(listProperties?.declarations.areaOccupiedWithWorks ?? 0),
      'Área Aproveitável: ' + formatArea(listProperties?.declarations.usableArea ?? 0),
      'Área com Reflorestamento: ' +
        formatArea(listProperties?.declarations.areaWithReforestation ?? 0),
      'Área Utilizada: ' + formatArea(listProperties?.declarations.areaUsedInRuralActivity ?? 0),
      'Mais informações aqui: ' +
        `<a target="_blank" href="ITRMainPage/DetailsProperty/${listProperties?.id}">Link</a>`,
    ].join('<br/>')
  }
  if (listProperties?.car === carNumber) {
    return [
      '<b>' + carNumber + '</b>',
      'CIB: ' + listProperties?.cib,
      'Nome do Imóvel: ' + (listProperties?.name ?? ''),
      'Nome do Proprietário: ' + (listProperties?.owner ?? ''),
      '<b>Essa propriedade não possui declarações</b>',
      'Mais informações aqui: ' +
        `<a target="_blank" href="ITRMainPage/DetailsProperty/${listProperties?.id}">Link</a>`,
    ].join('<br/>')
  } else {
    return ['<b>' + carNumber + '</b>'].join('<br/>')
  }
}
