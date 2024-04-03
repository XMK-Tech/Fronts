import {textToCoordinates} from '../app/components/DrawMap/DrawMap'

describe('Should convert text to coordinates', () => {
  it('Should convert a single coordinate', () => {
    expect(textToCoordinates('-10,0;-10,0')).toStrictEqual([{lng: -10, lat: -10}])
  })
  it('Should convert a multiple coordinates', () => {
    expect(textToCoordinates('-10,0;-10,0\n20,10;30,8')).toStrictEqual([
      {lat: -10, lng: -10},
      {lat: 20.1, lng: 30.8},
    ])
  })

  it('should throw if there is an error', () => {
    const text =
      '-26,889; -A48,789\n-26,909; -48,844\n-27,003; -48,874\n-26,983; -48,777\n-26,927; -48,739'
    expect(() => textToCoordinates(text)).toThrow()
  })
})
