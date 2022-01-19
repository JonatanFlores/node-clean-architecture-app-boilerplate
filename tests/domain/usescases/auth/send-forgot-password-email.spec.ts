import { SendForgotPasswordEmail, setupSendForgotPasswordEmail } from '@/domain/usecases'
import { Mail } from '@/domain/contracts/gateways'
import { LoadUserAccount, SaveUserToken } from '@/domain/contracts/repos/mongo'

import path from 'path'
import { mock, MockProxy } from 'jest-mock-extended'

describe('SendForgotPasswordEmail', () => {
  let id: string
  let email: string
  let password: string
  let token: string
  let userAccount: MockProxy<LoadUserAccount>
  let userToken: MockProxy<SaveUserToken>
  let mail: MockProxy<Mail>
  let sut: SendForgotPasswordEmail

  beforeAll(() => {
    id = 'any_id'
    email = 'any_email'
    password = 'any_password'
    token = 'any_token'
    userAccount = mock()
    userAccount.load.mockResolvedValue({ id, email, password })
    userToken = mock()
    userToken.save.mockResolvedValue({ id, createdAt: 'any_date', userId: 'any_user_id', token })
    mail = mock()
    jest.spyOn(path, 'resolve').mockImplementation(() => 'any_file_path')
  })

  beforeEach(() => {
    sut = setupSendForgotPasswordEmail(userAccount, userToken, mail)
  })

  test('should call LoadUserAccount with correct input', async () => {
    await sut({ email })

    expect(userAccount.load).toHaveBeenCalledWith({ email })
    expect(userAccount.load).toHaveBeenCalledTimes(1)
  })

  test('should call Mail with correct input', async () => {
    await sut({ email })

    expect(mail.send).toHaveBeenCalledTimes(1)
    expect(mail.send).toHaveBeenCalledWith({
      from: {
        name: 'AppName',
        email: 'appname@mail.com'
      },
      to: {
        name: email,
        email
      },
      subject: '[AppName] Password Recovery',
      templateData: {
        file: 'any_file_path',
        variables: {
          email,
          link: `http://localhost:3000/reset-password?token=${token}`
        }
      }
    })
  })

  test('should not call Mail if user was not found for the given email', async () => {
    userAccount.load.mockResolvedValueOnce(undefined)

    await sut({ email })

    expect(mail.send).not.toHaveBeenCalled()
  })

  test('should SaveUserToken with correct input', async () => {
    await sut({ email })

    expect(userToken.save).toHaveBeenCalledWith({ userId: id })
    expect(userToken.save).toHaveBeenCalledTimes(1)
  })
})
