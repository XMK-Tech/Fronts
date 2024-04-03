import {getApiCultureValue} from '../app/modules/ITR/Components/ITRCultureConfig'

describe('getApiCultureValue', () => {
  it('should return correct values with agriculture only', () => {
    const arr = [
      {
        cultureId: '43092775-6e55-4a3b-a670-f88bf7b8ba12',
        isChecked: true,
      },
      {
        cultureId: '2ec2e279-6ddd-41ef-b3ac-cd1960a6934d',
        isChecked: false,
      },
    ]

    const types = [
      {
        id: '43092775-6e55-4a3b-a670-f88bf7b8ba12',
        userId: null,
        createdAt: '2023-02-22T10:52:05.4566667',
        isDefault: true,
        typeDescription: 'Agricultura',
        name: 'Milho',
        type: 2,
        isChecked: true,
      },
      {
        id: '2ec2e279-6ddd-41ef-b3ac-cd1960a6934d',
        userId: null,
        createdAt: '2023-02-22T10:52:05.4266667',
        isDefault: true,
        typeDescription: 'Agricultura',
        name: 'Arroz',
        type: 2,
        isChecked: true,
      },
    ]
    const formValues = {
      agricultura: {
        Milho: true,
        Arroz: false,
      },
    }
    expect(getApiCultureValue(formValues, types)).toStrictEqual(arr)
  })
  it('should return correct values with 2 types', () => {
    const arr = [
      {
        cultureId: '43092775-6e55-4a3b-a670-f88bf7b8ba12',
        isChecked: true,
      },
      {
        cultureId: '8d13f6de-aad3-4e86-b10b-a2a273107d22',
        isChecked: false,
      },
    ]

    const types = [
      {
        id: '43092775-6e55-4a3b-a670-f88bf7b8ba12',
        userId: null,
        createdAt: '2023-02-22T10:52:05.4566667',
        isDefault: true,
        typeDescription: 'Agricultura',
        name: 'Milho',
        type: 2,
        isChecked: true,
      },
      {
        id: '8d13f6de-aad3-4e86-b10b-a2a273107d22',
        userId: 'd4dd0c19-1f78-4904-9f93-f340f3589c91',
        createdAt: '2023-02-25T19:37:36.288359',
        isDefault: false,
        typeDescription: 'Pisciculturas',
        name: 'Cascudo',
        type: 1,
        isChecked: false,
      },
    ]
    const formValues = {
      agricultura: {
        Milho: true,
      },
      piscicultura: {
        Cascudo: false,
      },
    }
    expect(getApiCultureValue(formValues, types)).toStrictEqual(arr)
  })
})
