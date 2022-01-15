import * as datefns from 'date-fns'
import MockDate from 'mockdate'

jest.mock('date-fns')

class DateFnsHandler {
  diffInHours (dateLeft: number | Date, dateRight: number | Date): number {
    return datefns.differenceInHours(dateLeft, dateRight)
  }
}

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

    test('should call differenceInHours with correct input', async () => {
      sut.diffInHours(dateLeft, dateRight)

      expect(fakeDateFns.differenceInHours).toHaveBeenCalledWith(dateLeft, dateRight)
      expect(fakeDateFns.differenceInHours).toHaveBeenCalledTimes(1)
    })

    test('should return the difference in hours', async () => {
      const result = sut.diffInHours(dateLeft, dateRight)

      expect(result).toBe(2)
    })
  })
})
