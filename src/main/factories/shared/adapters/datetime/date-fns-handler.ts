import { DateFnsHandler } from '@/shared/adapters/datetime'

export const makeDateFnsHandler = (): DateFnsHandler => {
  return new DateFnsHandler()
}
