import { LoadUserAccount } from '@/domain/contracts/repos/mongo'

import { MockProxy, mock } from 'jest-mock-extended'

type Setup = (userAccountRepo: LoadUserAccount) => AddUserAccount
type Input = { email: string }
export type AddUserAccount = (input: Input) => Promise<void>

export const setupAddUserAccount: Setup = (userAccountRepo) => async ({ email }) => {
  await userAccountRepo.load({ email })
}

describe('AddUserAccount', () => {
  let email: string
  let userAccountRepo: MockProxy<LoadUserAccount>
  let sut: AddUserAccount

  beforeAll(() => {
    email = 'any_mail@mail.com'
    userAccountRepo = mock()
  })

  beforeEach(() => {
    sut = setupAddUserAccount(userAccountRepo)
  })

  test('should call LoadUserAccount with the correct input', async () => {
    await sut({ email })

    expect(userAccountRepo.load).toHaveBeenCalledWith({ email })
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
  })
})
