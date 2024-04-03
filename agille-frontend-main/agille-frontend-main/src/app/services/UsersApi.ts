import {boolean} from 'yup'
import {Franchise} from '../modules/auth/redux/AuthTypes'
import {buildSearchArgs} from '../utils/functions'
import {agilleClient, middlewareClient} from './HttpService'

const permissionTokens = {
  Admin: '3f72da81-b665-418c-944b-58e78cc0c31b',
  Backoffice: 'ec09cf5e-a78b-4627-b221-8c68b0727c3a',
  Auditor: 'aab5fc71-1096-4882-b731-f1d4878e5fb2',
}

export function getUsers() {
  return middlewareClient.get(`/user?Limit=30`).then((response) => {
    return {
      data: response,
    }
  })
}
export function getAudit(userId: string) {
  agilleClient.getDownload(`/Audit`, {userId}, 'audit.csv')
}
export function getAuditAccess(userId: string) {
  middlewareClient.getDownload(`/Audit`, {userId}, 'audit.csv')
}
export function getUsersLenght() {
  return middlewareClient.get(`/user`).then((response) => {
    const length = response.metadata.dataSize
    return length
  })
}

export async function getFilteredUsers(page: number, limit: number = 6) {
  return middlewareClient.get(`/user`, getPaginationParams(page, limit))
}

export async function getFilteredBackofficeUsers(
  page: number,
  limit: number = 6,
  franchiseId: string,
  text?: string,
  field?: string
) {
  return middlewareClient.get(`/user`, {
    ...getPaginationParams(page, limit),
    franchiseId: franchiseId,
    ...buildSearchArgs(text, field),
  })
}

export async function getAuditores(
  page: number,
  limit: number = 6,
  entityId: string,
  text?: string,
  field?: string
) {
  return middlewareClient.get(`/user`, {
    ...getPaginationParams(page, limit),
    EntityId: entityId,
    ...buildSearchArgs(text, field),
  })
}
export async function getFilteredAdmins(page: number, limit: number = 10, admin: boolean) {
  return middlewareClient.get(`/user`, {...getPaginationParams(page, limit), AdminsOnly: admin})
}
export function getPaginationParams(page: number, limit: number = 10) {
  return {Limit: limit, Offset: page}
}
export function getAdmins() {
  return middlewareClient.get(`/user?AdminsOnly=true`).then((response) => {
    return {
      data: response,
    }
  })
}

export enum DefaultPermissionType {
  ManageUsers,
  ManageFranchise,
  ManageEntities,
  ManagePermissions,
}

type DefaultPermission = {
  permissionType: DefaultPermissionType
  isGlobal?: boolean
  franchises?: string[]
  entities?: string[]
}

export type CreateUserParams = {
  address?: {
    street: string
    district: string
    complement: string
    zipcode: string
    type: number
    cityId: string
    number?: string
  }
  username: string
  secondaryPhoneNumber?: string
  phoneNumber: number | string
  document: string
  email: string
  fullName?: string
}

export async function updateAdminUser(id: string, user: CreateUserParams) {
  const defaultPermissions = getAdminUserPermissions()
  return await updateUser(id, {
    defaultPermissions,
    username: user.username,
    phoneNumber: user.phoneNumber,
    secondaryPhoneNumber: user.secondaryPhoneNumber,
    document: user.document,
    email: user.email,
    address: user.address,
    fullname: user.fullName,
    permissions: [
      {
        permissionName: 'Admin',
        permissionEntity: null,
        permissionFranchise: null,
        isGlobal: true,
      },
    ],
    entities: [],
    franchises: [],
  })
}

export async function updateBackOfficeAdminUser(
  id: string,
  user: CreateUserParams,
  franchise: Franchise
) {
  const defaultPermissions = getBackOfficeAdminUserPermissions([franchise])
  return await updateUser(id, {
    defaultPermissions,
    fullname: user.fullName,
    username: user.username,
    phoneNumber: user.phoneNumber,
    secondaryPhoneNumber: user.secondaryPhoneNumber,
    document: user.document,
    email: user.email,
    address: user.address,
    permissions: [
      {
        permissionName: 'Backoffice',
        permissionEntity: null,
        permissionFranchise: franchise,
        isGlobal: false,
      },
    ],
    entities: [],
    franchises: [franchise],
  })
}
export async function updateBackOfficeTypistUser(
  id: string,
  user: CreateUserParams,
  franchise: Franchise
) {
  const defaultPermissions = getBackOfficeTypistUserPermissions()
  return await updateUser(id, {
    defaultPermissions,
    username: user.username,
    phoneNumber: user.phoneNumber,
    document: user.document,
    email: user.email,
    address: user.address,
    permissions: [
      {
        permissionName: 'Backoffice',
        permissionEntity: null,
        permissionFranchise: franchise,
        isGlobal: false,
      },
    ],
    entities: [],
    franchises: [franchise],
  })
}
export async function updateAuditorUser(
  id: string,
  user: CreateUserParams,
  entityId: string,
  module: 'Auditor' | 'ContribuinteDTE' = 'Auditor',
  admPermission: boolean = true
) {
  const defaultPermissions = getAuditorUserPermissions(entityId)
  return await updateUser(id, {
    defaultPermissions: admPermission ? defaultPermissions : [],
    fullname: user.fullName,
    username: user.email,
    phoneNumber: user.phoneNumber,
    document: user.document,
    email: user.email,
    address: user.address,
    secondaryPhoneNumber: user.secondaryPhoneNumber,
    permissions: [
      {
        permissionName: module,
        permissionEntity: entityId,
        permissionFranchise: null,
        isGlobal: false,
      },
    ],
    entities: [entityId],
    franchises: [],
  })
}
export async function getUser(
  id: string,
  page: number,
  limit: number = 6,
  text?: string,
  field?: string
) {
  return await middlewareClient.get(`/user/${id}`, {
    ...getPaginationParams(page, limit),
    ...buildSearchArgs(text, field),
  })
}

