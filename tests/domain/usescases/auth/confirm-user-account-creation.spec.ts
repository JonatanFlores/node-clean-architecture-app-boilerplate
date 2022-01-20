import { LoadUserToken } from '@/domain/contracts/repos/mongo'

import { mock, MockProxy } from 'jest-mock-extended'

type Setup = (userTokenRepo: LoadUserToken) => ConfirmUserAccountCreation
type Input = { token: string }
export type ConfirmUserAccountCreation = (input: Input) => Promise<void>

export const setupConfirmUserAccountCreation: Setup = (userTokenRepo) => async ({ token }) => {
  await userTokenRepo.load({ token })
}

describe('ConfirmUserAccountCreation', () => {
  let token: string
  let userTokenRepo: MockProxy<LoadUserToken>
  let sut: ConfirmUserAccountCreation

  beforeAll(() => {
    token = 'any_token'
    userTokenRepo = mock()
  })

  beforeEach(() => {
    sut = setupConfirmUserAccountCreation(userTokenRepo)
  })

  test('should call LoadUserToken with correct input', async () => {
    await sut({ token })

    expect(userTokenRepo.load).toHaveBeenCalledWith({ token })
    expect(userTokenRepo.load).toHaveBeenCalledTimes(1)
  })
})
