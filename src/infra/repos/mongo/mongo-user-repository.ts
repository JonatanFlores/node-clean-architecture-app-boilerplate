import { LoadUser } from '@/domain/contracts/repos/mongo'
import { MongoHelper } from '@/infra/repos/mongo'

import { ObjectId } from 'mongodb'

export class MongoUserRepository implements LoadUser {
  async load ({ id }: LoadUser.Input): Promise<LoadUser.Output> {
    const userCollection = MongoHelper.getCollection('users')
    const user = await userCollection.findOne(
      { _id: new ObjectId(id) },
      { projection: { _id: 1, email: 1 } }
    )
    if (user !== null) return MongoHelper.map(user)
  }
}
