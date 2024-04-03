import {GoogleMap, useJsApiLoader, Polygon, Marker} from '@react-google-maps/api'
import {useCallback, useEffect, useState} from 'react'
import {RegisterFormModelColumn} from '../../../components/RegisterFormModel'

import EmptyStateList from '../../utils/components/EmptyStateList'
import ModeloModal from '../../utils/components/ModeloModal'
import {CustomButton} from '../CustomButton/CustomButton'
import Table from '../Table/Table'
import {mapContent} from '../Table/TableHead'

const containerStyle = {
  width: '100%',
  height: '500px',
}
const mapsApiKey = 'AIzaSyCPwmoziyB4HJqVz0TDv1IJ_z2r898ZjFc'

export type DrawMapPoint = google.maps.LatLngLiteral
export type DrawMapProps = {
  list?: boolean
  points: DrawMapPoint[]
  onPointsChanged?: (points: DrawMapPoint[]) => void
}

export function useDrawPoints() {
  const [points, onPointsChanged] = useState<google.maps.LatLngLiteral[]>([])
  return {
    points,
    onPointsChanged,
  }
}

const center = {
  lat: -26.9671651,
  lng: -48.885254,
}

function Drawing(props: {points: DrawMapPoint[]; onClick: any}) {
  return props.points.length === 1 ? (
    <Marker position={props.points[0]} />
  ) : (
    <Polygon path={props.points} onClick={props.onClick} />
  )
}

export function textToCoordinates(text: string): DrawMapPoint[] {
  // Dividir as linhas (\n)
  const lines = text.split('\n')
  // Montar as coordenadas a partir da linha
  const coordinates = lines.map((line) => {
    const [lat, lng] = line.split(';')
    return {
      lat: parseFloat(lat.replace(',', '.')),
      lng: parseFloat(lng.replace(',', '.')),
    }
  })
  if (coordinates.every((c) => !isNaN(c.lat) && !isNaN(c.lng))) {
    return coordinates
  }
  throw new Error('Coordenadas inválidas')
}

