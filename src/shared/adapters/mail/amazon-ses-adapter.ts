import { Mail } from '@/domain/contracts/gateways'

export class AmazonSesAdapter implements Mail {
  async send ({ to, body }: Mail.Input): Promise<void> {}
}
