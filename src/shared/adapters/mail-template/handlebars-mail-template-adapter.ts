import { MailTemplate } from '@/domain/contracts/gateways'

export class HandlebarsMailTemplateAdapter implements MailTemplate {
  async parse (input: MailTemplate.Input): Promise<MailTemplate.Output> {
    return ''
  }
}
