import { MeController } from '@/application/controllers'
import { makeLoadLoggedInUser } from '@/main/factories/domain/usecases'

export const makeMeController = (): MeController => {
  return new MeController(makeLoadLoggedInUser())
}
