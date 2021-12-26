import { LoginController } from '@/application/controllers'
import { makeAuthentication } from '@/main/factories/domain/usecases'

export const makeLoginController = (): LoginController => {
  return new LoginController(makeAuthentication())
}
