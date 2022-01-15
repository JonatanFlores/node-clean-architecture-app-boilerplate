export interface SaveUserToken {
  save: (input: SaveUserToken.Input) => Promise<SaveUserToken.Output>
}

export namespace SaveUserToken {
  export type Input = { userId: string }
  export type Output = { id: string, userId: string, createdAt: string, token: string }
}

export interface LoadUserToken {
  load: (input: LoadUserToken.Input) => Promise<LoadUserToken.Output>
}

export namespace LoadUserToken {
  export type Input = { token: string }
  export type Output = undefined | { id: string, userId: string, createdAt: string, token: string }
}
