import {
  getApiDeclarationValue,
  getDeclarationInitialValue,
} from '../app/modules/ITR/Components/ITRCultureManagementModal'
import {getApiLiveStockValue} from '../app/modules/ITR/Components/ITRModalHerds'
import {CultureDeclaration} from '../app/services/CultureDeclarationApi'

describe('getApiDeclarationValue', () => {
  it('should return correct values', () => {
    const arr = {
      year: '2022',
      declarations: [
        {
          area: 10,
          cultureId: '43092775-6e55-4a3b-a670-f88bf7b8ba12',
          month: 1,
        },
        {
          area: 20,
          cultureId: '2ec2e279-6ddd-41ef-b3ac-cd1960a6934d',
          month: 1,
        },
        {
          area: 30,
          count: 20,
          cultureId: '89096074-53ab-4ff2-86e5-b5dfa48c7812',
          month: 1,
        },
        {
          area: 130,
          count: undefined,
          cultureId: 'a320c3a5-d781-4de1-91fb-9b532fe82b3a',
          month: 1,
        },
      ],
    }

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
      {
        id: '89096074-53ab-4ff2-86e5-b5dfa48c7812',
        userId: null,
        createdAt: '2023-02-22T10:52:05.4266667',
        isDefault: true,
        typeDescription: 'Piscicultura',
        name: 'Carpa',
        type: 1,
        isChecked: true,
      },
      {
        id: 'a320c3a5-d781-4de1-91fb-9b532fe82b3a',
        userId: null,
        createdAt: '2023-02-22T10:52:05.4266667',
        isDefault: true,
        typeDescription: 'Piscicultura',
        name: 'Cascudo',
        type: 1,
        isChecked: true,
      },
      {
        id: 'a3re0c3a5-d781-4de1-91fb-9b532fe82b3a',
        userId: null,
        createdAt: '2023-02-22T10:52:05.4266667',
        isDefault: true,
        typeDescription: 'Piscicultura',
        name: 'Piranha',
        type: 1,
        isChecked: true,
      },
    ]

    const formValues = {
      agricultura: {
        Milho: '10',
        Arroz: '20',
      },
      piscicultura: {
        Carpa: {
          area: '30',
          count: '20',
        },
        Cascudo: {
          area: '130',
        },
      },
      year: '2022',
    }

    expect(getApiDeclarationValue(formValues, types)).toStrictEqual(arr)
  })
  it('should not includes empty values', () => {
    const arr = {
      year: '2022',
      declarations: [
        {
          area: 10,
          cultureId: '43092775-6e55-4a3b-a670-f88bf7b8ba12',
          month: 1,
        },
        {
          area: 20,
          cultureId: '2ec2e279-6ddd-41ef-b3ac-cd1960a6934d',
          month: 1,
        },
      ],
    }

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
      {
        id: 'c9ee5854-1821-4a5b-b078-cdf0ee3a2dd2',
        userId: null,
        createdAt: '2023-02-22T10:52:05.49',
        isDefault: true,
        typeDescription: 'Agricultura',
        name: 'Cana de açúcar',
        type: 2,
        isChecked: true,
      },
    ]

    const formValues = {
      agricultura: {
        Milho: '10',
        Arroz: '20',
      },
      piscicultura: {},
      year: '2022',
    }

    expect(getApiDeclarationValue(formValues, types)).toStrictEqual(arr)
  })
})

