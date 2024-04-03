import {agilleClient} from './HttpService'

export function createCrossing(startDate: Date, endDate: Date) {
  return agilleClient.post('/DataCrossing', {
    startingReference: startDate,
    endingReference: endDate,
  })
}

export function createCardCrossing(startDate: Date, endDate: Date) {
  return agilleClient.post('/CardCrossing/interval', {
    startingReference: startDate,
    endingReference: endDate,
  })
}
