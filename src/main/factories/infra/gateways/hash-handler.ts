import { BcryptHashHandler } from '@/infra/gateways'

export const makeBcryptHashHandler = (): BcryptHashHandler => {
  const salt = 12
  return new BcryptHashHandler(salt)
}
