import { AmazonSesAdapter } from '@/shared/adapters/mail'
import { MailTemplate } from '@/domain/contracts/gateways'

import nodemailer, { Transporter } from 'nodemailer'
import { mock, MockProxy } from 'jest-mock-extended'

jest.mock('nodemailer')
jest.mock('aws-sdk')

describe('AmazonSesAdapter', () => {
  let from: { name: string, email: string }
  let to: { name: string, email: string }
  let subject: string
  let templateData: { file: string, variables: { [key: string]: string | number } }
  let env: { [key: string]: any }
  let fakeNodmailer: jest.Mocked<typeof nodemailer>
  let transporterSpy: MockProxy<Transporter>
  let mailTemplateAdapter: MockProxy<MailTemplate>
  let sut: AmazonSesAdapter

  beforeAll(() => {
    from = { name: 'any from name', email: 'any_from_email@mail.com' }
    to = { name: 'any to name', email: 'any_to_email@mail.com' }
    subject = 'any subject'
    templateData = { file: 'any_file', variables: {} }
    env = { aws: { defaultRegion: 'any_region' } }
    transporterSpy = mock()
    fakeNodmailer = nodemailer as jest.Mocked<typeof nodemailer>
    fakeNodmailer.createTransport.mockReturnValue(transporterSpy)
    mailTemplateAdapter = mock()
    mailTemplateAdapter.parse.mockResolvedValue('any mail body')
  })

  beforeEach(() => {
    sut = new AmazonSesAdapter(mailTemplateAdapter, env)
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
