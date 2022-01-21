export interface LoadRoleByName {
  loadByName: (input: LoadRoleByName.Input) => Promise<LoadRoleByName.Output>
}

export namespace LoadRoleByName {
  export type Input = string
  export type Output = { id: string, name: string, description: string }
}

export interface SaveRole {
  save: (input: SaveRole.Input) => Promise<SaveRole.Output>
}

export namespace SaveRole {
  export type Input = { name: string, description: string }
  export type Output = { id: string, name: string, description: string }
}
