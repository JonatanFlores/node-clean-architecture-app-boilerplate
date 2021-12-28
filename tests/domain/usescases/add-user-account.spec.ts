import { LoadUserAccount } from '@/domain/contracts/repos/mongo'
import { EmailAlreadyInUseError } from '@/domain/entities/errors'
import { TokenGenerator } from '@/domain/contracts/gateways'

import { MockProxy, mock } from 'jest-mock-extended'

export interface Hasher {
  hash: (input: Hasher.Input) => Promise<Hasher.Output>
}

export namespace Hasher {
  export type Input = { value: string }
  export type Output = string
}

export interface SaveUserAccount {
  save: (input: SaveUserAccount.Input) => Promise<SaveUserAccount.Output>
}

export namespace SaveUserAccount {
  export type Input = { email: string, password: string }
  export type Output = { id: string, email: string, password: string }
}

type Setup = (userAccountRepo: LoadUserAccount & SaveUserAccount, hasher: Hasher, token: TokenGenerator) => AddUserAccount
type Input = { email: string, password: string }
type Output = { email: string, accessToken: string }
export type AddUserAccount = (input: Input) => Promise<Output>

export const setupAddUserAccount: Setup = (userAccountRepo, hasher, token) => async ({ email, password }) => {
  const userAccount = await userAccountRepo.load({ email })
  if (userAccount !== undefined) throw new EmailAlreadyInUseError()
  const passwordHashed = await hasher.hash({ value: password })
  const { id } = await userAccountRepo.save({ email, password: passwordHashed })
  const twoHoursInMs = 2 * 60 * 60 * 1000
  const accessToken = await token.generate({ key: id, expirationInMs: twoHoursInMs })
  return { email, accessToken }
}

describe('AddUserAccount', () => {
  let id: string
  let email: string
  let password: string
  let passwordHashed: string
  let accessToken: string
  let userAccountRepo: MockProxy<LoadUserAccount & SaveUserAccount>
  let hasher: MockProxy<Hasher>
  let token: MockProxy<TokenGenerator>
  let sut: AddUserAccount

  beforeAll(() => {
    id = 'any_id'
    email = 'any_mail@mail.com'
    password = 'any_password'
    passwordHashed = 'any_hashed_password'
    accessToken = 'any_access_token'
    userAccountRepo = mock()
    userAccountRepo.save.mockResolvedValue({ id, email, password })
    hasher = mock()
    hasher.hash.mockResolvedValue(passwordHashed)
    token = mock()
    token.generate.mockResolvedValue(accessToken)
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

    await sut({ email, password })

    expect(token.generate).toHaveBeenCalledWith({ key: id, expirationInMs: twoHoursInMs })
    expect(token.generate).toHaveBeenCalledTimes(1)
  })

  test('should return email and accessToken', async () => {
    const result = await sut({ email, password })

    expect(result).toEqual({ email, accessToken })
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
})
