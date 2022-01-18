import { Mail, MailTemplate } from '@/domain/contracts/gateways'

import nodemailer, { Transporter } from 'nodemailer'

export class EtherealMailAdapter implements Mail {
  private client: Transporter | undefined

  constructor (private readonly mailTemplateAdapter: MailTemplate) {
    void nodemailer.createTestAccount().then(account => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass
        }
      })
      this.client = transporter
    })
  }

  async send ({ from, to, subject, templateData }: Mail.Input): Promise<void> {
    const message = await this.client?.sendMail({
      from: { name: from.name, address: from.email },
      to: { name: to.name, address: to.email },
      subject,
      html: await this.mailTemplateAdapter.parse(templateData)
    })
    console.log('Message sent: %s', message?.messageId)
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message))
  }
}
