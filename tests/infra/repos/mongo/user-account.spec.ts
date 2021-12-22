import { MongoHelper } from '@/infra/repos/mongo'
import { LoadUserAccount } from '@/domain/repos/mongo'

import { Collection } from 'mongodb'

class MongoUserAccount implements LoadUserAccount {
  async load ({ email }: LoadUserAccount.Input): Promise<LoadUserAccount.Output> {
    const userCollection = MongoHelper.getCollection('users')
    const account = await userCollection.findOne(
      { email },
      { projection: { _id: 1, email: 1, password: 1 } }
    )
    if (account !== null) return MongoHelper.map(account)
  }
}

describe('UserAccount', () => {
  let sut: MongoUserAccount
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
    sut = new MongoUserAccount()
  })

  describe('load', () => {
    test('should return an account if email exits', async () => {
      const accountData = { email: 'any_email', password: 'any_password' }
      await userCollection.insertOne({ ...accountData })

      const account = await sut.load({ email: accountData.email })
      expect(account).toMatchObject(accountData)
    })

    test('should return undefined if email does not exists', async () => {
      const account = await sut.load({ email: 'any_email' })

      expect(account).toBeUndefined()
    })
  })
})
