
import { EtherealMailAdapter } from '@/shared/adapters/mail'
import { MailTemplate } from '@/domain/contracts/gateways'

import nodemailer, { Transporter } from 'nodemailer'
import { mock, MockProxy } from 'jest-mock-extended'

jest.mock('nodemailer')

describe('EtherealMailAdapter', () => {
  let from: { name: string, email: string }
  let to: { name: string, email: string }
  let subject: string
  let templateData: { file: string, variables: { [key: string]: string | number } }
  let fakeNodmailer: jest.Mocked<typeof nodemailer>
  let transporterSpy: MockProxy<Transporter>
  let mailTemplateAdapter: MockProxy<MailTemplate>
  let sut: EtherealMailAdapter

  beforeAll(() => {
    from = { name: 'any from name', email: 'any_from_email@mail.com' }
    to = { name: 'any to name', email: 'any_to_email@mail.com' }
    subject = 'any subject'
    templateData = { file: 'any_file', variables: {} }
    fakeNodmailer = nodemailer as jest.Mocked<typeof nodemailer>
    fakeNodmailer.createTestAccount.mockResolvedValue({
      user: 'any_user',
      pass: 'any_pass',
      web: 'any',
      smtp: { host: 'any_host', port: 999, secure: false },
      imap: { host: 'any_host', port: 999, secure: false },
      pop3: { host: 'any_host', port: 999, secure: false }
    })
    transporterSpy = mock()
    fakeNodmailer.createTransport.mockReturnValue(transporterSpy)
    mailTemplateAdapter = mock()
    mailTemplateAdapter.parse.mockResolvedValue('any mail body')
    jest.spyOn(console, 'log').mockImplementation(() => {})
  })

  beforeEach(() => {
    sut = new EtherealMailAdapter(mailTemplateAdapter)
  })

  describe('send', () => {
    test('should call sendMail with correct input', async () => {
      await sut.send({ from, to, subject, templateData })

      expect(transporterSpy.sendMail).toHaveBeenCalledTimes(1)
      expect(transporterSpy.sendMail).toHaveBeenCalledWith({
        from: { name: from.name, address: from.email },
        to: { name: to.name, address: to.email },
        subject,
        html: 'any mail body'
      })
    })
  })
})
