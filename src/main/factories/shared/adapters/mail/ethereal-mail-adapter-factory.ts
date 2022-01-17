import { EtherealMailAdapter } from '@/shared/adapters/mail'

export const makeEtherealMailAdapter = (): EtherealMailAdapter => {
  return new EtherealMailAdapter()
}
