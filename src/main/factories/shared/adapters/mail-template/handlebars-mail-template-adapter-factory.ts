import { HandlebarsMailTemplateAdapter } from '@/shared/adapters/mail-template'

export const makeHandlebarsMailTemplateAdapter = (): HandlebarsMailTemplateAdapter => {
  return new HandlebarsMailTemplateAdapter()
}
