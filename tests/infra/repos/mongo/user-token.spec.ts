import { MongoHelper, MongoUserToken } from '@/infra/repos/mongo'

import { Collection } from 'mongodb'

describe('UserToken', () => {
  let sut: MongoUserToken
  let userTokenCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    userTokenCollection = MongoHelper.getCollection('users')
    await userTokenCollection.deleteMany({})
    sut = new MongoUserToken()
  })

  describe('save', () => {
    test('should associate a user with a generated token', async () => {
      const userTokenData = { userId: 'any_user_id' }

      const userToken = await sut.save({ ...userTokenData })

      expect(userToken).toMatchObject({ userId: 'any_user_id' })
      expect(userToken.id).toBeDefined()
      expect(userToken.token).toBeDefined()
      expect(userToken.createdAt).toBeDefined()
    })
  })
})
