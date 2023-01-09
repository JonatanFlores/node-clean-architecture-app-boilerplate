import { BaseController } from '@/application/controllers'
import { HttpResponse, ok } from '@/application/helpers'

type Model = { message: string }

export class PingController extends BaseController {
  async perform (): Promise<HttpResponse<Model>> {
    return ok({ message: 'pong' })
  }
}
