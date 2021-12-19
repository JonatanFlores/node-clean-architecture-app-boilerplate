export interface TokenGenerator {
  generate: (input: TokenGenerator.Input) => Promise<void>
}

namespace TokenGenerator {
  export type Input = { key: string, expirationInMs: number }
}