describe('getDeclarationInitialValue', () => {
  it('shoud parse empty declaration', () => {
    const arr: CultureDeclaration[] = []
    const formValues = {
      agricultura: {},
      piscicultura: {},
      year: '2022',
    }
    expect(getDeclarationInitialValue(arr,'2022')).toStrictEqual(formValues)
  })
  it('shoud parse declaration', () => {
    const arr: CultureDeclaration[] = [
      {
        month: 0,
        maleCount: 0,
        femaleCount: 0,
        count: 0,
        area: 10,
        cultureId: '',
        id: '',
        userId: '',
        taxProcedureId: '',
        cultureName: 'Milho',
        type: 2,
        typeDescription: '',
        monthDescription: '',
        year:'2021'
      },
    ]
    const formValues = {
      agricultura: {
        Milho: '10',
      },
      piscicultura: {},
      year:'2021'
    }
    expect(getDeclarationInitialValue(arr,'2021')).toStrictEqual(formValues)
  })
  it('shoud parse declaration with area null', () => {
    const arr: CultureDeclaration[] = [
      {
        month: 0,
        maleCount: 0,
        femaleCount: 0,
        count: 0,
        area: null as any,
        cultureId: '',
        id: '',
        userId: '',
        taxProcedureId: '',
        cultureName: 'Milho',
        type: 2,
        typeDescription: '',
        monthDescription: '',
        year:'2017'
      },
    ]
    const formValues = {
      agricultura: {
        Milho: '',
      },
      piscicultura: {},
      year:'2017'
    }
    expect(getDeclarationInitialValue(arr,'2017')).toStrictEqual(formValues)
  })
  it('shoud parse declaration with fish', () => {
    const arr: CultureDeclaration[] = [
      {
        month: 0,
        maleCount: 0,
        femaleCount: 0,
        count: 20,
        area: 10,
        cultureId: '',
        id: '',
        userId: '',
        taxProcedureId: '',
        cultureName: 'Cascudo',
        type: 1,
        typeDescription: '',
        monthDescription: '',
        year:'2018'
      },
    ]
    const formValues = {
      piscicultura: {
        Cascudo: {
          area: '10',
          count: '20',
        },
      },
      year:'2018',
      agricultura: {},
    }
    expect(getDeclarationInitialValue(arr,'2018')).toStrictEqual(formValues)
  })
  it('should return correct year',()=>{
    const arr: CultureDeclaration[] = [
      {
        month: 0,
        maleCount: 0,
        femaleCount: 0,
        count: 20,
        area: 10,
        cultureId: '',
        id: '',
        userId: '',
        taxProcedureId: '',
        cultureName: 'Cascudo',
        type: 1,
        typeDescription: '',
        monthDescription: '',
        year:'2022'
      },
      {
        month: 0,
        maleCount: 0,
        femaleCount: 0,
        count: 20,
        area: 10,
        cultureId: '',
        id: '',
        userId: '',
        taxProcedureId: '',
        cultureName: 'Peruá',
        type: 1,
        typeDescription: '',
        monthDescription: '',
        year:'2021'
      },
    ]
    const formValues = {
      piscicultura: {
        Cascudo: {
          area: '10',
          count: '20',
        },
      },
      year:'2022',
      agricultura: {},
    }
    expect(getDeclarationInitialValue(arr,'2022')).toStrictEqual(formValues)
  })
})

describe('getApiLiveStockValue', () => {
  it('should return correct values', () => {
    const expectedValue = {
      year: '2019',
      declarations: [
        {
          cultureId: '123',
          month: 1,
          maleCount: 1,
          femaleCount: 2,
        },
        {
          cultureId: '456',
          month: 1,
          maleCount: 2,
          femaleCount: 1,
        },
      ],
    }

    const types = [
      {
        id: '123',
        userId: null,
        createdAt: '2023-02-22T10:52:05.4566667',
        isDefault: true,
        typeDescription: 'Agricultura',
        name: 'Cordeiro',
        type: 3,
        isChecked: true,
      },
      {
        id: '456',
        userId: null,
        createdAt: '2023-02-22T10:52:05.4266667',
        isDefault: true,
        typeDescription: 'Agricultura',
        name: 'Ovelha',
        type: 3,
        isChecked: true,
      },
    ]

    const formValues = {
      year: '2019',
      model: [
        {
          Cordeiro: {
            maleCount: '1',
            femaleCount: '2',
          },
          Ovelha: {
            maleCount: '2',
            femaleCount: '1',
          },
        },
      ],
    }

    expect(getApiLiveStockValue(formValues, types)).toStrictEqual(expectedValue)
  })
})
