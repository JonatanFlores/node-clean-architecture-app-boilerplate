import { Mail } from '@/domain/contracts/gateways'

export class AmazonSesAdapter implements Mail {
  async send (input: Mail.Input): Promise<void> {}
}
