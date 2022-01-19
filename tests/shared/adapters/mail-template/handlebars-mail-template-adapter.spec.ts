import { HandlebarsMailTemplateAdapter } from '@/shared/adapters/mail-template'

import fs from 'fs'
import * as handlebars from 'handlebars'

jest.mock('handlebars')
jest.mock('fs/promises')

describe('HandlebarsMailTemplateAdapter', () => {
  let file: string
  let variables: { [key: string]: number | string }
  let readFileSpy: jest.Mock
  let sut: HandlebarsMailTemplateAdapter
  let parseTemplateSpy: jest.Mock
  let fakeHandlebars: jest.Mocked<typeof handlebars>

  beforeAll(() => {
    file = 'any_file'
    variables = { any: 'any' }
    readFileSpy = jest.fn().mockResolvedValue('any_file_content_template')
    parseTemplateSpy = jest.fn().mockReturnValue('any_template')
    fakeHandlebars = handlebars as jest.Mocked<typeof handlebars>
    fakeHandlebars.compile.mockReturnValue(parseTemplateSpy)
    jest.spyOn(fs.promises, 'readFile').mockImplementation(readFileSpy)
  })

  beforeEach(() => {
    sut = new HandlebarsMailTemplateAdapter()
  })

  test('should call readFile with correct file', async () => {
    await sut.parse({ file, variables })

    expect(readFileSpy).toHaveBeenCalledWith(file, { encoding: 'utf-8' })
    expect(readFileSpy).toHaveBeenCalledTimes(1)
  })

  test('should call compile with correct template', async () => {
    await sut.parse({ file, variables })

    expect(fakeHandlebars.compile).toHaveBeenCalledWith('any_file_content_template')
    expect(fakeHandlebars.compile).toHaveBeenCalledTimes(1)
  })

  test('should call parseTemplate with correct variables', async () => {
    await sut.parse({ file, variables })

    expect(parseTemplateSpy).toHaveBeenCalledWith(variables)
    expect(parseTemplateSpy).toHaveBeenCalledTimes(1)
  })

  test('should return the parsed template', async () => {
    const result = await sut.parse({ file, variables })

    expect(result).toEqual('any_template')
  })
})
