import { DateDifferenceInHours } from '@/domain/contracts/gateways'

import { differenceInHours } from 'date-fns'

export class DateFnsAdapter implements DateDifferenceInHours {
  diffInHours (dateLeft: number | Date, dateRight: number | Date): number {
    return differenceInHours(dateLeft, dateRight)
  }
}
