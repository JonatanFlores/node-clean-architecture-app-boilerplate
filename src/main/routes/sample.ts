import { Router } from 'express'

export default (router: Router): void => {
  router.get('/api/sample', (req, res) => {
    res.json({ message: 'Hello World' })
  })
}
