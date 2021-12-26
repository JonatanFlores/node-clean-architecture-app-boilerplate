import { adaptExpressRoute as adapt } from '@/main/adapters'
import { makeLoginController } from '@/main/factories/application/controller'

import { Router } from 'express'

export default (router: Router): void => {
  router.post('/api/login', adapt(makeLoginController()))
}
