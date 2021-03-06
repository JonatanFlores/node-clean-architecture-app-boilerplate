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
  export type Input = { email: string, password: string, isVerified: boolean }
  export type Output = { id: string, email: string, password: string }
}

export interface ChangeUserAccountPassword {
  changePassword: (input: ChangeUserAccountPassword.Input) => Promise<ChangeUserAccountPassword.Output>
}

export namespace ChangeUserAccountPassword {
  export type Input = { id: string, password: string }
  export type Output = { id: string, email: string }
}

export interface ChangeUserAccountVerificationStatus {
  changeIsVerified: (input: ChangeUserAccountVerificationStatus.Input) => Promise<ChangeUserAccountVerificationStatus.Output>
}

export namespace ChangeUserAccountVerificationStatus {
  export type Input = { id: string, isVerified: boolean }
  export type Output = { id: string, email: string, isVerified: boolean }
}
