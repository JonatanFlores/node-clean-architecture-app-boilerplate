import { adaptExpressRoute as adapt } from '@/main/adapters'
import { auth } from '@/main/middlewares'
import {
  makeSignInController,
  makeSignUpController,
  makeRefreshTokenController,
  makeMeController,
  makeSendForgotPasswordEmailController
} from '@/main/factories/application/controller'

import { Router } from 'express'

export default (router: Router): void => {
  router.post('/api/sign-in', adapt(makeSignInController()))
  router.post('/api/sign-up', adapt(makeSignUpController()))
  router.post('/api/refresh-token', adapt(makeRefreshTokenController()))
  router.post('/api/forgot-password', adapt(makeSendForgotPasswordEmailController()))
  router.get('/api/me', auth, adapt(makeMeController()))
}
