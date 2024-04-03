import {actions, getAvailableModules, reducer} from './AuthRedux'
import {initialAuthState, Permission} from './AuthTypes'

const permissions: Permission[] = [
  {
    name: 'Admin',
    entityId: null,
    franchiseId: null,
    isGlobal: false,
  },
  {
    name: 'Backoffice',
    entityId: null,
    franchiseId: null,
    isGlobal: false,
  },
  {
    name: 'Auditor',
    entityId: null,
    franchiseId: null,
    isGlobal: false,
  },
  {
    name: 'ContribuinteDTE',
    entityId: null,
    franchiseId: null,
    isGlobal: false,
  },
]

const defaultState = {
  ...initialAuthState,
  _persist: {
    rehydrated: true,
    version: 1,
  },
}

const accessToken = '_token'
const singlePermission = [
  {
    name: 'Admin',
    entityId: null,
    franchiseId: null,
    isGlobal: false,
  },
]
describe('AuthRedux', () => {
  describe('Entities and franchises', () => {
    it('Should get the first if there is only one', () => {
      const newState = reducer(
        defaultState,
        actions.login(accessToken, permissions, ['franchise1'], ['entity1'])
      )
      expect([newState.selectedFranchise, newState.selectedEntity]).toEqual([
        'franchise1',
        'entity1',
      ])
    })
  })
  describe('Permissions and modules', () => {
    it('Should get distinct modules', () => {
      const modules = getAvailableModules(permissions)
      expect(modules).toEqual(['Admin', 'Backoffice', 'Auditor', 'ContribuinteDTE'])
    })
    it('Should get modules if there is only one', () => {
      expect(getAvailableModules(singlePermission)).toEqual(['Admin'])
    })
    it('Should set the module if there is only one', () => {
      expect(
        reducer(defaultState, actions.login(accessToken, singlePermission, [], [])).selectedModule
      ).toEqual('Admin')
    })
  })
})
