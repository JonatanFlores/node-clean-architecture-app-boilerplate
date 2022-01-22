import { AddUserAccount, setupAddUserAccount } from '@/domain/usecases'
import { LoadUserAccount, SaveUserAccount, SaveUserToken } from '@/domain/contracts/repos/mongo'
import { Hasher, Mail, TokenGenerator } from '@/domain/contracts/gateways'

import path from 'path'
import { MockProxy, mock } from 'jest-mock-extended'

jest.mock('path')

describe('AddUserAccount', () => {
  let id: string
  let email: string
  let password: string
  let passwordHashed: string
  let isVerified: boolean
  let env: { [key: string]: any }
  let userAccountRepo: MockProxy<LoadUserAccount & SaveUserAccount>
  let userTokenRepo: MockProxy<SaveUserToken>
  let hasher: MockProxy<Hasher>
  let token: MockProxy<TokenGenerator>
  let mail: MockProxy<Mail>
  let sut: AddUserAccount

  beforeAll(() => {
    id = 'any_id'
    email = 'any_mail@mail.com'
    password = 'any_password'
    passwordHashed = 'any_hashed_password'
    isVerified = false
    env = {
      appName: 'AppName',
      frontendUrl: 'http://localhost:3000',
      mail: {
        defaults: {
          from: {
            name: 'AppName',
            email: 'appname@mail.com'
          }
        }
      }
    }
    userAccountRepo = mock()
    userAccountRepo.save.mockResolvedValue({ id, email, password })
    userTokenRepo = mock()
    userTokenRepo.save.mockResolvedValue({
      id: 'user_token_id',
      userId: 'user_id',
      token: 'registration_token',
      createdAt: 'any_created_at_date'
    })
    hasher = mock()
    hasher.hash.mockResolvedValue(passwordHashed)
    token = mock()
    token.generate.mockResolvedValue('any_token')
    mail = mock()
    jest.spyOn(path, 'resolve').mockImplementation(() => 'any_file_path')
  })

  beforeEach(() => {
    sut = setupAddUserAccount(userAccountRepo, userTokenRepo, env, hasher, token, mail)
  })

  test('should call LoadUserAccount with the correct input', async () => {
    await sut({ email, password })

    expect(userAccountRepo.load).toHaveBeenCalledWith({ email })
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
  })

  test('should return EmailAlreadyInUse error if there is an user account with the given email', async () => {
    userAccountRepo.load.mockResolvedValueOnce({ id, email, password })

    const promise = sut({ email, password })

    await expect(promise).rejects.toThrow(new Error('Email already in use'))
  })

  test('should call Hasher with the correct input', async () => {
    await sut({ email, password })

    expect(hasher.hash).toHaveBeenCalledWith({ value: password })
    expect(hasher.hash).toHaveBeenCalledTimes(1)
  })

  test('should call SaveUserAccount with the correct input', async () => {
    await sut({ email, password })

    expect(userAccountRepo.save).toHaveBeenCalledWith({ email, password: passwordHashed, isVerified })
    expect(userAccountRepo.save).toHaveBeenCalledTimes(1)
  })

  test('should call TokenGenerator with correct input', async () => {
    const twoHoursInMs = 2 * 60 * 60 * 1000
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000

    await sut({ email, password })

    expect(token.generate).toHaveBeenCalledWith({ key: id, expirationInMs: twoHoursInMs })
    expect(token.generate).toHaveBeenCalledWith({ key: id, expirationInMs: thirtyDaysInMs })
    expect(token.generate).toHaveBeenCalledTimes(2)
  })

  test('should call SaveUserToken with the correct input', async () => {
    await sut({ email, password })

    expect(userTokenRepo.save).toHaveBeenCalledWith({ userId: id })
    expect(userTokenRepo.save).toHaveBeenCalledTimes(1)
  })

  test('should call Mail with correct input', async () => {
    await sut({ email, password })

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
      subject: '[AppName] Create Account Confirmation',
      templateData: {
        file: 'any_file_path',
        variables: {
          email,
          appName: 'AppName',
          link: `${String(env.frontendUrl)}/confirm-registration?token=registration_token`
        }
      }
    })
  })

  test('should return email, accessToken and refreshToken', async () => {
    const result = await sut({ email, password })

    expect(result).toEqual({
      email,
      accessToken: 'any_token',
      refreshToken: 'any_token'
    })
  })

  test('should rethrow if LoadUserAccount throws', async () => {
    userAccountRepo.load.mockRejectedValueOnce(new Error('load_user_error'))

    const promise = sut({ email, password })

    await expect(promise).rejects.toThrow(new Error('load_user_error'))
  })

  test('should rethrow if SaveUserAccount throws', async () => {
    userAccountRepo.save.mockRejectedValueOnce(new Error('save_user_error'))

    const promise = sut({ email, password })

    await expect(promise).rejects.toThrow(new Error('save_user_error'))
  })

  test('should rethrow if Hasher throws', async () => {
    hasher.hash.mockRejectedValueOnce(new Error('hasher_error'))

    const promise = sut({ email, password })

    await expect(promise).rejects.toThrow(new Error('hasher_error'))
  })

  test('should rethrow if TokenGenerator throws', async () => {
    token.generate.mockRejectedValueOnce(new Error('token_generate_error'))

    const promise = sut({ email, password })

    await expect(promise).rejects.toThrow(new Error('token_generate_error'))
  })
})