export async function createAdminUser(user: CreateUserParams) {
  const defaultPermissions: DefaultPermission[] = getAdminUserPermissions()

  return await createUser({
    defaultPermissions,
    username: user.username,
    phoneNumber: user.phoneNumber,
    document: user.document,
    email: user.email,
    address: user.address,
    permissions: [
      {
        permissionName: 'Admin',
        permissionEntity: null,
        permissionFranchise: null,
        isGlobal: true,
      },
    ],
    entities: [],
    franchises: [],
  })
}
export async function createBackOfficeAdminUser(user: CreateUserParams, franchise: Franchise) {
  const defaultPermissions: DefaultPermission[] = getBackOfficeAdminUserPermissions([franchise])
  return await createUser({
    defaultPermissions,
    fullname: user.fullName,
    username: user.username,
    phoneNumber: user.phoneNumber,
    document: user.document,
    email: user.email,
    permissions: [
      {
        permissionName: 'Backoffice',
        permissionEntity: null,
        permissionFranchise: franchise,
        isGlobal: false,
      },
    ],
    entities: [],
    franchises: [franchise],
  })
}
export async function createBackOfficeTypistUser(user: CreateUserParams, franchise: Franchise) {
  const defaultPermissions: DefaultPermission[] = getBackOfficeTypistUserPermissions()
  return await createUser({
    defaultPermissions,
    username: user.username,
    phoneNumber: user.phoneNumber,
    document: user.document,
    email: user.email,
    permissions: [
      {
        permissionName: 'Backoffice',
        permissionEntity: null,
        permissionFranchise: franchise,
        isGlobal: false,
      },
    ],
    entities: [],
    franchises: [franchise],
  })
}
export async function createAuditorUser(
  user: CreateUserParams,
  entitieId: string,
  module: 'Auditor' | 'ContribuinteDTE' = 'Auditor',
  admPermission: boolean
) {
  const parsedUser = parseAuditorUser(entitieId, user, [module], admPermission || false)
  return await createUser(parsedUser)
}
export type UserParams = {
  address?:
    | {
        street: string
        complement: string
        zipcode: string
        type: number
        cityId: string
      }
    | undefined
  secondaryPhoneNumber?: string | undefined
  fullname?: string | undefined
  defaultPermissions: DefaultPermission[]
  username: string
  phoneNumber: number | undefined | string
  document: string
  email: string
  permissions: {
    permissionName: string
    permissionEntity: string | null
    permissionFranchise: string | null
    isGlobal: boolean
  }[]
  entities?: string[]
  franchises?: string[]
}

export function parseAuditorUser(
  entitieId: string | null,
  user: CreateUserParams,
  modules: ('Auditor' | 'ContribuinteDTE' | 'AuditorDTE')[],
  admPermission: boolean = true
) {
  const defaultPermissions: DefaultPermission[] = getAuditorUserPermissions(entitieId)
  const parsedUser = {
    defaultPermissions: admPermission ? defaultPermissions : [],
    username: user.email,
    secondaryPhoneNumber: user.secondaryPhoneNumber,
    fullname: user.fullName,
    phoneNumber: user.phoneNumber,
    document: user.document,
    email: user.email,
    address: user.address,
    permissions: modules.map((module) => ({
      permissionName: module,
      permissionEntity: entitieId,
      permissionFranchise: null,
      isGlobal: false,
    })),
    entities: entitieId ? [entitieId] : [],
    franchises: [],
  }
  return parsedUser
}

function getAdminUserPermissions(): DefaultPermission[] {
  return [
    {
      permissionType: DefaultPermissionType.ManageUsers,
      isGlobal: true,
    },
    {
      permissionType: DefaultPermissionType.ManageFranchise,
      isGlobal: true,
    },
    {
      permissionType: DefaultPermissionType.ManagePermissions,
      isGlobal: true,
    },
  ]
}
function getBackOfficeAdminUserPermissions(franchises: Franchise[]): DefaultPermission[] {
  return [
    {
      permissionType: DefaultPermissionType.ManageUsers,
      isGlobal: false,
      franchises: franchises,
    },
    {
      permissionType: DefaultPermissionType.ManageEntities,
      isGlobal: false,
      franchises: franchises,
    },
    {
      permissionType: DefaultPermissionType.ManagePermissions,
      isGlobal: false,
      franchises: franchises,
    },
  ]
}
function getBackOfficeTypistUserPermissions(): DefaultPermission[] {
  return []
}
function getAuditorUserPermissions(entitieId: string | null): DefaultPermission[] {
  return [
    {
      permissionType: DefaultPermissionType.ManageUsers,
      isGlobal: false,
      entities: entitieId ? [entitieId] : [],
      franchises: [],
    },
    {
      permissionType: DefaultPermissionType.ManagePermissions,
      isGlobal: false,
      entities: entitieId ? [entitieId] : [],
      franchises: [],
    },
  ]
}

async function createUser(parsedUser: UserParams) {
  return await middlewareClient.post(`/user`, parsedUser)
}

async function updateUser(id: string, user: UserParams) {
  return await middlewareClient.put(`/user/${id}`, user)
}
