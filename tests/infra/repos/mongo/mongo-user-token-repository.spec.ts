import { MongoHelper, MongoUserTokenRepository } from '@/infra/repos/mongo'

import { Collection } from 'mongodb'

describe('MongoUserTokenRepository', () => {
  let sut: MongoUserTokenRepository
  let userTokenCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    userTokenCollection = MongoHelper.getCollection('users-tokens')
    await userTokenCollection.deleteMany({})
    sut = new MongoUserTokenRepository()
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

  describe('load', () => {
    test('should return an user token by a token', async () => {
      const userTokenData = { token: 'any_token' }
      const { insertedId } = await userTokenCollection.insertOne({ ...userTokenData })
      const id = insertedId.toHexString()

      const userToken = await sut.load({ token: 'any_token' })

      expect(userToken).toEqual({ id, ...userTokenData })
    })

    test('should return undefined if token does not exists', async () => {
      const userToken = await sut.load({ token: 'non_existing_token' })

      expect(userToken).toBeUndefined()
    })
  })
})
