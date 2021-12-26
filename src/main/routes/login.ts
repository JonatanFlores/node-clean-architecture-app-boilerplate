import { Router } from 'express'

export default (router: Router): void => {
  router.get('/api/login', (req, res) => {
    res.send({ data: 'any_data' })
  })
}
