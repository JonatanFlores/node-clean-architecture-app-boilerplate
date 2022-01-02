import { TokenValidator, TokenGenerator } from '@/domain/contracts/gateways'
import { AuthenticationError } from '@/domain/entities/errors'
import { AccessToken, RefreshToken } from '@/domain/entities'

import { mock, MockProxy } from 'jest-mock-extended'

type Setup = (token: TokenValidator & TokenGenerator, userRepo: LoadUser) => RefreshTokenType
type Input = { currentRefreshToken: string }
type Output = { email: string, accessToken: string, refreshToken: string }
export type RefreshTokenType = (input: Input) => Promise<Output>

const setupRefreshToken: Setup = (token, userRepo) => async ({ currentRefreshToken }) => {
  const userId = await token.validate({ token: currentRefreshToken })
  const user = await userRepo.load({ id: userId })
  if (user === undefined) throw new AuthenticationError()
  const accessToken = await token.generate({ key: user.id, expirationInMs: AccessToken.expirationInMs })
  const refreshToken = await token.generate({ key: user.id, expirationInMs: RefreshToken.expirationInMs })
  return { email: user.email, accessToken, refreshToken }
}

interface LoadUser {
  load: (input: LoadUser.Input) => Promise<LoadUser.Output>
}

export namespace LoadUser {
  export type Input = { id: string }
  export type Output = undefined | {
    id: string
    email: string
  }
}

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
