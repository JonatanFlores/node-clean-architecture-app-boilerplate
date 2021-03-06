import { MongoHelper } from '@/infra/repos/mongo'
import {
  LoadUserAccount,
  SaveUserAccount,
  ChangeUserAccountPassword,
  ChangeUserAccountVerificationStatus
} from '@/domain/contracts/repos/mongo'

import { ObjectId } from 'mongodb'

export class MongoUserAccountRepository implements LoadUserAccount, SaveUserAccount, ChangeUserAccountPassword, ChangeUserAccountVerificationStatus {
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

  async changePassword ({ id, password }: ChangeUserAccountPassword.Input): Promise<ChangeUserAccountPassword.Output> {
    const userCollection = MongoHelper.getCollection('users')
    const updatedUserAccount = await userCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { password } },
      { returnDocument: 'after' }
    )
    return MongoHelper.map(updatedUserAccount.value)
  }

  async changeIsVerified ({ id, isVerified }: ChangeUserAccountVerificationStatus.Input): Promise<ChangeUserAccountVerificationStatus.Output> {
    const userCollection = MongoHelper.getCollection('users')
    const updatedUserAccount = await userCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { isVerified } },
      { returnDocument: 'after' }
    )
    return MongoHelper.map(updatedUserAccount.value)
  }
}
