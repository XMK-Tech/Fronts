import {persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import {put, takeLatest} from 'redux-saga/effects'
import {takeFirstIfOnly} from '../../../utils/functions'
import {UserModel} from '../models/UserModel'
import {
  Permission,
  Module,
  IAuthState,
  initialAuthState,
  ActionWithPayload,
  actionTypes,
} from './AuthTypes'
import {getUserByToken} from './AuthCRUD'

export function getAvailableModules(permissions: Permission[] | undefined): Module[] {
  if (!permissions) return []
  const moduleList = Object.keys(Module)
  return permissions
    .map((permission) => permission.name as Module)
    .filter((name) => moduleList.includes(name))
    .filter((value, index, self) => self.indexOf(value) === index)
}

export const reducer = persistReducer(
  {
    storage,
    key: 'v100-demo2-auth',
    whitelist: [
      'user',
      'accessToken',
      'selectedModule',
      'permission',
      'franchises',
      'entities',
      'selectedFranchise',
      'selectedEntity',
      'permissions',
      'modules',
    ],
  },
  (state: IAuthState = initialAuthState, action: ActionWithPayload<IAuthState>) => {
    switch (action.type) {
      case actionTypes.Login: {
        const accessToken = action.payload?.accessToken
        const modules = getAvailableModules(action.payload?.permissions)
        const selectedModule = takeFirstIfOnly(modules)
        const selectedFranchise = takeFirstIfOnly(action.payload?.franchises)
        const selectedEntity = takeFirstIfOnly(action.payload?.entities)

        return {
          accessToken,
          permission: action.payload?.permissions,
          user: undefined,
          selectedModule: selectedModule,
          modules: modules,
          franchises: action.payload?.franchises,
          entities: action.payload?.entities,
          selectedFranchise: selectedFranchise,
          selectedEntity,
        }
      }

      case actionTypes.SelectModule: {
        const selectedModule = action.payload?.selectedModule
        return {...state, selectedModule: selectedModule}
      }

      case actionTypes.Register: {
        const accessToken = action.payload?.accessToken
        return {accessToken, user: undefined, selectedModule: undefined}
      }

      case actionTypes.Logout: {
        return initialAuthState
      }

      case actionTypes.UserRequested: {
        return {...state, user: undefined}
      }

      case actionTypes.UserLoaded: {
        const user = action.payload?.user
        return {...state, user}
      }

      case actionTypes.SetUser: {
        const user = action.payload?.user
        return {...state, user}
      }
      case actionTypes.SelectEntity: {
        const selectedEntity = action.payload?.selectedEntity
        return {...state, selectedEntity}
      }

      default:
        return state
    }
  }
)

export const actions = {
  login: (
    accessToken: string,
    permissions: Permission[],
    franchises: string[],
    entities: string[]
  ) => ({
    type: actionTypes.Login,
    payload: {accessToken, permissions, franchises, entities},
  }),
  register: (accessToken: string) => ({
    type: actionTypes.Register,
    payload: {accessToken},
  }),
  logout: () => ({type: actionTypes.Logout}),
  requestUser: () => ({
    type: actionTypes.UserRequested,
  }),
  fulfillUser: (user: UserModel) => ({type: actionTypes.UserLoaded, payload: {user}}),
  setUser: (user: UserModel) => ({type: actionTypes.SetUser, payload: {user}}),
  setModule: (module: Module) => ({
    type: actionTypes.SelectModule,
    payload: {selectedModule: module},
  }),
  selectEntity: (entity: string) => ({
    type: actionTypes.SelectEntity,
    payload: {selectedEntity: entity},
  }),
}

export function* saga() {
  yield takeLatest(actionTypes.Login, function* loginSaga() {
    yield put(actions.requestUser())
  })

  yield takeLatest(actionTypes.Register, function* registerSaga() {
    yield put(actions.requestUser())
  })

  yield takeLatest(actionTypes.UserRequested, function* userRequested() {
    const {data: user} = yield getUserByToken()
    yield put(actions.fulfillUser(user))
  })
}
