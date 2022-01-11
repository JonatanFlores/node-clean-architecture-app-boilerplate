import { ValidationBuilder as Builder, Validator } from '@/application/validation'

type HttpRequest = { userId: string }

export class MeController {
  buildValidators ({ userId }: HttpRequest): Validator[] {
    return [
      ...Builder.of({ value: userId, fieldName: 'userId' }).required().build()
    ]
  }
}
