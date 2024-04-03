import { formatDate, formatDateAndHour, formatHour } from './formatDate';

describe('Utilities', () => {
  test.each([
    ['', ''],
    ['b', 'Invalid Date'],
    [null, ''],
    [undefined, ''],
    ['2022-12-08T21:06:10.079Z', '08/12/2022'],
    ['2022-12-02T21:06:10.079Z', '02/12/2022'],
  ])('formatDate', (fullDate, shortDate) => {
    const date = formatDate(fullDate);
    expect(date).toBe(shortDate);
  });

  test.each([
    ['', ''],
    ['b', 'Invalid Date'],
    [null, ''],
    [undefined, ''],
    ['2022-12-08T21:06:10.079Z', '08/12/2022 21:06'],
    ['2022-12-02T20:06:10.079Z', '02/12/2022 20:06'],
  ])('formatDateAndHour', (fullDateAndHour, shortDateAndHour) => {
    expect(formatDateAndHour(fullDateAndHour, true)).toBe(shortDateAndHour);
  });

  test.each([
    ['', ''],
    ['b', 'Invalid Date'],
    [null, ''],
    [undefined, ''],
    ['2022-12-08T21:06:10.079Z', '21:06'],
    ['2022-12-02T20:06:10.079Z', '20:06'],
  ])('formatHour', (fullDateAndHour, shortDateAndHour) => {
    expect(formatHour(fullDateAndHour, true)).toBe(shortDateAndHour);
  });
});
