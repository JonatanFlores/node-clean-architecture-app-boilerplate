import { RefreshTokenType, setupRefreshToken } from '@/domain/usecases'
import { TokenValidator, TokenGenerator } from '@/domain/contracts/gateways'
import { LoadUser } from '@/domain/contracts/repos/mongo'

import { mock, MockProxy } from 'jest-mock-extended'

describe('RefreshToken', () => {
  let currentRefreshToken: string
  let id: string
  let email: string
  let token: MockProxy<TokenValidator & TokenGenerator>
  let userRepo: MockProxy<LoadUser>
  let sut: RefreshTokenType

  beforeAll(() => {
    currentRefreshToken = 'any_refresh_token'
    id = 'any_user_id'
    email = 'any_email'
    token = mock()
    token.validate.mockResolvedValue(id)
    token.generate.mockResolvedValue('any_generated_token')
    userRepo = mock()
    userRepo.load.mockResolvedValue({ id, email })
  })

  beforeEach(() => {
    sut = setupRefreshToken(token, userRepo)
  })

  test('should call TokenValidator with correct input', async () => {
    await sut({ currentRefreshToken })

    expect(token.validate).toHaveBeenCalledWith({ token: currentRefreshToken })
    expect(token.validate).toHaveBeenCalledTimes(1)
  })

  test('should call TokenValidator with correct input', async () => {
    await sut({ currentRefreshToken })

    expect(userRepo.load).toHaveBeenCalledWith({ id })
    expect(userRepo.load).toHaveBeenCalledTimes(1)
  })

  test('should call TokenGenerator with correct input', async () => {
    const twoHoursInMs = 2 * 60 * 60 * 1000
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000

    await sut({ currentRefreshToken })

    expect(token.generate).toHaveBeenCalledWith({ key: id, expirationInMs: twoHoursInMs })
    expect(token.generate).toHaveBeenCalledWith({ key: id, expirationInMs: thirtyDaysInMs })
    expect(token.generate).toHaveBeenCalledTimes(2)
  })

  test('should return an email, access token and refresh token on success', async () => {
    const result = await sut({ currentRefreshToken })

    expect(result).toEqual({
      email,
      accessToken: 'any_generated_token',
      refreshToken: 'any_generated_token'
    })
  })
})