export default function DrawMap(props: DrawMapProps) {
  const [editingPoint, setEditingPoint] = useState<DrawMapPoint | null>(null)
  const {points, onPointsChanged} = props
  //TODO: Change API Key
  const {isLoaded} = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: mapsApiKey,
  })
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [importText, setImportText] = useState<string>('')
  const [importError, setImportError] = useState('')
  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map)
  }, [])
  const onUnmount = useCallback(function callback(_map) {
    setMap(null)
  }, [])
  const handleClick = (e: google.maps.MapMouseEvent): void => {
    const literal = e.latLng?.toJSON()
    if (literal) {
      setEditingPoint(literal)
      onPointsChanged?.([...points, literal])
    }
  }
  const pointsList = points.map((e, i) => ({
    columns: mapContent([
      <span className='text-start'>
        {e.lat.toFixed(3)}, {e.lng.toFixed(3)}
      </span>,
    ]),

    detailsColumn: [
      {
        content: <i className='fas fa-pen p-0'></i>,
        className: 'btn-warning me-2',

        buttonAction: () => setEditingPoint(e),
      },
      {
        content: <i className='fas fa-trash p-0'></i>,
        className: 'btn-danger me-2',

        buttonAction: () => {
          const filtered = points.filter((p) => !comparePoints(p, e))
          if (!filtered.find((p) => comparePoints(p, editingPoint))) {
            setEditingPoint(null)
          }
          onPointsChanged?.(filtered)
        },
      },
    ],
  }))

  useEffect(() => {
    if (showModal) {
      setEditingPoint(null)
    }
  }, [showModal])

  return isLoaded ? (
    <>
      <GoogleMap
        options={{
          zoom: 11,
          draggableCursor: 'crosshair',
        }}
        mapContainerStyle={containerStyle}
        onLoad={onLoad}
        onUnmount={onUnmount}
        center={center}
        onClick={handleClick}
      >
        <EditForm
          onSubmit={(p) => {
            setEditingPoint({
              lat: p.lat,
              lng: p.lng,
            })
            const newPoints = points.map((e) => (comparePoints(e, editingPoint) ? p : e))
            onPointsChanged?.(newPoints)
            setEditingPoint(null)
          }}
          point={editingPoint}
        />
        <Drawing onClick={handleClick} points={points} />
      </GoogleMap>
      {props.list && (
        <div className='d-flex flex-column align-items-center'>
          <CustomButton
            margin='4'
            isLoading={false}
            label='Importar Cordenadas'
            onSubmit={() => setShowModal(true)}
          ></CustomButton>
          <div className='w-350px mh-500px overflow-auto'>
            {points.length > 0 ? (
              <>
                <Table headColumns={mapContent(['Coordenada', 'Ações'])} rows={pointsList}></Table>
              </>
            ) : (
              <div className='d-flex justify-content-center algin-items-center'>
                <EmptyStateList text='Sua lista esta vazia para visualizar clique no mapa' />
              </div>
            )}
          </div>
        </div>
      )}
      <ModeloModal
        onHide={() => setShowModal(!showModal)}
        show={showModal}
        title={'Importações de Cordenadas'}
        body={
          <div className='d-flex flex-column align-items-center p-8'>
            <span className='text-muted'>
              Você pode colar as coordenadas no campo abaixo, conforme o exemplo:
              <div className='m-2'>
                -26,889; -48,789
                <br /> -26,909; -48,844
                <br />
              </div>
              Ao aplicar, as coordenadas inseridas anteriormente serão removidas
            </span>
            {importError && (
              <div className='mb-lg-15 alert alert-danger'>
                <div className='alert-text font-weight-bold'>{importError}</div>
              </div>
            )}
            <RegisterFormModelColumn>
              <div className='py-3'>
                <strong className=''>Coordenadas</strong>
                <textarea
                  className=' h-150px w-400px shadow form-control'
                  placeholder='Insira as observações'
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                />
              </div>
              <div className='py-3'></div>
            </RegisterFormModelColumn>
            <CustomButton
              label='Aplicar'
              isLoading={false}
              onSubmit={() => {
                try {
                  props.onPointsChanged?.(textToCoordinates(importText))
                  setImportError('')
                  setShowModal(false)
                } catch (err: any) {
                  setImportError(err.message)
                }
              }}
            ></CustomButton>
          </div>
        }
      ></ModeloModal>
    </>
  ) : null
}

function comparePoints(a: google.maps.LatLngLiteral | null, b: google.maps.LatLngLiteral | null) {
  return a?.lat === b?.lat && a?.lng === b?.lng
}

function EditForm(props: {point: DrawMapPoint | null; onSubmit: (point: DrawMapPoint) => void}) {
  const [pointState, setPointState] = useState<{
    lat?: string
    lng?: string
  } | null>(null)
  const createChangePointHandler =
    (type: 'lat' | 'lng') => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      if (value) {
        setPointState({
          ...(pointState || {}),
          [type]: value,
        })
      }
    }

  useEffect(() => {
    if (props.point) {
      setPointState({
        lat: props.point.lat.toString(),
        lng: props.point.lng.toString(),
      })
    } else {
      setPointState(null)
    }
  }, [props.point])
  const {point} = props
  return point ? (
    <div className='position-absolute d-flex flex-column align-items-center justify-contet-center w-210px m-3 mt-20 card card-body'>
      <input
        onChange={createChangePointHandler('lat')}
        value={pointState?.lat}
        className='form-control m-2'
        type={'text'}
      />
      <input
        onChange={createChangePointHandler('lng')}
        value={pointState?.lng}
        type={'text'}
        className='form-control m-2'
      />
      <CustomButton
        isLoading={false}
        label='Salvar'
        margin='2'
        onSubmit={() => {
          if (pointState?.lat && pointState?.lng) {
            props.onSubmit({
              lat: parseFloat(pointState.lat),
              lng: parseFloat(pointState.lng),
            })
          }
        }}
      />
    </div>
  ) : null
}
