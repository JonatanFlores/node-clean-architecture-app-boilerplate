import { DateDifferenceInHours } from '@/domain/contracts/gateways'
import { ChangeUserAccountVerificationStatus, LoadUser, LoadUserToken } from '@/domain/contracts/repos/mongo'
import { ConfirmUserAccountTokenExpiredError, ConfirmUserAccountTokenNotFoundError, UserNotFoundError } from '@/domain/entities/errors'
import { ConfirmUserAccountCreation, setupConfirmUserAccountCreation } from '@/domain/usecases'

import { mock, MockProxy } from 'jest-mock-extended'
import MockDate from 'mockdate'

describe('ConfirmUserAccountCreation', () => {
  let token: string
  let createdAt: string
  let userRepo: MockProxy<LoadUser>
  let userAccountRepo: MockProxy<ChangeUserAccountVerificationStatus>
  let userTokenRepo: MockProxy<LoadUserToken>
  let dateAdapter: MockProxy<DateDifferenceInHours>
  let sut: ConfirmUserAccountCreation

  beforeAll(() => {
    MockDate.set(new Date())
    token = 'any_token'
    createdAt = (new Date(2022, 0, 1, 0)).toISOString()
    userRepo = mock()
    userRepo.load.mockResolvedValue({
      id: 'any_user_id',
      email: 'any_email'
    })
    userAccountRepo = mock()
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
    sut = setupConfirmUserAccountCreation(userRepo, userAccountRepo, userTokenRepo, dateAdapter)
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

  test('should call LoadUser with correct input', async () => {
    await sut({ token })

    expect(userRepo.load).toHaveBeenCalledWith({ id: 'any_user_id' })
    expect(userRepo.load).toHaveBeenCalledTimes(1)
  })

  test('should throw UserNotFoundError if LoadUser returns undefined', async () => {
    userRepo.load.mockResolvedValueOnce(undefined)

    const promise = sut({ token })

    await expect(promise).rejects.toThrow(new UserNotFoundError())
  })

  test('should call ChangeUserAccountVerificationStatus with the correct input', async () => {
    await sut({ token })

    expect(userAccountRepo.changeIsVerified).toHaveBeenCalledTimes(1)
    expect(userAccountRepo.changeIsVerified).toHaveBeenCalledWith({
      id: 'any_user_id',
      isVerified: true
    })
  })
})
