import { TokenGenerator } from '@/domain/gateways'
import jwt from 'jsonwebtoken'

export class JwtTokenHandler {
  constructor (private readonly secret: string) {}

  async generate ({ key, expirationInMs }: TokenGenerator.Input): Promise<TokenGenerator.Output> {
    const expirationInSeconds = expirationInMs / 1000
    return jwt.sign({ key }, this.secret, { expiresIn: expirationInSeconds })
  }
}

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
  })
})
