import bcrypt from 'bcrypt'

jest.mock('bcrypt')

class BcryptHashHandler {
  async compare (plaintext: string, digest: string): Promise<boolean> {
    return bcrypt.compare(plaintext, digest)
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
    beforeAll(() => {
      fakeBcrypt.compare.mockImplementation(() => true)
    })

    test('should call compare with correct values', async () => {
      await sut.compare('any_value', 'any_hashed_value')

      expect(fakeBcrypt.compare).toHaveBeenCalledWith('any_value', 'any_hashed_value')
      expect(fakeBcrypt.compare).toHaveBeenCalledTimes(1)
    })

    test('should return true when hash verification succeds', async () => {
      const result = await sut.compare('any_value', 'any_hashed_value')

      expect(result).toBe(true)
    })

    test('should return false when hash verification fails', async () => {
      fakeBcrypt.compare.mockImplementationOnce(() => false)

      const result = await sut.compare('any_value', 'invalid_hashed_value')

      expect(result).toBe(false)
    })

    test('should throw if compare throws', async () => {
      const error = new Error('compare_error')
      fakeBcrypt.compare.mockImplementationOnce(() => { throw error })

      const promise = sut.compare('any_value', 'invalid_hashed_value')

      await expect(promise).rejects.toThrow(error)
    })
  })
})
