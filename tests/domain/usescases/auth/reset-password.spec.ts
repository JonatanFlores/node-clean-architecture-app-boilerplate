import { mock, MockProxy } from 'jest-mock-extended'

type Setup = (userToken: LoadUserToken) => ResetPassword
type Input = { token: string, password: string }
export type ResetPassword = (input: Input) => Promise<void>

const setupResetPassword: Setup = (userToken) => async ({ token }) => {
  await userToken.load({ token })
}

export interface LoadUserToken {
  load: (input: LoadUserToken.Input) => Promise<void>
}

export namespace LoadUserToken {
  export type Input = { token: string }
}

describe('ResetPassword', () => {
  let password: string
  let token: string
  let userToken: MockProxy<LoadUserToken>
  let sut: ResetPassword

  beforeAll(() => {
    password = 'any_password'
    token = 'any_reset_password_token'
    userToken = mock()
  })

  beforeEach(() => {
    sut = setupResetPassword(userToken)
  })

  test('should call LoadUserToken with correct input', async () => {
    await sut({ token, password })

    expect(userToken.load).toHaveBeenCalledWith({ token })
    expect(userToken.load).toHaveBeenCalledTimes(1)
  })
})
