import { ResetPassword, setupResetPassword } from '@/domain/usecases'
import { ChangeUserAccountPassword, LoadUser, LoadUserToken } from '@/domain/contracts/repos/mongo'
import { DateDifferenceInHours, Hasher } from '@/domain/contracts/gateways'
import { ResetPasswordTokenExpiredError, ResetPasswordTokenNotFoundError, UserNotFoundError } from '@/domain/entities/errors'

import { mock, MockProxy } from 'jest-mock-extended'
import MockDate from 'mockdate'

describe('ResetPassword', () => {
  let password: string
  let passwordHashed: string
  let token: string
  let createdAt: string
  let userTokenRepo: MockProxy<LoadUserToken>
  let userRepo: MockProxy<LoadUser>
  let userAccountRepo: MockProxy<ChangeUserAccountPassword>
  let hasher: MockProxy<Hasher>
  let dateHandler: MockProxy<DateDifferenceInHours>
  let sut: ResetPassword

  beforeAll(() => {
    MockDate.set(new Date())
    password = 'any_password'
    passwordHashed = 'any_hased_password'
    token = 'any_reset_password_token'
    createdAt = (new Date(2022, 0, 1, 0)).toISOString()
    userTokenRepo = mock()
    userTokenRepo.load.mockResolvedValue({
      id: 'any_user_token_id',
      userId: 'any_user_id',
      createdAt,
      token
    })
    userRepo = mock()
    userRepo.load.mockResolvedValue({
      id: 'any_user_id',
      email: 'any_email'
    })
    userAccountRepo = mock()
    hasher = mock()
    hasher.hash.mockResolvedValue(passwordHashed)
    dateHandler = mock()
    dateHandler.diffInHours.mockReturnValue(1)
  })

  afterAll(() => {
    MockDate.reset()
  })

  beforeEach(() => {
    sut = setupResetPassword(userTokenRepo, userRepo, userAccountRepo, hasher, dateHandler)
  })

  test('should call LoadUserToken with correct input', async () => {
    await sut({ token, password })

    expect(userTokenRepo.load).toHaveBeenCalledWith({ token })
    expect(userTokenRepo.load).toHaveBeenCalledTimes(1)
  })

  test('should throw ResetPasswordTokenNotFoundError if cannot find the given token', async () => {
    userTokenRepo.load.mockResolvedValueOnce(undefined)

    const promise = sut({ token, password })

    await expect(promise).rejects.toThrow(new ResetPasswordTokenNotFoundError())
  })

  test('should call LoadUser with correct input', async () => {
    await sut({ token, password })

    expect(userRepo.load).toHaveBeenCalledWith({ id: 'any_user_id' })
    expect(userRepo.load).toHaveBeenCalledTimes(1)
  })

  test('should throw UserNotFoundError if LoadUser returns undefined', async () => {
    userRepo.load.mockResolvedValueOnce(undefined)

    const promise = sut({ token, password })

    await expect(promise).rejects.toThrow(new UserNotFoundError())
  })

  test('should call Hasher with the correct input', async () => {
    await sut({ token, password })

    expect(hasher.hash).toHaveBeenCalledWith({ value: password })
    expect(hasher.hash).toHaveBeenCalledTimes(1)
  })

  test('should call ChangeUserAccountPassword with the correct input', async () => {
    await sut({ token, password })

    expect(userAccountRepo.changePassword).toHaveBeenCalledTimes(1)
    expect(userAccountRepo.changePassword).toHaveBeenCalledWith({
      id: 'any_user_id',
      password: passwordHashed
    })
  })

  test('should call DateDifferenceInHours with correct input', async () => {
    const previousDate = new Date()
    const threeHoursAfterCreatedAt = new Date(2022, 0, 3, 0)
    MockDate.set(threeHoursAfterCreatedAt)

    await sut({ token, password })

    expect(dateHandler.diffInHours).toHaveBeenCalledTimes(1)
    expect(dateHandler.diffInHours).toHaveBeenCalledWith(
      new Date(createdAt),
      threeHoursAfterCreatedAt
    )
    MockDate.set(previousDate)
  })

  test('should not be able to reset password after 2 hours', async () => {
    dateHandler.diffInHours.mockReturnValueOnce(3)

    const promise = sut({ token, password })

    await expect(promise).rejects.toThrow(new ResetPasswordTokenExpiredError())
  })
})
