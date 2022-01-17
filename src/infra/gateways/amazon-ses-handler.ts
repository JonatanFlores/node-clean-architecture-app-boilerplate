import { Mail } from '@/domain/contracts/gateways'

export class AmazonSesHandler implements Mail {
  async send ({ to, body }: Mail.Input): Promise<void> {}
}
