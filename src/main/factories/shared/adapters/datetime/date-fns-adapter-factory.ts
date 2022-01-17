import { DateFnsAdapter } from '@/shared/adapters/datetime'

export const makeDateFnsAdapter = (): DateFnsAdapter => {
  return new DateFnsAdapter()
}
