import { DateDifferenceInHours } from '@/domain/contracts/gateways'

import { differenceInHours } from 'date-fns'

jest.mock('date-fns')

export class DateFnsHandler implements DateDifferenceInHours {
  diffInHours (dateLeft: number | Date, dateRight: number | Date): number {
    return differenceInHours(dateLeft, dateRight)
  }
}
