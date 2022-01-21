import { LoadRoleByName, SaveRole } from '@/domain/contracts/repos/mongo'
import { MongoHelper } from '@/infra/repos/mongo'

export class MongoRoleRepository implements LoadRoleByName, SaveRole {
  async loadByName (name: LoadRoleByName.Input): Promise<LoadRoleByName.Output> {
    const role = MongoHelper.getCollection('roles')
    const roleRecord = await role.findOne(
      { name },
      { projection: { _id: 1, name: 1, description: 1 } }
    )
    return MongoHelper.map(roleRecord)
  }

  async save ({ name, description }: SaveRole.Input): Promise<SaveRole.Output> {
    const role = MongoHelper.getCollection('roles')
    const { insertedId: _id } = await role.insertOne({ name, description })
    const roleRecord = await role.findOne(
      { _id },
      { projection: { _id: 1, name: 1, description: 1 } }
    )
    return MongoHelper.map(roleRecord)
  }
}
