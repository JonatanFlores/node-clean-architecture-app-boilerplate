export interface Mail {
  send: ({ to, body }: Mail.Input) => Promise<void>
}

export namespace Mail {
  export type Input = { to: string, body: string }
}
