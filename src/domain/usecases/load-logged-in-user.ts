import { LoadUser } from '@/domain/contracts/repos/mongo'

type Setup = (userRepo: LoadUser) => LoadLoggedInUser
type Input = { id: string }
type Output = undefined | { id: string, email: string }
export type LoadLoggedInUser = (input: Input) => Promise<Output>

export const setupLoadLoggedInUser: Setup = (userRepo) => async ({ id }) => {
  const user = await userRepo.load({ id })
  return user
}
