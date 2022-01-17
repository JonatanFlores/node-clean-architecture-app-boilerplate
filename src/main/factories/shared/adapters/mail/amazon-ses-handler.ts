import { AmazonSesHandler } from '@/shared/adapters/mail'

export const makeAmazonSesHandler = (): AmazonSesHandler => {
  return new AmazonSesHandler()
}
