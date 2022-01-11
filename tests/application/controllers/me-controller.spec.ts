import { MeController } from '@/application/controllers'
import { RequiredStringValidator } from '@/application/validation'

describe('MeController', () => {
  let userId: string
  let sut: MeController

  beforeAll(() => {
    userId = 'any_user_id'
  })

  beforeEach(() => {
    sut = new MeController()
  })

  test('should build Validators correctly', async () => {
    const validators = await sut.buildValidators({ userId })

    expect(validators).toEqual([
      new RequiredStringValidator(userId, 'userId')
    ])
  })
})
