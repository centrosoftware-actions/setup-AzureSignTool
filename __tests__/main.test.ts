/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * To mock dependencies in ESM, you can create fixtures that export mock
 * functions and objects. For example, the core module is mocked in this test,
 * so that the actual '@actions/core' module is not imported.
 */
import { vi, describe, expect, it, beforeEach } from 'vitest'
import { setInput } from './utils.js'
import * as tc from '@actions/tool-cache'
import * as exec from '@actions/exec'

vi.mock('@actions/exec', () => {
  return {
    exec: vi.fn()
  }
})

vi.mock('@actions/tool-cache', () => {
  return {
    find: vi.fn(() => ''),
    downloadTool: vi.fn(() => 'test/downloaded/file'),
    cacheFile: vi.fn(() => 'test/tool/dir')
  }
})

vi.mock(import('@actions/core'), async (importOriginal) => {
  const originalCore = await importOriginal()
  return {
    ...originalCore,
    setFailed: vi.fn()
  }
})

import { run } from '../src/main.js'

import * as core from '@actions/core'

describe('setup-AzureSignTool', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.unstubAllEnvs()
  })

  it('Sets the time output', async () => {
    await run()
    expect(tc.find).toBeCalled()
    expect(tc.downloadTool).toBeCalled()
    expect(tc.cacheFile).toBeCalled()
    expect(exec.exec).not.toBeCalled()
  })
  it('Sets the time output', async () => {
    setInput('kvu', 'test_user')
    await run()
    expect(core.setFailed).toBeCalled()
  })
})
