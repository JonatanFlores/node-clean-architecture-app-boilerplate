import { LoadUserAccount } from '@/domain/contracts/repos/mongo'

import { mock, MockProxy } from 'jest-mock-extended'

type Setup = (userAccount: LoadUserAccount) => SendForgotPasswordEmail
type Input = { email: string }
export type SendForgotPasswordEmail = (input: Input) => Promise<void>

const setupSendForgotPasswordEmail: Setup = (userAccount) => async ({ email }) => {
  await userAccount.load({ email })
}

describe('SendForgotPasswordEmail', () => {
  let email: string
  let userAccount: MockProxy<LoadUserAccount>
  let sut: SendForgotPasswordEmail

  beforeAll(() => {
    email = 'any_email'
    userAccount = mock()
  })

  beforeEach(() => {
    sut = setupSendForgotPasswordEmail(userAccount)
  })

  test('should call LoadUserAccount with correct input', async () => {
    await sut({ email })

    expect(userAccount.load).toHaveBeenCalledWith({ email })
    expect(userAccount.load).toHaveBeenCalledTimes(1)
  })
})
