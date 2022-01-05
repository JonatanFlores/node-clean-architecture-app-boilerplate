import { LoadUser } from '@/domain/contracts/repos/mongo'
import { mock, MockProxy } from 'jest-mock-extended'

type Setup = (userRepo: LoadUser) => LoadLoggedInUser
type Input = { id: string }
export type LoadLoggedInUser = (input: Input) => Promise<void>

const setupLoadLoggedInUser: Setup = (userRepo) => async ({ id }) => {
  await userRepo.load({ id })
}

describe('LoadLoggedInUser', () => {
  let id: string
  let userRepo: MockProxy<LoadUser>
  let sut: LoadLoggedInUser

  beforeAll(() => {
    id = 'any_user_id'
    userRepo = mock()
  })

  beforeEach(() => {
    sut = setupLoadLoggedInUser(userRepo)
  })

  test('should call LoadUser with correct input', async () => {
    await sut({ id })

    expect(userRepo.load).toHaveBeenCalledWith({ id })
    expect(userRepo.load).toHaveBeenCalledTimes(1)
  })
})
