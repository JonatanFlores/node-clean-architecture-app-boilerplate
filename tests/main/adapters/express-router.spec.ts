import { Controller } from '@/application/controllers'

import { NextFunction, Request, RequestHandler, Response } from 'express'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { mock, MockProxy } from 'jest-mock-extended'

type Adapter = (controller: Controller) => RequestHandler

const adaptExpressRoute: Adapter = (controller) => async (req, res) => {
  await controller.handle({ ...req.body })
}

describe('ExpressRouter', () => {
  let req: Request
  let res: Response
  let next: NextFunction
  let controller: MockProxy<Controller>
  let sut: RequestHandler

  beforeAll(() => {
    req = getMockReq({ body: { anyBody: 'any_body' } })
    res = getMockRes().res
    next = getMockRes().next
    controller = mock()
  })

  beforeEach(() => {
    sut = adaptExpressRoute(controller)
  })

  test('should call handle with correct request', async () => {
    await sut(req, res, next)

    expect(controller.handle).toHaveBeenCalledWith({ anyBody: 'any_body' })
    expect(controller.handle).toHaveBeenCalledTimes(1)
  })

  test('should call handle with empty request', async () => {
    const req = getMockReq()

    await sut(req, res, next)

    expect(controller.handle).toHaveBeenCalledWith({})
    expect(controller.handle).toHaveBeenCalledTimes(1)
  })
})
