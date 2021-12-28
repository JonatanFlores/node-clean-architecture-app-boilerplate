import { LoadUserAccount } from '@/domain/contracts/repos/mongo'

import { MockProxy, mock } from 'jest-mock-extended'

export interface Hasher {
  hash: (input: Hasher.Input) => Promise<Hasher.Output>
}

export namespace Hasher {
  export type Input = { value: string }
  export type Output = string
}

type Setup = (userAccountRepo: LoadUserAccount, hasher: Hasher) => AddUserAccount
type Input = { email: string, password: string }
export type AddUserAccount = (input: Input) => Promise<void>

export const setupAddUserAccount: Setup = (userAccountRepo, hasher) => async ({ email, password }) => {
  await userAccountRepo.load({ email })
  await hasher.hash({ value: password })
}

describe('AddUserAccount', () => {
  let email: string
  let password: string
  let userAccountRepo: MockProxy<LoadUserAccount>
  let hasher: MockProxy<Hasher>
  let sut: AddUserAccount

  beforeAll(() => {
    email = 'any_mail@mail.com'
    password = 'any_password'
    userAccountRepo = mock()
    hasher = mock()
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
})
