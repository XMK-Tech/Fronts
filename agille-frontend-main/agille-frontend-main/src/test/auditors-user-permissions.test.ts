import {DefaultPermissionType, parseAuditorUser} from '../app/services/UsersApi'

const user = {
  address: {
    street: ' string',
    district: ' string',
    complement: ' string',
    zipcode: ' string',
    type: 0,
    cityId: ' string',
  },
  username: ' string',
  secondaryPhoneNumber: ' string',
  phoneNumber: ' string',
  document: ' string',
  email: ' string',
  fullName: ' string',
}
describe('must test user permissions', () => {
  it('In case I pass no permissions, permissions must be an empty array', () => {
    expect(parseAuditorUser('12345678', user, []).permissions).toStrictEqual([])
  })
  it('If I pass a permission (["Auditor"]) and an entity ("abc123"), it should return an array with the respective data', () =>
    expect(parseAuditorUser('abc123', user, ['Auditor']).permissions).toStrictEqual([
      {
        isGlobal: false,
        permissionEntity: 'abc123',
        permissionFranchise: null,
        permissionName: 'Auditor',
      },
    ]))
  it('If I pass a permission (["Auditor"]) and an entity ("abc123"), and the admPermission is true it should return an array with the respective data', () => {
    expect(parseAuditorUser('abc123', user, ['Auditor'], true).defaultPermissions).toStrictEqual([
      {
        entities: ['abc123'],
        franchises: [],
        permissionType: DefaultPermissionType.ManageUsers,
        isGlobal: false,
      },
      {
        entities: ['abc123'],
        franchises: [],
        permissionType: DefaultPermissionType.ManagePermissions,
        isGlobal: false,
      },
    ])
  })
  it('If I pass a permission (["Auditor"]) and an entity ("abc123"), and the admPermission is false it should return an empty array', () => {
    expect(parseAuditorUser('abc123', user, ['Auditor'], false).defaultPermissions).toStrictEqual(
      []
    )
  })
})
