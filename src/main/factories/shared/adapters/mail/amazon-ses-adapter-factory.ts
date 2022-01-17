import { AmazonSesAdapter } from '@/shared/adapters/mail'

export const makeAmazonSesAdapter = (): AmazonSesAdapter => {
  return new AmazonSesAdapter()
}
