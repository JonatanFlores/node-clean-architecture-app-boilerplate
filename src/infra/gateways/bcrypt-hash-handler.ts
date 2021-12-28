import { HashComparer, Hasher } from '@/domain/contracts/gateways'

import bcrypt from 'bcrypt'

export class BcryptHashHandler implements HashComparer {
  constructor (private readonly salt: number) {}

  async compare ({ plaintext, digest }: HashComparer.Input): Promise<HashComparer.Output> {
    return bcrypt.compare(plaintext, digest)
  }

  async hash ({ value }: Hasher.Input): Promise<void> {
    await bcrypt.hash(value, this.salt)
  }
}
