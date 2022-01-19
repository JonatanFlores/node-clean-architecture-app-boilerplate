import { HandlebarsMailTemplateAdapter } from '@/shared/adapters/mail-template'

import * as handlebars from 'handlebars'

jest.mock('handlebars')

describe('HandlebarsMailTemplateAdapter', () => {
  let file: string
  let variables: { [key: string]: number | string }
  let sut: HandlebarsMailTemplateAdapter
  let fakeHandlebars: jest.Mocked<typeof handlebars>

  beforeAll(() => {
    file = 'any_file'
    variables = { any: 'any' }
    fakeHandlebars = handlebars as jest.Mocked<typeof handlebars>
  })

  beforeEach(() => {
    sut = new HandlebarsMailTemplateAdapter()
  })

  test('should call compile with correct template', async () => {
    await sut.parse({ file, variables })

    expect(fakeHandlebars.compile).toHaveBeenCalledWith(file)
    expect(fakeHandlebars.compile).toHaveBeenCalledTimes(1)
  })
})
