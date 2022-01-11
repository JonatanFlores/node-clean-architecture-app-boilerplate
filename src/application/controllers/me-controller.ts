import { Controller } from '@/application/controllers'
import { ValidationBuilder as Builder, Validator } from '@/application/validation'
import { HttpResponse, ok } from '@/application/helpers'
import { LoadLoggedInUser } from '@/domain/usecases'

type HttpRequest = { userId: string }
type Model = undefined | { id: string, email: string }

export class MeController extends Controller {
  constructor (private readonly loadLoggedInUser: LoadLoggedInUser) {
    super()
  }

  async perform ({ userId }: HttpRequest): Promise<HttpResponse<Model>> {
    const user = await this.loadLoggedInUser({ id: userId })
    return ok(user)
  }

  override buildValidators ({ userId }: HttpRequest): Validator[] {
    return [
      ...Builder.of({ value: userId, fieldName: 'userId' }).required().build()
    ]
  }
}
