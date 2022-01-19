export interface MailTemplate {
  parse: (input: MailTemplate.Input) => Promise<MailTemplate.Output>
}

export namespace MailTemplate {
  export type Input = { file: string, variables?: { [key: string]: string | number } }
  export type Output = string
}
