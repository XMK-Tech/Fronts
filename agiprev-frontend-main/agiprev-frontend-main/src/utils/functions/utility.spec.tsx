import { AxiosError } from 'axios';
import {
  getError,
  getFirstIfAny,
  parseDate,
  parseDateToForm,
  validateOptionalFields,
} from './utility';

function axiosError(isAxios: boolean) {
  return {
    message: 'Request failed with status code 403',
    name: 'AxiosError',
    config: {},
    response: {
      data: {
        error: 'Invalid credentials',
      },
      status: 403,
      statusText: 'Forbidden',
      headers: {},
      config: {},
    },
    isAxiosError: isAxios,
    toJSON: () => Object,
  };
}

describe('Utilities', () => {
  test.each([
    ['2022-12-08T21:06:10.079Z', '2022-12-08'],
    ['', ''],
    ['b', 'b'],
    [null, ''],
    [undefined, ''],
    ['2022-12-08', '2022-12-08'],
  ])('parseDate', (fullDate, shortDate) => {
    const date = parseDate(fullDate);
    expect(date).toBe(shortDate);
  });

  test.each([
    [new Date('2022-12-08T21:06:10.079Z'), '2022-12-08'],
    [new Date('2023-12-08T21:12:10.079Z'), '2023-12-08'],
    [null, ''],
    [undefined, ''],
  ])('parseDateToForm', (dateObject, formattedDate) => {
    const date = parseDateToForm(dateObject);
    expect(date).toBe(formattedDate);
  });

  test.each([
    [[2, 3, 4], 2],
    [[], null],
    [null, null],
    [undefined, null],
  ])('getFirst', (array, firstElement) => {
    const date = getFirstIfAny<any>(array);
    expect(date).toBe(firstElement);
  });

  test.each<[AxiosError<any> | null | undefined, string]>([
    [axiosError(true), 'Invalid credentials'],
    [axiosError(false), 'Ocorreu um erro desconhecido'],
    [null, 'Ocorreu um erro desconhecido'],
    [undefined, 'Ocorreu um erro desconhecido'],
  ])('getError', (error, message) => {
    const err = getError(error);
    expect(err).toBe(message);
  });

  test.each<
    [
      { id?: string | null; teste?: string | null; opcional?: string | null },
      ('id' | 'teste' | 'opcional')[],
      boolean
    ]
  >([
    [{ id: '20', teste: '', opcional: '222' }, ['opcional'], true],
    [{ id: '255', teste: '250', opcional: '223' }, ['opcional'], false],
    [{ id: '257', teste: '259', opcional: '' }, ['opcional'], false],
    [{ id: '', teste: '', opcional: '' }, ['opcional'], true],
    [
      { id: undefined, teste: undefined, opcional: undefined },
      ['opcional'],
      true,
    ],
    [{ id: null, teste: null, opcional: null }, ['opcional'], true],
  ])('getIsValid', (objectExamples, optionalFields, result) => {
    const isWithError = validateOptionalFields<typeof objectExamples>(
      objectExamples,
      optionalFields
    );
    expect(isWithError).toBe(result);
  });
});
