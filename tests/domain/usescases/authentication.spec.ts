import { LoadUserAccount } from '@/domain/repos/mongo'
import { HashComparer, TokenGenerator } from '@/domain/gateways'
import { AccessToken } from '@/domain/entities'
import { AuthenticationError } from '@/domain/errors'

import { mock, MockProxy } from 'jest-mock-extended'

type Setup = (userAccountRepo: LoadUserAccount, hashComparer: HashComparer, token: TokenGenerator) => Authentication
type Input = { email: string, password: string }
type Output = { accessToken: string }
type Authentication = (input: Input) => Promise<Output>

const setupAuthentication: Setup = (userAccountRepo, hashComparer, token) => async ({ email, password }) => {
  const userAccount = await userAccountRepo.load({ email })
  if (userAccount === undefined) throw new AuthenticationError()
  const isValid = await hashComparer.compare(password, userAccount.password)
  if (!isValid) throw new AuthenticationError()
  const accessToken = await token.generate({ key: userAccount.id, expirationInMs: AccessToken.expirationInMs })
  return { accessToken }
}

describe('Authentication', () => {
  let email: string
  let password: string
  let userAccountRepo: MockProxy<LoadUserAccount>
  let hashComparer: MockProxy<HashComparer>
  let token: MockProxy<TokenGenerator>
  let sut: Authentication

  beforeAll(() => {
    email = 'any_email'
    password = 'any_password'
    userAccountRepo = mock()
    userAccountRepo.load.mockResolvedValue({
      id: 'any_id',
      email: 'any_email',
      password: 'any_hashed_password'
    })
    hashComparer = mock()
    hashComparer.compare.mockResolvedValue(true)
    token = mock()
    token.generate.mockResolvedValue('any_generated_access_token')
  })

  beforeEach(() => {
    sut = setupAuthentication(userAccountRepo, hashComparer, token)
  })

  test('should call LoadUserAccount with correct input', async () => {
    await sut({ email, password })

    expect(userAccountRepo.load).toHaveBeenCalledWith({ email })
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
  })

  test('should throw an AuthenticationError if LoadUserAccount returns undefined', async () => {
    userAccountRepo.load.mockResolvedValueOnce(undefined)

    const promise = sut({ email, password })

    await expect(promise).rejects.toThrow(new Error('Invalid email or password'))
  })

  test('should call HashComparer with correct input', async () => {
    await sut({ email, password })

    expect(hashComparer.compare).toHaveBeenCalledWith(password, 'any_hashed_password')
    expect(hashComparer.compare).toHaveBeenCalledTimes(1)
  })

  test('should throw an AuthenticationError if HashComparer returns false', async () => {
    hashComparer.compare.mockResolvedValueOnce(false)

    const promise = sut({ email, password })

    await expect(promise).rejects.toThrow(new Error('Invalid email or password'))
  })

  test('should call TokenGenerator with correct input', async () => {
    const twoHoursInMs = 2 * 60 * 60 * 1000

    await sut({ email, password })

    expect(token.generate).toHaveBeenCalledWith({ key: 'any_id', expirationInMs: twoHoursInMs })
    expect(token.generate).toHaveBeenCalledTimes(1)
  })

  test('should return an access token on success', async () => {
    const result = await sut({ email, password })

    expect(result).toEqual({ accessToken: 'any_generated_access_token' })
  })
})
