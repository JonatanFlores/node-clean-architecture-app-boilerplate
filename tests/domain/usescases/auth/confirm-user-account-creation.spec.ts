import { DateDifferenceInHours } from '@/domain/contracts/gateways'
import { LoadUserToken } from '@/domain/contracts/repos/mongo'

import { mock, MockProxy } from 'jest-mock-extended'
import MockDate from 'mockdate'

type Setup = (userTokenRepo: LoadUserToken, dateAdapter: DateDifferenceInHours) => ConfirmUserAccountCreation
type Input = { token: string }
export type ConfirmUserAccountCreation = (input: Input) => Promise<void>

export class ConfirmUserAccountTokenNotFoundError extends Error {
  constructor () {
    super('User account confirmation token is invalid')
    this.name = 'ConfirmUserAccountTokenNotFoundError'
  }
}

export class ConfirmUserAccountTokenExpiredError extends Error {
  constructor () {
    super('Cannot activate user account, because activation token is already expired')
    this.name = 'ConfirmUserAccountTokenExpiredError'
  }
}

export const setupConfirmUserAccountCreation: Setup = (userTokenRepo, dateAdapter) => async ({ token }) => {
  const userToken = await userTokenRepo.load({ token })
  if (userToken === undefined) throw new ConfirmUserAccountTokenNotFoundError()
  const { createdAt } = userToken
  const tokenExpirationLimitInHours = 2
  const tokenCreationInHours = dateAdapter.diffInHours(new Date(createdAt), new Date())
  if (tokenCreationInHours > tokenExpirationLimitInHours) throw new ConfirmUserAccountTokenExpiredError()
}

describe('ConfirmUserAccountCreation', () => {
  let token: string
  let createdAt: string
  let userTokenRepo: MockProxy<LoadUserToken>
  let dateAdapter: MockProxy<DateDifferenceInHours>
  let sut: ConfirmUserAccountCreation

  beforeAll(() => {
    MockDate.set(new Date())
    token = 'any_token'
    createdAt = (new Date(2022, 0, 1, 0)).toISOString()
    userTokenRepo = mock()
    userTokenRepo.load.mockResolvedValue({
      id: 'any_user_token_id',
      userId: 'any_user_id',
      createdAt,
      token
    })
    dateAdapter = mock()
    dateAdapter.diffInHours.mockReturnValue(1)
  })

  afterAll(() => {
    MockDate.reset()
  })

  beforeEach(() => {
    sut = setupConfirmUserAccountCreation(userTokenRepo, dateAdapter)
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

  test('should call DateDifferenceInHours with correct input', async () => {
    const previousDate = new Date()
    const threeHoursAfterCreatedAt = new Date(2022, 0, 3, 0)
    MockDate.set(threeHoursAfterCreatedAt)

    await sut({ token })

    expect(dateAdapter.diffInHours).toHaveBeenCalledTimes(1)
    expect(dateAdapter.diffInHours).toHaveBeenCalledWith(
      new Date(createdAt),
      threeHoursAfterCreatedAt
    )
    MockDate.set(previousDate)
  })

  test('should not be able to activate account after 2 hours', async () => {
    dateAdapter.diffInHours.mockReturnValueOnce(3)

    const promise = sut({ token })

    await expect(promise).rejects.toThrow(new ConfirmUserAccountTokenExpiredError())
  })
})
