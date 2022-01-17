import { AmazonSesHandler } from '@/infra/gateways'

export const makeAmazonSesHandler = (): AmazonSesHandler => {
  return new AmazonSesHandler()
}
