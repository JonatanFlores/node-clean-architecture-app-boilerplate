import { DateFnsHandler } from '@/shared/adapters/datetime'

import * as datefns from 'date-fns'
import MockDate from 'mockdate'

jest.mock('date-fns')

describe('DateFnsHandler', () => {
  let dateRight: Date
  let dateLeft: Date
  let sut: DateFnsHandler
  let fakeDateFns: jest.Mocked<typeof datefns>

  beforeAll(() => {
    MockDate.set(new Date())
    dateLeft = new Date()
    dateRight = new Date()
    fakeDateFns = datefns as jest.Mocked<typeof datefns>
  })

  afterAll(() => {
    MockDate.reset()
  })

  beforeEach(() => {
    sut = new DateFnsHandler()
  })

  describe('diffInHours', () => {
    beforeAll(() => {
      fakeDateFns.differenceInHours.mockImplementation(() => 2)
    })

    test('should call differenceInHours with correct input', () => {
      sut.diffInHours(dateLeft, dateRight)

      expect(fakeDateFns.differenceInHours).toHaveBeenCalledWith(dateLeft, dateRight)
      expect(fakeDateFns.differenceInHours).toHaveBeenCalledTimes(1)
    })

    test('should return the difference in hours', () => {
      const result = sut.diffInHours(dateLeft, dateRight)

      expect(result).toBe(2)
    })

    test('should rethrow if differenceInHours throws', () => {
      const error = new Error('differenceInHours_error')
      fakeDateFns.differenceInHours.mockImplementationOnce(() => { throw error })

      expect(() => { sut.diffInHours(dateLeft, dateRight) }).toThrow(error)
    })
  })
})
