import { ValidationBuilder as Builder, Validator } from '@/application/validation'
import { LoadLoggedInUser } from '@/domain/usecases'

type HttpRequest = { userId: string }

export class MeController {
  constructor (private readonly loadLoggedInUser: LoadLoggedInUser) {}

  async handle ({ userId }: HttpRequest): Promise<void> {
    await this.loadLoggedInUser({ id: userId })
  }

  buildValidators ({ userId }: HttpRequest): Validator[] {
    return [
      ...Builder.of({ value: userId, fieldName: 'userId' }).required().build()
    ]
  }
}
