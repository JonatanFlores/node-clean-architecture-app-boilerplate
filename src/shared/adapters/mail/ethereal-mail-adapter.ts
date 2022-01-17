import { Mail } from '@/domain/contracts/gateways'

import nodemailer, { Transporter } from 'nodemailer'

export class EtherealMailAdapter implements Mail {
  private client: Transporter | undefined

  constructor () {
    nodemailer.createTestAccount().then(account => {
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
    }).catch(error => {
      console.log(error)
    })
  }

  async send ({ to, body }: Mail.Input): Promise<void> {
    const message = await this.client?.sendMail({
      from: 'Example Team <exampleteam@mail.com>',
      to,
      subject: 'Example Subject',
      text: body
    })
    console.log('Message sent: %s', message.messageId)
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message))
  }
}
