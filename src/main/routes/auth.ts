import { adaptExpressRoute as adapt } from '@/main/adapters'
import { makeLoginController, makeSignupController } from '@/main/factories/application/controller'

import { Router } from 'express'

export default (router: Router): void => {
  router.post('/api/login', adapt(makeLoginController()))
  router.post('/api/signup', adapt(makeSignupController()))
}
