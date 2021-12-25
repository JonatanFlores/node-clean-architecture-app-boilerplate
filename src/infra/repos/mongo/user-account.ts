import { MongoHelper } from '@/infra/repos/mongo'
import { LoadUserAccount } from '@/domain/contracts/repos/mongo'

export class MongoUserAccount implements LoadUserAccount {
  async load ({ email }: LoadUserAccount.Input): Promise<LoadUserAccount.Output> {
    const userCollection = MongoHelper.getCollection('users')
    const account = await userCollection.findOne(
      { email },
      { projection: { _id: 1, email: 1, password: 1 } }
    )
    if (account !== null) return MongoHelper.map(account)
  }
}
