import { MeController } from '@/application/controllers'
import { RequiredStringValidator } from '@/application/validation'

describe('MeController', () => {
  let userId: string
  let loadLoggedInUser: jest.Mock
  let sut: MeController

  beforeAll(() => {
    loadLoggedInUser = jest.fn()
    userId = 'any_user_id'
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
})
