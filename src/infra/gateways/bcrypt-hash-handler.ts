import bcrypt from 'bcrypt'

jest.mock('bcrypt')

export class BcryptHashHandler {
  async compare (plaintext: string, digest: string): Promise<boolean> {
    return bcrypt.compare(plaintext, digest)
  }
}
