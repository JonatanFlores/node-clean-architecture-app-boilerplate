import { SignupController } from '@/application/controllers'
import { ServerError } from '@/application/errors'
import { RequiredStringValidator } from '@/application/validation'
import { EmailAlreadyInUseError } from '@/domain/entities/errors'

describe('SignupController', () => {
  let email: string
  let password: string
  let accessToken: string
  let addUserAccount: jest.Mock
  let sut: SignupController

  beforeAll(() => {
    email = 'any_email@mail.com'
    password = 'any_password'
    accessToken = 'any_access_token'
    addUserAccount = jest.fn()
    addUserAccount.mockResolvedValue({ email, accessToken })
  })

  beforeEach(() => {
    sut = new SignupController(addUserAccount)
  })

  test('should build Validators correctly', () => {
    const validators = sut.buildValidators({ email, password })

    expect(validators).toEqual([
      new RequiredStringValidator(email, 'email'),
      new RequiredStringValidator(password, 'password')
    ])
  })

  test('should call AddUserAccount with correct input', async () => {
    await sut.handle({ email, password })

    expect(addUserAccount).toHaveBeenCalledWith({ email, password })
    expect(addUserAccount).toHaveBeenCalledTimes(1)
  })

  test('should return 400 if AddUserAccount fails', async () => {
    addUserAccount.mockRejectedValueOnce(new EmailAlreadyInUseError())

    const httpResponse = await sut.handle({ email, password })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new EmailAlreadyInUseError()
    })
  })

  test('should return 200 if AddUserAccount succeeds', async () => {
    const httpResponse = await sut.handle({ email, password })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: { accessToken, email }
    })
  })

  test('should return 500 on infra error', async () => {
    const error = new Error('infra_error')
    addUserAccount.mockRejectedValueOnce(error)

    const httpResponse = await sut.handle({ email, password })

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(error)
    })
  })
})
