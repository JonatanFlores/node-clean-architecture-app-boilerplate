import { MongoHelper } from '@/infra/repos/mongo'
import { SaveUserToken } from '@/domain/contracts/repos/mongo'

export class MongoUserToken implements SaveUserToken {
  async save ({ userId }: SaveUserToken.Input): Promise<SaveUserToken.Output> {
    const userToken = MongoHelper.getCollection('users-tokens')
    const token = MongoHelper.generateRandomId()
    const { insertedId: _id } = await userToken.insertOne({ userId, token })
    const userTokenRecord = await userToken.findOne(
      { _id },
      { projection: { _id: 1, userId: 1, token: 1 } }
    )
    return MongoHelper.map(userTokenRecord)
  }
}
