import { MongoHelper } from '@/infra/repos/mongo'
import { SaveUserToken } from '@/domain/contracts/repos/mongo'

export class MongoUserTokenRepository implements SaveUserToken {
  async save ({ userId }: SaveUserToken.Input): Promise<SaveUserToken.Output> {
    const userToken = MongoHelper.getCollection('users-tokens')
    const token = MongoHelper.generateRandomId()
    const createdAt = new Date()
    const { insertedId: _id } = await userToken.insertOne({ createdAt, userId, token })
    const userTokenRecord = await userToken.findOne(
      { _id },
      { projection: { _id: 1, createdAt: 1, userId: 1, token: 1 } }
    )
    return MongoHelper.map(userTokenRecord)
  }
}
