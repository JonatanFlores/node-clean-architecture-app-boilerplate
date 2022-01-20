import { makeAmazonSesAdapter, makeEtherealMailAdapter } from '@/main/factories/shared/adapters/mail'
import { Mail } from '@/domain/contracts/gateways'
import { env } from '@/main/config/env'

const mailAdaptersFactories: { [key: string]: () => Mail } = {
  ses: makeAmazonSesAdapter,
  ethereal: makeEtherealMailAdapter
}

export const makeMailerAdapter = (): Mail => {
  const mailAdapterFactory = mailAdaptersFactories[env.mail.driver]
  return mailAdapterFactory()
}
