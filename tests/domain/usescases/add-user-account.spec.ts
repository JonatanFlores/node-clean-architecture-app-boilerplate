import { LoadUserAccount } from '@/domain/contracts/repos/mongo'

import { MockProxy, mock } from 'jest-mock-extended'

export interface Hasher {
  hash: (input: Hasher.Input) => Promise<Hasher.Output>
}

export namespace Hasher {
  export type Input = { value: string }
  export type Output = string
}

export interface SaveUserAccount {
  save: (input: SaveUserAccount.Input) => Promise<void>
}

export namespace SaveUserAccount {
  export type Input = { email: string, password: string }
}

type Setup = (userAccountRepo: LoadUserAccount & SaveUserAccount, hasher: Hasher) => AddUserAccount
type Input = { email: string, password: string }
export type AddUserAccount = (input: Input) => Promise<void>

export const setupAddUserAccount: Setup = (userAccountRepo, hasher) => async ({ email, password }) => {
  await userAccountRepo.load({ email })
  const passwordHashed = await hasher.hash({ value: password })
  await userAccountRepo.save({ email, password: passwordHashed })
}

describe('AddUserAccount', () => {
  let email: string
  let password: string
  let passwordHashed: string
  let userAccountRepo: MockProxy<LoadUserAccount & SaveUserAccount>
  let hasher: MockProxy<Hasher>
  let sut: AddUserAccount

  beforeAll(() => {
    email = 'any_mail@mail.com'
    password = 'any_password'
    passwordHashed = 'any_hashed_password'
    userAccountRepo = mock()
    hasher = mock()
    hasher.hash.mockResolvedValue(passwordHashed)
  })

  beforeEach(() => {
    sut = setupAddUserAccount(userAccountRepo, hasher)
  })

  test('should call LoadUserAccount with the correct input', async () => {
    await sut({ email, password })

    expect(userAccountRepo.load).toHaveBeenCalledWith({ email })
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
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
})