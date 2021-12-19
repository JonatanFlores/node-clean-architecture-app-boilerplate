export interface TokenGenerator {
  generate: (input: TokenGenerator.Input) => Promise<TokenGenerator.Output>
}

namespace TokenGenerator {
  export type Input = { key: string, expirationInMs: number }
  export type Output = string
}
