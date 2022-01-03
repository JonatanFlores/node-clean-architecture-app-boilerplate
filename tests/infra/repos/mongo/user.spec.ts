import { LoadUser } from '@/domain/contracts/repos/mongo'
import { MongoHelper } from '@/infra/repos/mongo'

import { Collection, ObjectId } from 'mongodb'

class MongoUser implements LoadUser {
  async load ({ id }: LoadUser.Input): Promise<LoadUser.Output> {
    const userCollection = MongoHelper.getCollection('users')
    const user = await userCollection.findOne(
      { _id: new ObjectId(id) },
      { projection: { _id: 1, email: 1 } }
    )
    if (user !== null) return MongoHelper.map(user)
  }
}

describe('User', () => {
  let sut: MongoUser
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
    sut = new MongoUser()
  })

  describe('load', () => {
    test('should return an user by an id', async () => {
      const userData = { email: 'any_email', password: 'any_password' }
      const { insertedId } = await userCollection.insertOne({ ...userData })

      const user = await sut.load({ id: insertedId.toHexString() })

      expect(user).toEqual({ id: insertedId.toHexString(), email: 'any_email' })
    })
  })
})
