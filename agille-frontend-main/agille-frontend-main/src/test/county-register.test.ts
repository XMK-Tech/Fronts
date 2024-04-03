import {getPermissions} from '../app/modules/backoffice/management/Register/CountyRegisterPage'

describe('must check permissions', () => {
  it('If all are false then it should return empty array', () => {
    expect(getPermissions(false, false)).toStrictEqual([])
  })
  it('If the first is checked, then it returns', () => {
    expect(getPermissions(true, false)).toStrictEqual(['Auditor'])
  })
  it('If the second is checked, then it returns', () => {
    expect(getPermissions(false, true)).toStrictEqual(['ContribuinteDTE'])
  })
  it('If both are checked, then it returns', () => {
    expect(getPermissions(true, true)).toStrictEqual(['Auditor', 'ContribuinteDTE'])
  })
})
