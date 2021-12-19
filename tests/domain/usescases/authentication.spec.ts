import { mock, MockProxy } from 'jest-mock-extended'

type Setup = (userAccountRepo: LoadUserAccount) => Authentication
type Input = { email: string, password: string }
type Authentication = (input: Input) => Promise<void>

interface LoadUserAccount {
  load: (input: LoadUserAccount.Input) => Promise<void>
}

namespace LoadUserAccount {
  export type Input = { email: string }
}

const setupAuthentication: Setup = (userAccountRepo: LoadUserAccount) => async ({ email }) => {
  await userAccountRepo.load({ email })
}

describe('Authentication', () => {
  let email: string
  let password: string
  let userAccountRepo: MockProxy<LoadUserAccount>
  let sut: Authentication

  beforeAll(() => {
    email = 'any_email'
    password = 'any_password'
    userAccountRepo = mock()
  })

  beforeEach(() => {
    sut = setupAuthentication(userAccountRepo)
  })

  test('should call LoadUser with correct input', async () => {
    await sut({ email, password })

    expect(userAccountRepo.load).toHaveBeenCalledWith({ email })
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
  })
})
