import { MailTemplate } from '@/domain/contracts/gateways'

import fs from 'fs'
import handlebars from 'handlebars'

export class HandlebarsMailTemplateAdapter implements MailTemplate {
  async parse ({ file, variables }: MailTemplate.Input): Promise<MailTemplate.Output> {
    const templateFileContent = await fs.promises.readFile(file, { encoding: 'utf-8' })
    const parseTemplate = handlebars.compile(templateFileContent)
    const output = parseTemplate(variables)
    return output
  }
}
