import { adaptExpressRoute as adapt } from '@/main/adapters'
import { makePingController } from '@/main/factories/application/controller'

import { Router } from 'express'

export default (router: Router): void => {
  router.get('/', (_, response) => response.json({ message: 'Welcome to our api' }))
  router.get('/api/ping', adapt(makePingController()))
}
