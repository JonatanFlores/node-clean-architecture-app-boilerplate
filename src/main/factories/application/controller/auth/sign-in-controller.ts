import { SignInController } from '@/application/controllers'
import { makeAuthentication } from '@/main/factories/domain/usecases'

export const makeSignInController = (): SignInController => {
  return new SignInController(makeAuthentication())
}
