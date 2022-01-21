import { Mail, MailTemplate } from '@/domain/contracts/gateways'

import aws from 'aws-sdk'
import nodemailer, { Transporter } from 'nodemailer'

export class AmazonSesAdapter implements Mail {
  private readonly client: Transporter

  constructor (
    private readonly mailTemplateAdapter: MailTemplate,
    private readonly env: { [key: string]: any }
  ) {
    this.client = nodemailer.createTransport({
      SES: new aws.SES({
        apiVersion: '2010-12-01',
        region: this.env.aws.defaultRegion
      })
    })
  }

  async send ({ from, to, subject, templateData }: Mail.Input): Promise<void> {
    await this.client.sendMail({
      from: { name: from.name, address: from.email },
      to: { name: to.name, address: to.email },
      subject,
      html: await this.mailTemplateAdapter.parse(templateData)
    })
  }
}
