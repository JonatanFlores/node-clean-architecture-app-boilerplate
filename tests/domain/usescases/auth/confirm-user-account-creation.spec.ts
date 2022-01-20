import { LoadUserToken } from '@/domain/contracts/repos/mongo'

import { mock, MockProxy } from 'jest-mock-extended'
import MockDate from 'mockdate'

type Setup = (userTokenRepo: LoadUserToken) => ConfirmUserAccountCreation
type Input = { token: string }
export type ConfirmUserAccountCreation = (input: Input) => Promise<void>

export class ConfirmUserAccountTokenNotFoundError extends Error {
  constructor () {
    super('User account confirmation token is invalid')
    this.name = 'ConfirmUserAccountTokenNotFoundError'
  }
}

export const setupConfirmUserAccountCreation: Setup = (userTokenRepo) => async ({ token }) => {
  const userToken = await userTokenRepo.load({ token })
  if (userToken === undefined) throw new ConfirmUserAccountTokenNotFoundError()
}

describe('ConfirmUserAccountCreation', () => {
  let token: string
  let userTokenRepo: MockProxy<LoadUserToken>
  let sut: ConfirmUserAccountCreation

  beforeAll(() => {
    MockDate.set(new Date())
    token = 'any_token'
    userTokenRepo = mock()
    userTokenRepo.load.mockResolvedValue({
      id: 'any_user_token_id',
      userId: 'any_user_id',
      createdAt: (new Date(2022, 0, 1, 0)).toISOString(),
      token
    })
  })

  afterAll(() => {
    MockDate.reset()
  })

  beforeEach(() => {
    sut = setupConfirmUserAccountCreation(userTokenRepo)
  })

  test('should call LoadUserToken with correct input', async () => {
    await sut({ token })

    expect(userTokenRepo.load).toHaveBeenCalledWith({ token })
    expect(userTokenRepo.load).toHaveBeenCalledTimes(1)
  })

  test('should throw ConfirmUserAccountTokenNotFoundError if LoadUserToken returns undefined', async () => {
    userTokenRepo.load.mockResolvedValueOnce(undefined)

    const promise = sut({ token })

    await expect(promise).rejects.toThrow(new ConfirmUserAccountTokenNotFoundError())
  })
})
