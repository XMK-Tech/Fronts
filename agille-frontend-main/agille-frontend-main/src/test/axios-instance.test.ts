import {agilleClient} from '../app/services/HttpService'

describe('Should setup axios instance', () => {
  it('Should have right url', () => {
    expect(agilleClient.baseUrl).toBe('https://agille-api.erikneves.com.br/swagger/index.html')
  })
  it('Should have right tenantId', () => {
    expect(
      agilleClient.getUploadParams({} as any, {
        auth: {accessToken: 'token', selectedEntity: 'entity'},
      })?.headers?.['tenantId']
    ).toBe('entity')
  })
})
