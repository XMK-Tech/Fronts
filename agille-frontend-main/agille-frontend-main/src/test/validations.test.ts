import {validations} from '../app/components/Form/FormInput'

describe('validations', () => {
  it('Should validate masked values for cib', async () => {
    expect(await validations.cib().isValid('1111111-1')).toBe(true)
  })
  it('Should not validate masked values for cib', async () => {
    expect(await validations.cib().isValid('_______-_')).toBe(false)
  })
  it('Should pass for empty string if not required', async () => {
    validations.cib().validateSync('')
    expect(await validations.cib().isValid('')).toBe(true)
  })
  it('Should not pass for empty string if required', async () => {
    expect(await validations.cib().required().isValid('')).toBe(false)
  })
})
