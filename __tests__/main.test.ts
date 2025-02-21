/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * To mock dependencies in ESM, you can create fixtures that export mock
 * functions and objects. For example, the core module is mocked in this test,
 * so that the actual '@actions/core' module is not imported.
 */
import { vi, describe, expect, afterEach, it } from 'vitest'
import { setInput } from './utils.js'
import * as tc from '@actions/tool-cache'
import { run } from '../src/main.js'
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

describe('setup-AzureSignTool', () => {
  afterEach(() => {
    vi.resetAllMocks()
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
    try {
      await run()
      expect.unreachable(
        'with missmatch values the run should execute correctly'
      )
    } catch (err) {
      expect(err).toBeInstanceOf(Error)
      expect(tc.find).not.toBeCalled()
      expect(tc.downloadTool).not.toBeCalled()
      expect(tc.cacheFile).not.toBeCalled()
      expect(exec.exec).not.toBeCalled()
    }
  })
})
