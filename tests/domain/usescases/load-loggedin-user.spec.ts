import { LoadUser } from '@/domain/contracts/repos/mongo'
import { mock, MockProxy } from 'jest-mock-extended'

type Setup = (userRepo: LoadUser) => LoadLoggedInUser
type Input = { id: string }
type Output = undefined | { id: string, email: string }
export type LoadLoggedInUser = (input: Input) => Promise<Output>

const setupLoadLoggedInUser: Setup = (userRepo) => async ({ id }) => {
  const user = await userRepo.load({ id })
  return user
}

describe('LoadLoggedInUser', () => {
  let id: string
  let email: string
  let userRepo: MockProxy<LoadUser>
  let sut: LoadLoggedInUser

  beforeAll(() => {
    id = 'any_user_id'
    email = 'any_user_email'
    userRepo = mock()
    userRepo.load.mockResolvedValue({ id, email })
  })

  beforeEach(() => {
    sut = setupLoadLoggedInUser(userRepo)
  })

  test('should call LoadUser with correct input', async () => {
    await sut({ id })

    expect(userRepo.load).toHaveBeenCalledWith({ id })
    expect(userRepo.load).toHaveBeenCalledTimes(1)
  })

  test('should return an user', async () => {
    const user = await sut({ id })

    expect(user).toEqual({ id, email })
  })
})
