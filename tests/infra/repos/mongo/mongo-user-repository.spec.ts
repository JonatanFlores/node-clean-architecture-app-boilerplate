import { MongoHelper, MongoUserRepository } from '@/infra/repos/mongo'

import { Collection, ObjectId } from 'mongodb'

describe('MongoUserRepository', () => {
  let sut: MongoUserRepository
  let userCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    userCollection = MongoHelper.getCollection('users')
    await userCollection.deleteMany({})
    sut = new MongoUserRepository()
  })

  describe('load', () => {
    test('should return an user by an id', async () => {
      const userData = { email: 'any_email', password: 'any_password' }
      const { insertedId } = await userCollection.insertOne({ ...userData })

      const user = await sut.load({ id: insertedId.toHexString() })

      expect(user).toEqual({ id: insertedId.toHexString(), email: 'any_email' })
    })

    test('should return undefined if id does not exists', async () => {
      const user = await sut.load({ id: (new ObjectId()).toHexString() })

      expect(user).toBeUndefined()
    })
  })
})
