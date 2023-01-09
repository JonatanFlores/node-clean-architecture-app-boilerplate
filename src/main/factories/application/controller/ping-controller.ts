import { PingController } from '@/application/controllers'

export const makePingController = (): PingController => {
  return new PingController()
}
