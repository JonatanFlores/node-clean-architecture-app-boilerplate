import bcrypt from 'bcrypt'

jest.mock('bcrypt')

class BcryptHashHandler {
  async compare (plaintext: string, digest: string): Promise<void> {
    await bcrypt.compare(plaintext, digest)
  }
}

describe('BcryptHashHandler', () => {
  let sut: BcryptHashHandler
  let fakeBcrypt: jest.Mocked<typeof bcrypt>

  beforeAll(() => {
    fakeBcrypt = bcrypt as jest.Mocked<typeof bcrypt>
  })

  beforeEach(() => {
    sut = new BcryptHashHandler()
  })

  describe('compare', () => {
    test('should call compare with correct values', async () => {
      await sut.compare('any_value', 'any_hashed_value')

      expect(fakeBcrypt.compare).toHaveBeenCalledWith('any_value', 'any_hashed_value')
      expect(fakeBcrypt.compare).toHaveBeenCalledTimes(1)
    })
  })
})
