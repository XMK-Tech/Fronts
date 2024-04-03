import {convertNumberToStringValue, convertStringValueToNumber} from '../app/utils/functions/masks'

describe('Masks', () => {
  describe('convertStringValueToNumber', () => {
    // Values come from input with comma as decimal separator.
    test('should convert string value to number', () => {
      expect(convertStringValueToNumber('1')).toBe(1)
    })

    test('should work with negative numbers', () => {
      expect(convertStringValueToNumber('-1')).toBe(-1)
    })

    test('should work with decimal numbers', () => {
      expect(convertStringValueToNumber('1,1')).toBe(1.1)
    })

    test('should work with negative decimal numbers', () => {
      expect(convertStringValueToNumber('-1,1')).toBe(-1.1)
    })
  })

  describe('convertNumberValueToString', () => {
    // Values come from API with dot as decimal separator.
    test('should convert number value to string', () => {
      expect(convertNumberToStringValue('1')).toBe('1')
      expect(convertNumberToStringValue(1)).toBe('1')
    })

    test('should convert values with thousand separator', () => {
      expect(convertNumberToStringValue('1000')).toBe('1.000')
      expect(convertNumberToStringValue(1000)).toBe('1.000')
    })

    test('should convert values with decimal separator', () => {
      expect(convertNumberToStringValue('1.1')).toBe('1,1')
      expect(convertNumberToStringValue(1.1)).toBe('1,1')
    })

    test('should convert values with decimal separator and thousand separator', () => {
      expect(convertNumberToStringValue('1000.1')).toBe('1.000,1')
      expect(convertNumberToStringValue(1000.1)).toBe('1.000,1')
    })
  })
})
