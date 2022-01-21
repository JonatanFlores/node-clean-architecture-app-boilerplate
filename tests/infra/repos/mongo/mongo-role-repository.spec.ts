import { LoadRoleByName } from '@/domain/contracts/repos/mongo'
import { MongoHelper } from '@/infra/repos/mongo'

import { Collection } from 'mongodb'

class MongoRoleRepository implements LoadRoleByName {
  async loadByName (name: LoadRoleByName.Input): Promise<LoadRoleByName.Output> {
    const role = MongoHelper.getCollection('roles')
    const roleRecord = await role.findOne(
      { name },
      { projection: { _id: 1, name: 1, description: 1 } }
    )
    return MongoHelper.map(roleRecord)
  }
}

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
})
