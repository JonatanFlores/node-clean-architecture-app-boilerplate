import { MeController } from '@/application/controllers'
import { RequiredStringValidator } from '@/application/validation'
import { NotFoundError, ServerError } from '@/application/errors'

describe('MeController', () => {
  let userId: string
  let email: string
  let loadLoggedInUser: jest.Mock
  let sut: MeController

  beforeAll(() => {
    userId = 'any_user_id'
    email = 'any_user_email'
    loadLoggedInUser = jest.fn()
    loadLoggedInUser.mockResolvedValue({ id: userId, email })
  })

  beforeEach(() => {
    sut = new MeController(loadLoggedInUser)
  })

  test('should build Validators correctly', async () => {
    const validators = await sut.buildValidators({ userId })

    expect(validators).toEqual([
      new RequiredStringValidator(userId, 'userId')
    ])
  })

  test('should call LoadLoggedInUser with correct input', async () => {
    await sut.handle({ userId })

    expect(loadLoggedInUser).toHaveBeenCalledWith({ id: userId })
    expect(loadLoggedInUser).toHaveBeenCalledTimes(1)
  })

  test('should return 200 if LoadLoggedInUser succeeds', async () => {
    const httpResponse = await sut.handle({ userId })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: { id: userId, email }
    })
  })

  test('should return 404 if LoadLoggedInUser returns undefined', async () => {
    loadLoggedInUser.mockResolvedValueOnce(undefined)

    const httpResponse = await sut.handle({ userId: 'non_existing_user_id' })

    expect(httpResponse).toEqual({
      statusCode: 404,
      data: new NotFoundError()
    })
  })

  test('should return 500 on infra error', async () => {
    const error = new Error('infra_error')
    loadLoggedInUser.mockRejectedValueOnce(error)

    const httpResponse = await sut.handle({ userId })

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(error)
    })
  })
})
