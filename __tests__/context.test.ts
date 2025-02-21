import { describe, expect, it } from 'vitest'
import * as context from '../src/context'
import * as core from '@actions/core'
import { setInput } from './utils'

describe('getInputList', () => {
  it('handles single line correctly', async () => {
    setInput('foo', 'bar')
    const res = await context.getInputList(core.getInput('foo'))
    expect(res).toEqual(['bar'])
  })

  it('handles multiple lines correctly', async () => {
    setInput('foo', 'bar\nbaz')
    const res = await context.getInputList(core.getInput('foo'))
    expect(res).toEqual(['bar', 'baz'])
  })

  it('remove empty lines correctly', async () => {
    setInput('foo', 'bar\n\nbaz')
    const res = await context.getInputList(core.getInput('foo'))
    expect(res).toEqual(['bar', 'baz'])
  })

  it('handles comma correctly', async () => {
    setInput('foo', 'bar,baz')
    const res = await context.getInputList(core.getInput('foo'))
    expect(res).toEqual(['bar', 'baz'])
  })

  it('remove empty result correctly', async () => {
    setInput('foo', 'bar,baz,')
    const res = await context.getInputList(core.getInput('foo'))
    expect(res).toEqual(['bar', 'baz'])
  })

  it('handles different new lines correctly', async () => {
    setInput('foo', 'bar\r\nbaz')
    const res = await context.getInputList(core.getInput('foo'))
    expect(res).toEqual(['bar', 'baz'])
  })

  it('handles different new lines and comma correctly', async () => {
    setInput('foo', 'bar\r\nbaz,bat')
    const res = await context.getInputList(core.getInput('foo'))
    expect(res).toEqual(['bar', 'baz', 'bat'])
  })
})
