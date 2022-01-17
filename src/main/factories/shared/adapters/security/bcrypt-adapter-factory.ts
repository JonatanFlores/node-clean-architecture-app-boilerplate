import { BcryptAdapter } from '@/shared/adapters/security'

export const makeBcryptAdapter = (): BcryptAdapter => {
  const salt = 12
  return new BcryptAdapter(salt)
}
