import { makeHandlebarsMailTemplateAdapter } from '@/main/factories/shared/adapters/mail-template'
import { EtherealMailAdapter } from '@/shared/adapters/mail'

export const makeEtherealMailAdapter = (): EtherealMailAdapter => {
  return new EtherealMailAdapter(
    makeHandlebarsMailTemplateAdapter()
  )
}
