import { HashComparer, Hasher } from '@/domain/contracts/gateways'

import bcrypt from 'bcrypt'

export class BcryptAdapter implements HashComparer, Hasher {
  constructor (private readonly salt: number) {}

  async compare ({ plaintext, digest }: HashComparer.Input): Promise<HashComparer.Output> {
    return bcrypt.compare(plaintext, digest)
  }

  async hash ({ value }: Hasher.Input): Promise<Hasher.Output> {
    return bcrypt.hash(value, this.salt)
  }
}
