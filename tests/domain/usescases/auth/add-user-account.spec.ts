import { AddUserAccount, setupAddUserAccount } from '@/domain/usecases'
import { LoadUserAccount, SaveUserAccount } from '@/domain/contracts/repos/mongo'
import { Hasher, TokenGenerator } from '@/domain/contracts/gateways'

import { MockProxy, mock } from 'jest-mock-extended'

describe('AddUserAccount', () => {
  let id: string
  let email: string
  let password: string
  let passwordHashed: string
  let userAccountRepo: MockProxy<LoadUserAccount & SaveUserAccount>
  let hasher: MockProxy<Hasher>
  let token: MockProxy<TokenGenerator>
  let sut: AddUserAccount

  beforeAll(() => {
    id = 'any_id'
    email = 'any_mail@mail.com'
    password = 'any_password'
    passwordHashed = 'any_hashed_password'
    userAccountRepo = mock()
    userAccountRepo.save.mockResolvedValue({ id, email, password })
    hasher = mock()
    hasher.hash.mockResolvedValue(passwordHashed)
    token = mock()
    token.generate.mockResolvedValue('any_token')
  })

  beforeEach(() => {
    sut = setupAddUserAccount(userAccountRepo, hasher, token)
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

    expect(userAccountRepo.save).toHaveBeenCalledWith({ email, password: passwordHashed })
    expect(userAccountRepo.save).toHaveBeenCalledTimes(1)
  })

  test('should call TokenGenerator with correct input', async () => {
    const twoHoursInMs = 2 * 60 * 60 * 1000
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000

    await sut({ email, password })

    expect(token.generate).toHaveBeenCalledWith({ key: 'any_id', expirationInMs: twoHoursInMs })
    expect(token.generate).toHaveBeenCalledWith({ key: 'any_id', expirationInMs: thirtyDaysInMs })
    expect(token.generate).toHaveBeenCalledTimes(2)
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
