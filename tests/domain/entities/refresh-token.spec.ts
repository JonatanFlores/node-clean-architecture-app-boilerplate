import { RefreshToken } from '@/domain/entities'

describe('RefreshToken', () => {
  it('should expire in 2592000000 ms', () => {
    expect(RefreshToken.expirationInMs).toBe(2592000000)
  })
})
