import { BcryptHashHandler } from '@/infra/gateways'

export const makeBcryptHashHandler = (): BcryptHashHandler => {
  return new BcryptHashHandler()
}
