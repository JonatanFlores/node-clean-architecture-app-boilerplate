import { TokenValidator } from '@/domain/contracts/gateways'

import { mock, MockProxy } from 'jest-mock-extended'

type Setup = (token: TokenValidator, userRepo: LoadUser) => RefreshToken
type Input = { refreshToken: string }
export type RefreshToken = (input: Input) => Promise<void>

const setupRefreshToken: Setup = (token, userRepo) => async ({ refreshToken }) => {
  const userId = await token.validate({ token: refreshToken })
  await userRepo.load({ id: userId })
}

interface LoadUser {
  load: (input: LoadUser.Input) => Promise<void>
}

export namespace LoadUser {
  export type Input = { id: string }
}

describe('RefreshToken', () => {
  let refreshToken: string
  let id: string
  let token: MockProxy<TokenValidator>
  let userRepo: MockProxy<LoadUser>
  let sut: RefreshToken

  beforeAll(() => {
    refreshToken = 'any_refresh_token'
    id = 'any_user_id'
    token = mock()
    token.validate.mockResolvedValue(id)
    userRepo = mock()
  })

  beforeEach(() => {
    sut = setupRefreshToken(token, userRepo)
  })

  test('should call TokenValidator with correct input', async () => {
    await sut({ refreshToken })

    expect(token.validate).toHaveBeenCalledWith({ token: refreshToken })
    expect(token.validate).toHaveBeenCalledTimes(1)
  })

  test('should call TokenValidator with correct input', async () => {
    await sut({ refreshToken })

    expect(userRepo.load).toHaveBeenCalledWith({ id })
    expect(userRepo.load).toHaveBeenCalledTimes(1)
  })
})
