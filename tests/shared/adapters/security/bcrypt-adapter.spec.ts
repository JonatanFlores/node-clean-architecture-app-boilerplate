import { BcryptAdapter } from '@/shared/adapters/security'

import bcrypt from 'bcrypt'

jest.mock('bcrypt')

describe('BcryptAdapter', () => {
  let salt: number
  let plaintext: string
  let digest: string
  let sut: BcryptAdapter
  let fakeBcrypt: jest.Mocked<typeof bcrypt>

  beforeAll(() => {
    salt = 12
    plaintext = 'any_value'
    digest = 'any_hashed_value'
    fakeBcrypt = bcrypt as jest.Mocked<typeof bcrypt>
  })

  beforeEach(() => {
    sut = new BcryptAdapter(salt)
  })

  describe('compare', () => {
    beforeAll(() => {
      fakeBcrypt.compare.mockImplementation(() => true)
    })

    test('should call compare with correct input', async () => {
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

  describe('hash', () => {
    beforeAll(() => {
      fakeBcrypt.hash.mockImplementation(() => digest)
    })

    test('should call hash with correct input', async () => {
      await sut.hash({ value: plaintext })

      expect(fakeBcrypt.hash).toHaveBeenCalledWith(plaintext, salt)
      expect(fakeBcrypt.hash).toHaveBeenCalledTimes(1)
    })

    test('should return the hashed value', async () => {
      const result = await sut.hash({ value: plaintext })

      expect(result).toEqual(digest)
    })

    test('should rethrow if hash throws', async () => {
      fakeBcrypt.hash.mockImplementationOnce(() => { throw new Error('hash_error') })

      const promise = sut.hash({ value: plaintext })

      await expect(promise).rejects.toThrow(new Error('hash_error'))
    })
  })
})
