// Hooks

import {useEffect, useState} from 'react'
import {shallowEqual, useDispatch, useSelector} from 'react-redux'
import {actions} from '../../app/modules/auth'
import {Module} from '../../app/modules/auth/redux/AuthTypes'
import {selectEntities} from '../../app/services/EntitiesApi'
import {RootState} from './RootReducer'

export const useModules = () =>
  useSelector<RootState, Module[] | undefined>(({auth}) => auth.modules, shallowEqual)

export const useSelectedModule = () =>
  useSelector<RootState>(({auth}) => auth.selectedModule, shallowEqual) as Module | undefined

export const useSelectedEntity = () =>
  useSelector<RootState, string | undefined>(({auth}) => auth.selectedEntity, shallowEqual)

export const useEntities = (fetchAll: boolean = false) => {
  const [entities, setEntities] = useState<{id: string; name: string}[]>([])
  useEffect(() => {
    selectEntities(fetchAll).then((res) => setEntities(res.data))
  }, [fetchAll])
  const {changeEntities} = useChangeEntities()

  return {entities, changeEntities}
}

export const useAvailableEntities = () => {
  const {entities: entitiesData} = useEntities(true)
  const availableEntities = useSelector<RootState, string[]>(
    ({auth}) => auth.entities ?? [],
    shallowEqual
  )

  const {changeEntities} = useChangeEntities()

  return {
    entities: availableEntities.map((e) => ({
      id: e,
      name: entitiesData.find((data) => data.id === e)?.name ?? e,
    })),
    changeEntities,
  }
}
export function useChangeEntities() {
  const dispatch = useDispatch()
  const changeEntities = (id: string) => {
    dispatch(actions.selectEntity(id))
  }
  return {changeEntities}
}
