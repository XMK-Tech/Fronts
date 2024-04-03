import {Action} from '@reduxjs/toolkit'
import {UserModel} from '../models/UserModel'

export interface ActionWithPayload<T> extends Action {
  payload?: T
}

export const actionTypes = {
  Login: '[Login] Action',
  Logout: '[Logout] Action',
  Register: '[Register] Action',
  UserRequested: '[Request User] Action',
  UserLoaded: '[Load User] Auth API',
  SetUser: '[Set User] Action',
  SelectModule: '[Select Module] Action',
  SelectEntity: '[Select Entity] Action',
}
export const initialAuthState: IAuthState = {
  user: undefined,
  accessToken: undefined,
  selectedModule: undefined,
  selectedFranchise: undefined,
  selectedEntity: undefined,
}

export enum Module {
  Admin = 'Admin',
  Backoffice = 'Backoffice',
  Auditor = 'Auditor',
  ContribuinteDTE = 'ContribuinteDTE',
  ContribuinteITR = 'ContribuinteITR',
  AuditorDTE = 'AuditorDTE',
}
export type Franchise = string
export type Entity = {
  id: string
  name: string
}

export type Permission = {
  name: string
  entityId: string | null
  franchiseId: string | null
  isGlobal: boolean
}
export interface IAuthState {
  user?: UserModel
  accessToken?: string
  selectedModule?: Module
  permissions?: Permission[]
  modules?: Module[]
  franchises?: Franchise[]
  entities?: string[]
  selectedFranchise?: Franchise
  selectedEntity?: string
}
