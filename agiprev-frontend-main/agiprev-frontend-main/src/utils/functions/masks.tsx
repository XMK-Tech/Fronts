type MaskInput = string | null | undefined;

export function cpfMask(value: MaskInput) {
  if (!value) return '';
  return value
    .replace(/\D/g, '') // substitui qualquer caracter que nao seja numero por nada
    .replace(/(\d{3})(\d)/, '$1.$2') // captura 2 grupos de numero o primeiro de 3 e o segundo de 1, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de numero
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d/, '$1'); // captura 2 numeros seguidos de um traço e não deixa ser digitado mais nada
}

export function phoneMask(value: MaskInput) {
  if (!value) return '';
  if (value.length >= 11) {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1)$2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d/, '$1');
  }
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1)$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d/, '$1');
}

export function cepMask(value: MaskInput) {
  if (!value) return '';
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1-$2')
    .replace(/(-\d{3})\d/, '$1');
}

export function cnpjMask(value: MaskInput) {
  if (!value) return '';
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .replace(/(-\d{2})\d/, '$1');
}

export function stateRegistrationMask(value: MaskInput) {
  if (!value) return '';
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})\d/, '$1');
}

export function cleanNumberMask(value: MaskInput) {
  if (!value) return '';
  return value.replace(/\D/g, ''); // substitui qualquer caracter que nao seja numero por nada
}

export function moneyMask(value: MaskInput, input: boolean = false) {
  if (!value) return '';
  if (input) {
    return (
      'R$' +
      value
        .replace(/\D/g, '')
        .replace(/(\d{2})(?=(\d))*$/, ',$1')
        .replace(/(\d)(?=(\d{3})+(,(\d){0,2})*$)/g, '$1.')
    );
  }
  const decimal = value.split('.');
  const newValue =
    decimal.length <= 1
      ? `${decimal[0]}00`
      : decimal[1].length <= 1
      ? `${decimal[0]}${decimal[1]}0`
      : value;
  return (
    (value.includes('-') ? '- R$' : 'R$ ') +
    newValue
      .replace(/\D/g, '')
      .replace(/(\d{2})(?=(\d))*$/, ',$1')
      .replace(/(\d)(?=(\d{3})+(,(\d){0,2})*$)/g, '$1.')
  );
}

export function cleanMoneyMask(value: MaskInput) {
  if (!value) return '';
  return Number(value.replace(/\D/g, '').replace(/(\d{2})(?=(\d))*$/, '.$1'));
}

export function dateMask(value: MaskInput) {
  if (!value) return '';
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d)/, '$1');
}

export function monthMask(value: MaskInput) {
  if (!value) return '';
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d)/, '$1');
}

export function returnCleanNumber(value: MaskInput) {
  if (!value) return '';
  const newValue = Number(value);
  if (newValue) return newValue;
  if (value.includes(',')) {
    const splitValue = value.split(',');
    return `${splitValue[0]}.${splitValue[1]}`;
  }
  return value.replace(/\D/g, '');
}
