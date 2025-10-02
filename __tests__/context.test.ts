import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as context from '../src/context'
import * as core from '@actions/core'
import { setInput } from './utils'

const setKvInput = (kv_field: string): string => {
  const input = `test_${kv_field}`
  setInput(kv_field, input)
  return input
}

describe('getInputList', () => {
  beforeEach(() => {
    vi.unstubAllEnvs()
  })

  it('handles single line correctly', () => {
    setInput('foo', 'bar')
    const res = context.getInputList('.', core.getInput('foo'))
    expect(res).toEqual(['bar'])
  })

  it('handles multiple lines correctly', () => {
    setInput('foo', 'bar\nbaz')
    const res = context.getInputList('.', core.getInput('foo'))
    expect(res).toEqual(['bar', 'baz'])
  })

  it('remove empty lines correctly', () => {
    setInput('foo', 'bar\n\nbaz')
    const res = context.getInputList('.', core.getInput('foo'))
    expect(res).toEqual(['bar', 'baz'])
  })

  it('handles comma correctly', () => {
    setInput('foo', 'bar,baz')
    const res = context.getInputList('.', core.getInput('foo'))
    expect(res).toEqual(['bar', 'baz'])
  })

  it('remove empty result correctly', () => {
    setInput('foo', 'bar,baz,')
    const res = context.getInputList('.', core.getInput('foo'))
    expect(res).toEqual(['bar', 'baz'])
  })

  it('handles different new lines correctly', () => {
    setInput('foo', 'bar\r\nbaz')
    const res = context.getInputList('.', core.getInput('foo'))
    expect(res).toEqual(['bar', 'baz'])
  })

  it('handles different new lines and comma correctly', () => {
    setInput('foo', 'bar\r\nbaz,bat')
    const res = context.getInputList('.', core.getInput('foo'))
    expect(res).toEqual(['bar', 'baz', 'bat'])
  })

  it('handles malformed slashes correctly', () => {
    setInput(
      'foo',
      'file1,path/file2;my\\path/file3\npath with space/file4\r\npath\\with space/file5'
    )
    const res = context.getInputList('.', core.getInput('foo'))
    expect(res).toEqual([
      'file1',
      'path/file2',
      'my/path/file3',
      'path with space/file4',
      'path/with space/file5'
    ])
  })

  it('handles absolute paths', () => {
    setInput(
      'foo',
      'file1,C:/path/file2;C:\\my\\path/file3\nC:/path with space/file4\r\nC:\\path\\with space/file5'
    )
    const res = context.getInputList('C:\\', core.getInput('foo'))
    expect(res).toEqual([
      'file1',
      'path/file2',
      'my/path/file3',
      'path with space/file4',
      'path/with space/file5'
    ])
  })

  it('handles correctly not params', async () => {
    const inputs = await context.getInputs()
    expect(inputs.version).eq('latest')
    expect(inputs.params).eq(undefined)
  })

  it('handles correctly required only params', async () => {
    setInput('version', 'test')
    const inputs = await context.getInputs()
    expect(inputs.version).eq('test')
    expect(inputs.params).eq(undefined)
  })

  it('handle correctly optional params', async () => {
    const kvu = setKvInput('kvu')
    const kvi = setKvInput('kvi')
    const kvs = setKvInput('kvs')
    const kvt = setKvInput('kvt')
    const kvc = setKvInput('kvc')
    setInput('files', 'file1,file2;file3\nfile4\r\nfile5')
    setInput('skip_signed', 'false')
    const expectedParams: context.Params = {
      kvu: kvu,
      kvi: kvi,
      kvs: kvs,
      kvt: kvt,
      kvc: kvc,
      skip_signed: false,
      files: ['file1', 'file2', 'file3', 'file4', 'file5']
    }
    const inputs = await context.getInputs()
    expect(inputs.version).eq('latest')
    expect(inputs.params).toEqual(expectedParams)
  })

  it('errors if optional params are partially passed', async () => {
    setKvInput('kvu')
    setInput('files', 'file1,file2;file3\nfile4\r\nfile5')
    setInput('skip_signed', 'false')
    await expect(context.getInputs()).rejects.toThrowError()
    setKvInput('kvi')
    await expect(context.getInputs()).rejects.toThrowError()
    setKvInput('kvs')
    await expect(context.getInputs()).rejects.toThrowError()
    setKvInput('kvt')
    await expect(context.getInputs()).rejects.toThrowError()
    setKvInput('kvc')
    const inputs = await context.getInputs()
    expect(inputs.version).eq('latest')
    expect(inputs.params).not.eq(undefined)
  })

  it('errors if both files and file_list are not passed', async () => {
    setKvInput('kvu')
    setKvInput('kvi')
    setKvInput('kvs')
    setKvInput('kvt')
    setKvInput('kvc')
    setInput('skip_signed', 'false')
    await expect(context.getInputs()).rejects.toThrowError()
  })
})
