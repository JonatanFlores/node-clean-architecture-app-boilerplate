import { env } from '@/main/config/env'
import { makeHandlebarsMailTemplateAdapter } from '@/main/factories/shared/adapters/mail-template'
import { AmazonSesAdapter } from '@/shared/adapters/mail'

export const makeAmazonSesAdapter = (): AmazonSesAdapter => {
  return new AmazonSesAdapter(
    makeHandlebarsMailTemplateAdapter(),
    env
  )
}
