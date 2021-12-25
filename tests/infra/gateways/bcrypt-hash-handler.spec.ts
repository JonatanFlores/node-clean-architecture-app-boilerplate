import { BcryptHashHandler } from '@/infra/gateways'

import bcrypt from 'bcrypt'

jest.mock('bcrypt')

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
    let plaintext: string
    let digest: string

    beforeAll(() => {
      plaintext = 'any_value'
      digest = 'any_hashed_value'
      fakeBcrypt.compare.mockImplementation(() => true)
    })

    test('should call compare with correct values', async () => {
      await sut.compare({ plaintext, digest })

      expect(fakeBcrypt.compare).toHaveBeenCalledWith(plaintext, digest)
      expect(fakeBcrypt.compare).toHaveBeenCalledTimes(1)
    })

    test('should return true when hash verification succeds', async () => {
      const result = await sut.compare({ plaintext, digest })

      expect(result).toBe(true)
    })

    test('should return false when hash verification fails', async () => {
      fakeBcrypt.compare.mockImplementationOnce(() => false)

      const result = await sut.compare({ plaintext, digest })

      expect(result).toBe(false)
    })

    test('should throw if compare throws', async () => {
      const error = new Error('compare_error')
      fakeBcrypt.compare.mockImplementationOnce(() => { throw error })

      const promise = sut.compare({ plaintext, digest })

      await expect(promise).rejects.toThrow(error)
    })
  })
})
