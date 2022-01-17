import { makeAmazonSesAdapter, makeEtherealMailAdapter } from '@/main/factories/shared/adapters/mail'
import { env } from '@/main/config/env'
import { Mail } from '@/domain/contracts/gateways'

export const makeMailerAdapter = (): Mail => {
  if (env?.appEnv?.toLowerCase() === 'production') {
    return makeAmazonSesAdapter()
  }
  return makeEtherealMailAdapter()
}
