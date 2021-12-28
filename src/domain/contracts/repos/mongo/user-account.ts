export interface LoadUserAccount {
  load: (input: LoadUserAccount.Input) => Promise<LoadUserAccount.Output>
}

export namespace LoadUserAccount {
  export type Input = { email: string }
  export type Output = undefined | {
    id: string
    email: string
    password: string
  }
}

export interface SaveUserAccount {
  save: (input: SaveUserAccount.Input) => Promise<SaveUserAccount.Output>
}

export namespace SaveUserAccount {
  export type Input = { email: string, password: string }
  export type Output = { id: string, email: string, password: string }
}
