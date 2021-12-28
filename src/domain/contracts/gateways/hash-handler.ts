export interface HashComparer {
  compare: (input: HashComparer.Input) => Promise<HashComparer.Output>
}

export namespace HashComparer {
  export type Input = { plaintext: string, digest: string }
  export type Output = boolean
}

export interface Hasher {
  hash: (input: Hasher.Input) => Promise<Hasher.Output>
}

export namespace Hasher {
  export type Input = { value: string }
  export type Output = string
}
