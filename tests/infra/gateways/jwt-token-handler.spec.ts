import { JwtTokenHandler } from '@/infra/gateways'

import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken')

describe('JwtTokenHandler', () => {
  let secret: string
  let fakeJwt: jest.Mocked<typeof jwt>
  let sut: JwtTokenHandler

  beforeAll(() => {
    secret = 'any_secret'
    fakeJwt = jwt as jest.Mocked<typeof jwt>
  })

  beforeEach(() => {
    sut = new JwtTokenHandler(secret)
  })

  describe('generate', () => {
    let key: string
    let expirationInMs: number
    let token: string

    beforeAll(() => {
      key = 'any_key'
      expirationInMs = 1000
      token = 'any_token'
      fakeJwt.sign.mockImplementation(() => token)
    })

    test('should call sign with correct input', async () => {
      await sut.generate({ key, expirationInMs })

      expect(fakeJwt.sign).toHaveBeenCalledWith({ key }, secret, { expiresIn: 1 })
    })

    test('should return a token', async () => {
      const generatedToken = await sut.generate({ key, expirationInMs })

      expect(generatedToken).toBe(token)
    })

    test('should rethrow if sign throws', async () => {
      fakeJwt.sign.mockImplementation(() => { throw new Error('token_error') })

      const promise = sut.generate({ key, expirationInMs })

      await expect(promise).rejects.toThrow(new Error('token_error'))
    })
  })
})
