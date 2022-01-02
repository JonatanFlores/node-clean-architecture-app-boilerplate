import { TokenValidator } from '@/domain/contracts/gateways'

import { mock, MockProxy } from 'jest-mock-extended'

type Setup = (token: TokenValidator) => RefreshToken
type Input = { refreshToken: string }
export type RefreshToken = (input: Input) => Promise<void>

const setupRefreshToken: Setup = (token) => async ({ refreshToken }) => {
  await token.validate({ token: refreshToken })
}

describe('RefreshToken', () => {
  let refreshToken: string
  let token: MockProxy<TokenValidator>
  let sut: RefreshToken

  beforeAll(() => {
    refreshToken = 'any_refresh_token'
    token = mock()
  })

  beforeEach(() => {
    sut = setupRefreshToken(token)
  })

  test('should call TokenValidator with correct input', async () => {
    await sut({ refreshToken })

    expect(token.validate).toHaveBeenCalledWith({ token: refreshToken })
    expect(token.validate).toHaveBeenCalledTimes(1)
  })
})
