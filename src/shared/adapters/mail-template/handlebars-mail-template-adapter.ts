import { MailTemplate } from '@/domain/contracts/gateways'

import handlebars from 'handlebars'

export class HandlebarsMailTemplateAdapter implements MailTemplate {
  async parse ({ file }: MailTemplate.Input): Promise<MailTemplate.Output> {
    handlebars.compile(file)
    return ''
  }
}
