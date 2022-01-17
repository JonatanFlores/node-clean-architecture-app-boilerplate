import { BcryptHashHandler } from '@/shared/adapters/security'

export const makeBcryptHashHandler = (): BcryptHashHandler => {
  const salt = 12
  return new BcryptHashHandler(salt)
}
