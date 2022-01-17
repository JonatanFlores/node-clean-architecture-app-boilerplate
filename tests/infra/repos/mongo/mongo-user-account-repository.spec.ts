import { MongoHelper, MongoUserAccountRepository } from '@/infra/repos/mongo'

import { Collection } from 'mongodb'

describe('MongoUserAccountRepository', () => {
  let sut: MongoUserAccountRepository
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
    sut = new MongoUserAccountRepository()
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

  describe('save', () => {
    test('should return an account if save succeeds', async () => {
      const accountData = { email: 'any_email', password: 'any_password' }

      const account = await sut.save({ ...accountData })

      expect(account).toMatchObject({ email: 'any_email' })
      expect(account.id).toBeDefined()
    })
  })

  describe('changePassword', () => {
    test('should return an account with the new password if it succeeds', async () => {
      const accountData = { email: 'any_email', password: 'any_password' }
      const { insertedId: id } = await userCollection.insertOne({ ...accountData })

      const account = await sut.changePassword({ id: id.toHexString(), password: 'new_password' })

      expect(account).toEqual({
        id: id.toHexString(),
        email: 'any_email',
        password: 'new_password'
      })
    })
  })
})
