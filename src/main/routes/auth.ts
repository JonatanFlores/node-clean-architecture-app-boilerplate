import { adaptExpressRoute as adapt } from '@/main/adapters'
import { makeLoginController, makeSignupController, makeRefreshTokenController, makeMeController } from '@/main/factories/application/controller'
import { auth } from '@/main/middlewares'

import { Router } from 'express'

export default (router: Router): void => {
  router.post('/api/login', adapt(makeLoginController()))
  router.post('/api/signup', adapt(makeSignupController()))
  router.post('/api/refresh-token', adapt(makeRefreshTokenController()))
  router.get('/api/me', auth, adapt(makeMeController()))
}
