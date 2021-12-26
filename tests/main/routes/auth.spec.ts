import { app } from '@/main/config/app'
import { MongoHelper } from '@/infra/repos/mongo'

import request from 'supertest'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'

describe('Auth Routes', () => {
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
  })

  describe('POST /api/login', () => {
    let email: string
    let password: string

    beforeAll(() => {
      email = 'any_email@mail.com'
      password = '123'
    })

    it('should return 200 with AccessToken', async () => {
      const passwordHashed = await hash(password, 12)
      await userCollection.insertOne({ email, password: passwordHashed })

      const { status, body } = await request(app)
        .post('/api/login')
        .send({ email, password })

      expect(status).toBe(200)
      expect(body).toHaveProperty('accessToken')
    })

    it('should return 401 with UnauthorizedError', async () => {
      const { status, body } = await request(app)
        .post('/api/login')
        .send({ email, password })

      expect(status).toBe(401)
      expect(body).toEqual({ error: 'Unauthorized' })
    })
  })
})
