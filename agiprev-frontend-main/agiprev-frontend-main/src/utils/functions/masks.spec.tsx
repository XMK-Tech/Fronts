import {
  cepMask,
  cnpjMask,
  cpfMask,
  phoneMask,
  stateRegistrationMask,
} from './masks';
describe('Masks', () => {
  test.each([
    ['64738275628', '647.382.756-28'],
    ['', ''],
    ['b', ''],
    [null, ''],
    [undefined, ''],
    ['647382756', '647.382.756'],
  ])('mask cpf', (number, maskedNumber) => {
    const maskedCpf = cpfMask(number);
    expect(maskedCpf).toBe(maskedNumber);
  });

  test.each([
    ['13978564736', '(13)97856-4736'],
    ['', ''],
    ['b', ''],
    [null, ''],
    [undefined, ''],
    ['139785', '(13)9785'],
  ])('mask phone', (number, maskedNumber) => {
    const maskedPhone = phoneMask(number);
    expect(maskedPhone).toBe(maskedNumber);
  });

  test.each([
    ['04576170', '04.576-170'],
    ['', ''],
    ['b', ''],
    [null, ''],
    [undefined, ''],
    ['04576', '04.576'],
  ])('mask cep', (number, maskedNumber) => {
    const maskedCep = cepMask(number);
    expect(maskedCep).toBe(maskedNumber);
  });

  test.each([
    ['04576170456456', '04.576.170/4564-56'],
    ['', ''],
    ['a', ''],
    [null, ''],
    [undefined, ''],
    ['045761704564', '04.576.170/4564'],
  ])('mask cnpj', (number, maskedNumber) => {
    const maskedCnpj = cnpjMask(number);
    expect(maskedCnpj).toBe(maskedNumber);
  });

  test.each([
    ['345354345353', '345.354.345.353'],
    ['', ''],
    ['a', ''],
    [null, ''],
    [undefined, ''],
    ['345354345', '345.354.345'],
  ])('mask state registration', (number, maskedNumber) => {
    const maskedState = stateRegistrationMask(number);
    expect(maskedState).toBe(maskedNumber);
  });
});
