import { MongoHelper, MongoRoleRepository } from '@/infra/repos/mongo'

import { Collection } from 'mongodb'

describe('MongoRoleRepository', () => {
  let sut: MongoRoleRepository
  let roleCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    roleCollection = MongoHelper.getCollection('roles')
    await roleCollection.deleteMany({})
    sut = new MongoRoleRepository()
  })

  describe('loadByName', () => {
    test('should return a role by name', async () => {
      const roleData = { name: 'any-role', description: 'any role' }
      const { insertedId } = await roleCollection.insertOne({ ...roleData })
      const id = insertedId.toHexString()

      const role = await sut.loadByName('any-role')

      expect(role).toEqual({ id, ...roleData })
    })

    test('should return undefined if role does not exists', async () => {
      const role = await sut.loadByName('non_existing_role')

      expect(role).toBeUndefined()
    })
  })

  describe('save', () => {
    test('should associate a user with a generated token', async () => {
      const roleData = { name: 'any-role', description: 'any role' }

      const role = await sut.save({ ...roleData })

      expect(role).toMatchObject({ ...roleData })
      expect(role.id).toBeDefined()
    })
  })
})
