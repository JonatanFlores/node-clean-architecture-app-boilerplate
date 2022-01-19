import { MailTemplate } from '@/domain/contracts/gateways'

import handlebars from 'handlebars'

export class HandlebarsMailTemplateAdapter implements MailTemplate {
  async parse ({ file, variables }: MailTemplate.Input): Promise<MailTemplate.Output> {
    const parseTemplate = handlebars.compile(file)
    const output = parseTemplate(variables)
    return output
  }
}
