export interface LoadUser {
  load: (input: LoadUser.Input) => Promise<LoadUser.Output>
}

export namespace LoadUser {
  export type Input = { id: string }
  export type Output = undefined | {
    id: string
    email: string
  }
}
