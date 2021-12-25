import { TokenGenerator } from '@/domain/gateways'

import jwt from 'jsonwebtoken'

export class JwtTokenHandler implements TokenGenerator {
  constructor (private readonly secret: string) {}

  async generate ({ key, expirationInMs }: TokenGenerator.Input): Promise<TokenGenerator.Output> {
    const expirationInSeconds = expirationInMs / 1000
    return jwt.sign({ key }, this.secret, { expiresIn: expirationInSeconds })
  }
}
