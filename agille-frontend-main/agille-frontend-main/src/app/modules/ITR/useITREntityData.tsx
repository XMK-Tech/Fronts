import {useEffect, useState} from 'react'
import {useSelectedEntity} from '../../../setup/redux/hooks'
import {getEntitiesITRSettingsAcount} from '../../services/EntitiesApi'
import {parseCoordinate} from '../../utils/functions'
import {CenterType} from './Components/ITRCARMap'
import {getEntityGmapsName} from './ITRDashboard'

export function useITREntityData() {
  const entity = useSelectedEntity()
  const [gmapsName, setGmapsName] = useState('')
  const [center, setCenter] = useState<CenterType | null>(null)
  useEffect(() => {
    getEntitiesITRSettingsAcount().then((res) => {
      const itrData = res.data.itr
      setGmapsName(itrData?.gMapsName ?? getEntityGmapsName(entity))
      setCenter((parseCoordinate(itrData?.center) as CenterType) || null)
    })
  }, [entity])

  return {gmapsName, center}
}
