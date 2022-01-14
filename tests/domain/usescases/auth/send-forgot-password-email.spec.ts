import { LoadUserAccount, SaveUserToken } from '@/domain/contracts/repos/mongo'

import { mock, MockProxy } from 'jest-mock-extended'

type Setup = (userAccount: LoadUserAccount, userToken: SaveUserToken, mail: Mail, to: string, body: string) => SendForgotPasswordEmail
type Input = { email: string }
export type SendForgotPasswordEmail = (input: Input) => Promise<void>

const setupSendForgotPasswordEmail: Setup = (userAccount, userToken, mail, to, body) => async ({ email }) => {
  const userAccountData = await userAccount.load({ email })
  if (userAccountData !== undefined) {
    const { id } = userAccountData
    await userToken.save({ userId: id })
    await mail.send({ to, body })
  }
}

export interface Mail {
  send: ({ to, body }: Mail.Input) => Promise<void>
}

export namespace Mail {
  export type Input = { to: string, body: string }
}

describe('SendForgotPasswordEmail', () => {
  let id: string
  let email: string
  let password: string
  let to: string
  let body: string
  let userAccount: MockProxy<LoadUserAccount>
  let userToken: MockProxy<SaveUserToken>
  let mail: MockProxy<Mail>
  let sut: SendForgotPasswordEmail

  beforeAll(() => {
    id = 'any_id'
    email = 'any_email'
    password = 'any_password'
    to = 'any_email_to'
    body = 'any_body'
    userAccount = mock()
    userAccount.load.mockResolvedValue({ id, email, password })
    userToken = mock()
    mail = mock()
  })

  beforeEach(() => {
    sut = setupSendForgotPasswordEmail(userAccount, userToken, mail, to, body)
  })

  test('should call LoadUserAccount with correct input', async () => {
    await sut({ email })

    expect(userAccount.load).toHaveBeenCalledWith({ email })
    expect(userAccount.load).toHaveBeenCalledTimes(1)
  })

  test('should call Mail with correct input', async () => {
    await sut({ email })

    expect(mail.send).toHaveBeenCalledWith({ to, body })
    expect(mail.send).toHaveBeenCalledTimes(1)
  })

  test('should not call Mail if user was not found for the given email', async () => {
    userAccount.load.mockResolvedValueOnce(undefined)

    await sut({ email })

    expect(mail.send).not.toHaveBeenCalled()
  })

  test('should SaveUserToken with correct input', async () => {
    await sut({ email })

    expect(userToken.save).toHaveBeenCalledWith({ userId: id })
  })
})
