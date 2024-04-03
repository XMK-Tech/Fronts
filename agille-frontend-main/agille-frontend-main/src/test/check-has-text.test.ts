import {checkHasText} from '../app/utils/functions'

describe('see if it has text', () => {
  it('f the text is empty', () => {
    expect(checkHasText('')).toStrictEqual('Não informado')
  })
  it('if the text is undefined', () => {
    expect(checkHasText(undefined as any)).toStrictEqual('Não informado')
  })
  it('if the text is Name', () => {
    expect(checkHasText('Name')).toStrictEqual('Name')
  })
})
