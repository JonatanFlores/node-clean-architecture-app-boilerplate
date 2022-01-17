import { app } from '@/main/config/app'
import { env } from '@/main/config/env'
import { MongoHelper } from '@/infra/repos/mongo'

import request from 'supertest'
import { Collection, ObjectId } from 'mongodb'
import { hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'

describe('Auth Routes', () => {
  let email: string
  let password: string
  let userCollection: Collection

  beforeAll(async () => {
    email = 'any_email@mail.com'
    password = '123'
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    userCollection = MongoHelper.getCollection('users')
    await userCollection.deleteMany({})
  })

  describe('POST /api/sign-in', () => {
    it('should return 200 with AccessToken', async () => {
      const passwordHashed = await hash(password, 12)
      await userCollection.insertOne({ email, password: passwordHashed })

      const { status, body } = await request(app)
        .post('/api/sign-in')
        .send({ email, password })

      expect(status).toBe(200)
      expect(body).toHaveProperty('accessToken')
      expect(body).toHaveProperty('refreshToken')
      expect(body.email).toBe(email)
    })

    it('should return 401 with UnauthorizedError', async () => {
      const { status, body } = await request(app)
        .post('/api/sign-in')
        .send({ email, password })

      expect(status).toBe(401)
      expect(body).toEqual({ error: 'Unauthorized' })
    })
  })

  describe('POST /api/sign-up', () => {
    it('should return 200 with AccessToken', async () => {
      const { status, body } = await request(app)
        .post('/api/sign-up')
        .send({ email, password })

      const createdAccount = await userCollection.findOne({ email })
      expect(status).toBe(200)
      expect(body).toHaveProperty('accessToken')
      expect(body).toHaveProperty('refreshToken')
      expect(body.email).toBe(createdAccount?.email)
    })

    it('should return 400 with EmailAlreadyInUseError', async () => {
      const passwordHashed = await hash(password, 12)
      await userCollection.insertOne({ email, password: passwordHashed })

      const { status, body } = await request(app)
        .post('/api/sign-up')
        .send({ email, password })

      expect(status).toBe(400)
      expect(body).toEqual({ error: 'Email already in use' })
    })
  })

  describe('POST /api/refresh-token', () => {
    it('should return 200 with RefreshToken', async () => {
      const passwordHashed = await hash(password, 12)
      await userCollection.insertOne({ email, password: passwordHashed })
      const response = await request(app)
        .post('/api/sign-in')
        .send({ email, password })
      const { refreshToken } = response.body

      const { status, body } = await request(app)
        .post('/api/refresh-token')
        .send({ refreshToken })

      const createdAccount = await userCollection.findOne({ email })
      expect(status).toBe(200)
      expect(body).toHaveProperty('accessToken')
      expect(body).toHaveProperty('refreshToken')
      expect(body.email).toBe(createdAccount?.email)
    })

    it('should return 500 with ServerError', async () => {
      const { status, body } = await request(app)
        .post('/api/refresh-token')
        .send({ refreshToken: 'invalid_refresh_token' })

      expect(status).toBe(500)
      expect(body).toEqual({ error: 'Server failed. Try again soon' })
    })
  })

  describe('GET /api/me', () => {
    it('should return 200 with User', async () => {
      const passwordHashed = await hash(password, 12)
      await userCollection.insertOne({ email, password: passwordHashed })
      const response = await request(app)
        .post('/api/sign-in')
        .send({ email, password })
      const { accessToken } = response.body

      const { status, body } = await request(app)
        .get('/api/me')
        .set({ authorization: `Bearer ${accessToken as string}` })

      const user = await userCollection.findOne({ email })
      expect(status).toBe(200)
      expect(body).toHaveProperty('id')
      expect(body.email).toBe(user?.email)
    })

    it('should return 404 if User was not found', async () => {
      const accessToken = sign({ key: new ObjectId() }, env.jwtSecret)

      const { status } = await request(app)
        .get('/api/me')
        .set({ authorization: `Bearer ${accessToken}` })

      expect(status).toBe(404)
    })
  })
})
