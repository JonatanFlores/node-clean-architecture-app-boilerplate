import { mock, MockProxy } from 'jest-mock-extended'

type Setup = (userTokenRepo: LoadUserToken) => ResetPassword
type Input = { token: string, password: string }
export type ResetPassword = (input: Input) => Promise<void>

const setupResetPassword: Setup = (userTokenRepo) => async ({ token }) => {
  const userToken = await userTokenRepo.load({ token })
  if (userToken === undefined) throw new ResetPasswordTokenError()
}

export interface LoadUserToken {
  load: (input: LoadUserToken.Input) => Promise<LoadUserToken.Output>
}

export namespace LoadUserToken {
  export type Input = { token: string }
  export type Output = undefined | { id: string, userId: string, token: string }
}

export class ResetPasswordTokenError extends Error {
  constructor () {
    super('Invalid reset password token')
    this.name = 'ResetPasswordTokenError'
  }
}

describe('ResetPassword', () => {
  let password: string
  let token: string
  let userTokenRepo: MockProxy<LoadUserToken>
  let sut: ResetPassword

  beforeAll(() => {
    password = 'any_password'
    token = 'any_reset_password_token'
    userTokenRepo = mock()
    userTokenRepo.load.mockResolvedValue({
      id: 'any_user_token_id',
      userId: 'any_user_id',
      token
    })
  })

  beforeEach(() => {
    sut = setupResetPassword(userTokenRepo)
  })

  test('should call LoadUserToken with correct input', async () => {
    await sut({ token, password })

    expect(userTokenRepo.load).toHaveBeenCalledWith({ token })
    expect(userTokenRepo.load).toHaveBeenCalledTimes(1)
  })

  test('should throw ResetPasswordTokenError if cannot find the given token', async () => {
    userTokenRepo.load.mockResolvedValueOnce(undefined)

    const promise = sut({ token, password })

    await expect(promise).rejects.toThrow(new ResetPasswordTokenError())
  })
})
