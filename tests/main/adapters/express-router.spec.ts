import { Controller } from '@/application/controllers'

import { RequestHandler } from 'express'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { mock } from 'jest-mock-extended'

type Adapter = (controller: Controller) => RequestHandler

const adaptExpressRoute: Adapter = (controller) => async (req, res) => {
  await controller.handle({ ...req.body })
}

describe('ExpressRouter', () => {
  test('should call handle with correct request', async () => {
    const req = getMockReq({ body: { anyBody: 'any_body' } })
    const res = getMockRes().res
    const next = getMockRes().next
    const controller = mock<Controller>()
    const sut = adaptExpressRoute(controller)

    await sut(req, res, next)

    expect(controller.handle).toHaveBeenCalledWith({ anyBody: 'any_body' })
    expect(controller.handle).toHaveBeenCalledTimes(1)
  })

  test('should call handle with empty request', async () => {
    const req = getMockReq()
    const res = getMockRes().res
    const next = getMockRes().next
    const controller = mock<Controller>()
    const sut = adaptExpressRoute(controller)

    await sut(req, res, next)

    expect(controller.handle).toHaveBeenCalledWith({})
    expect(controller.handle).toHaveBeenCalledTimes(1)
  })
})
