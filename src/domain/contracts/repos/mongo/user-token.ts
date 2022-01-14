export interface SaveUserToken {
  save: (input: SaveUserToken.Input) => Promise<SaveUserToken.Output>
}

export namespace SaveUserToken {
  export type Input = { userId: string }
  export type Output = { id: string, userId: string, createdAt: string, token: string }
}
