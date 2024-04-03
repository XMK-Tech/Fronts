import {flatArray, formatCpf} from '../app/utils/functions'

describe('functions', () => {
  describe('flatArray', () => {
    it('should flat an array of integers', () => {
      const arr = [
        [0, 1, 2],
        [3, 4, 5],
      ]

      const arr1 = [0, 1, 2, 3, 4, 5]

      expect(flatArray(arr)).toStrictEqual(arr1)
    })

    it('should flat an empty array', () => {
      expect(flatArray([])).toStrictEqual([])
    })
    it('should flat an array of empty arrays', () => {
      expect(flatArray([[], []])).toStrictEqual([])
    })
    it('should flat an array with empty and non-empty arrays', () => {
      expect(flatArray([[], [1, 2]])).toStrictEqual([1, 2])
    })
  })
  describe('formatCpf', () => {
    it('should format a cpf', () => {
      expect(formatCpf('12345678901')).toBe('123 456 789-01')
    })
    it('should format a cpf with spaces', () => {
      expect(formatCpf('123 456 789 01')).toBe('123 456 789 01')
    })
    it('should parse an empty cpf', () => {
      expect(formatCpf('')).toBe('')
    })
  })
})
