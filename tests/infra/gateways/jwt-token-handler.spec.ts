import jwt from 'jsonwebtoken'

export class JwtTokenHandler {
  constructor (private readonly secret: string) {}

  async generate ({ key, expirationInMs }: JwtTokenHandler.Input): Promise<void> {
    const expirationInSeconds = expirationInMs / 1000
    jwt.sign({ key }, this.secret, { expiresIn: expirationInSeconds })
  }
}

namespace JwtTokenHandler {
  export type Input = { key: string, expirationInMs: number }
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

    beforeAll(() => {
      key = 'any_key'
      expirationInMs = 1000
    })

    test('should call sign with correct input', async () => {
      await sut.generate({ key, expirationInMs })

      expect(fakeJwt.sign).toHaveBeenCalledWith({ key }, secret, { expiresIn: 1 })
    })
  })
})
