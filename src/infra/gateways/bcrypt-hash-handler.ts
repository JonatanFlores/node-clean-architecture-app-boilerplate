import { HashComparer } from '@/domain/gateways'

import bcrypt from 'bcrypt'

export class BcryptHashHandler implements HashComparer {
  async compare (plaintext: string, digest: string): Promise<boolean> {
    return bcrypt.compare(plaintext, digest)
  }
}
