export interface Mail {
  send: (input: Mail.Input) => Promise<void>
}

type MailContact = {
  name: string
  email: string
}

type TemplateVariables = {
  [key: string]: string | number
}

export namespace Mail {
  export type Input = {
    from: MailContact
    to: MailContact
    subject: string
    templateData: {
      file: string
      variables: TemplateVariables
    }
  }
}
