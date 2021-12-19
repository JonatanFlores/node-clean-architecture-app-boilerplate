import { AccessToken } from '@/domain/entities'

describe('AccessToken', () => {
  it('should expire in 7200000 ms', () => {
    expect(AccessToken.expirationInMs).toBe(7200000)
  })
})
