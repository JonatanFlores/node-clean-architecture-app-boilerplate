import { MongoHelper } from '@/infra/repos/mongo'
import { LoadUserAccount, SaveUserAccount } from '@/domain/contracts/repos/mongo'

export class MongoUserAccount implements LoadUserAccount, SaveUserAccount {
  async load ({ email }: LoadUserAccount.Input): Promise<LoadUserAccount.Output> {
    const userCollection = MongoHelper.getCollection('users')
    const account = await userCollection.findOne(
      { email },
      { projection: { _id: 1, email: 1, password: 1 } }
    )
    if (account !== null) return MongoHelper.map(account)
  }

  async save (input: SaveUserAccount.Input): Promise<SaveUserAccount.Output> {
    const userCollection = MongoHelper.getCollection('users')
    const { insertedId: _id } = await userCollection.insertOne(input)
    const account = await userCollection.findOne(
      { _id },
      { projection: { _id: 1, email: 1 } }
    )
    return MongoHelper.map(account)
  }
}
