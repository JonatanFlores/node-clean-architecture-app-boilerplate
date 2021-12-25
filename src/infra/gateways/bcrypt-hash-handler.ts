import { HashComparer } from '@/domain/gateways'

import bcrypt from 'bcrypt'

export class BcryptHashHandler implements HashComparer {
  async compare ({ plaintext, digest }: HashComparer.Input): Promise<HashComparer.Output> {
    return bcrypt.compare(plaintext, digest)
  }
}
