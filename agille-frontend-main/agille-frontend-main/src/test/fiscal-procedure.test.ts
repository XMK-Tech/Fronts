import {
  dateAndTimeToISO,
  getFilteredStages,
  getReplyId,
} from '../app/modules/ITR/FIscalProcedure/FiscalProcedureDetails'
import {ProcedurePhase} from '../app/services/FiscalProcedureApi'
const stages: ProcedurePhase[] = [
  {
    id: '2b6ec9ab-8514-4ad8-817c-1165b772e8a9',
    fileUrl: null,
    subjectName: 'Raphael Moreira da Silva',
    createdAt: '2022-09-15T18:51:47.5918118',
    subjectId: '1b3b7c15-10c1-4f00-9203-0e14d4b3c278',
    certificationDate: '2022-09-24T00:00:00',
    cutOffDate: '2022-10-08T00:00:00',
    fineAmount: 0,
    trackingCode: null,
    forwardTermUrl: null,
    joiningTermUrl: null,
    arCode: '1',
    number: '1',
    type: 2,
    status: 0,
    attachmentId: null,
    replyTo: null,
  },
  {
    id: '4e7996c9-1cdf-4298-9aaa-ae524f212d58',
    fileUrl:
      'https://storage.googleapis.com/download/storage/v1/b/agille/o/705557ec-96fd-408c-a244-3fc7b164f19f.pdf?generation=1663171865420951&alt=media',
    subjectName: 'Raphael Moreira da Silva',
    createdAt: '2022-09-14T16:11:24.5528005',
    subjectId: '1b3b7c15-10c1-4f00-9203-0e14d4b3c278',
    certificationDate: '2022-09-14T13:11:00',
    cutOffDate: '2022-09-14T14:11:00',
    fineAmount: 0,
    trackingCode: null,
    forwardTermUrl: null,
    joiningTermUrl: null,
    arCode: '1',
    number: '1',
    type: 2,
    status: 0,
    attachmentId: '18e3591b-40e8-4119-8f0e-fc350b9e1dca',
    replyTo: null,
  },
  {
    id: 'f6ca09b3-2298-4cc9-956d-c1625c899aff',
    fileUrl: null,
    subjectName: 'Raphael Moreira da Silva',
    createdAt: '2022-09-15T18:51:34.7418238',
    subjectId: '1b3b7c15-10c1-4f00-9203-0e14d4b3c278',
    certificationDate: '2022-09-09T00:00:00',
    cutOffDate: '2022-09-30T00:00:00',
    fineAmount: 0,
    trackingCode: null,
    forwardTermUrl: null,
    joiningTermUrl: null,
    arCode: '1',
    number: '1',
    type: 0,
    status: 0,
    attachmentId: null,
    replyTo: '4e7996c9-1cdf-4298-9aaa-ae524f212d58',
  },
]
describe('Fiscal Procedure', () => {
  it('should parse right values for date and time', () => {
    const isoDate = dateAndTimeToISO('2020-01-01', '00:00')
    expect(isoDate).toBe('2020-01-01T00:00')
  })

  it('should parse right values for empty date and time', () => {
    const isoDate = dateAndTimeToISO('', '')
    expect(isoDate).toBe(null)
  })
  it('should parse right values for empty time', () => {
    const isoDate = dateAndTimeToISO('2022-01-01', '')
    expect(isoDate).toBe('2022-01-01T00:00')
  })
  describe('Reply', () => {
    it('should filter results that are replies', () => {
      expect(getFilteredStages(stages)).toStrictEqual([stages[0], stages[1]])
    })
    it('should filter empty array', () => {
      expect(getFilteredStages([])).toStrictEqual([])
    })
    it('should filter another array', () => {
      const fourth = {...stages[0], id: '4'}
      expect(getFilteredStages([...stages, fourth])).toStrictEqual([stages[0], stages[1], fourth])
    })
    it('should return correct reply', () => {
      expect(getReplyId(stages[1], stages)).toBe(stages[2].id)
    })
    it('should return id null if there is no reply', () => {
      expect(getReplyId(stages[0], stages)).toBe(null)
    })
  })
})
