type MaskInput = string | null | undefined
export function areaMask(value: MaskInput) {
  if (!value) return ''
  return (
    'm² ' +
    value
      .replace(/\D/g, '')
      .replace(/(\d{2})(?=(\d))*$/, ',$1')
      .replace(/(\d)(?=(\d{3})+(,(\d){0,2})*$)/g, '$1.')
  )
}

export function moneyMask(value: MaskInput) {
  if (!value) return ''
  return (
    'R$ ' +
    value
      .replace(/\D/g, '')
      .replace(/(\d{2})(?=(\d))*$/, ',$1')
      .replace(/(\d)(?=(\d{3})+(,(\d){0,2})*$)/g, '$1.')
  )
}
export function convertMoneyToNumber(valor: any) {
  return parseFloat(valor.replace('R$', '').replace('.', '').replace(',', '.')) || 0
}
export function convertAreaToNumber(valor: any) {
  return parseFloat(valor.replace('m²', '').replace('.', '').replace(',', '.')) || 0
}
export function convertStringValueToNumber(value: string) {
  const stringWithDot = value.replace(/\./g, '').replace(',', '.')

  return parseFloat(stringWithDot)
}
export function convertNumberToStringValue(number: string | number): string {
  function convert(integer: string, decimal: string = '') {
    const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    if (!decimal) {
      return formattedInteger
    }
    return `${formattedInteger},${decimal}`
  }

  const numberString = typeof number === 'number' ? number.toString() : number
  const decimalIndex = numberString.indexOf('.')
  if (decimalIndex !== -1) {
    const integerPart = numberString.slice(0, decimalIndex)
    const decimalPart = numberString.slice(decimalIndex + 1)

    return convert(integerPart, decimalPart)
  } else {
    return convert(numberString)
  }
}
