/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * To mock dependencies in ESM, you can create fixtures that export mock
 * functions and objects. For example, the core module is mocked in this test,
 * so that the actual '@actions/core' module is not imported.
 */
import {
  vi,
  describe,
  expect,
  afterEach,
  beforeEach,
  it,
  MockInstance
} from 'vitest'
import * as tc from '@actions/tool-cache'
// import * as ctx from '../src/context.js'
import { run } from '../src/main.js'
import { exec } from '@actions/exec'

vi.mock('@actions/exec', () => {
  return {
    exec: vi.fn()
  }
})

vi.mock('@actions/exec', () => {
  return {
    exec: vi.fn()
  }
})

describe('setup-AzureSignTool', () => {
  let dlSpy: MockInstance<typeof tc.downloadTool>
  let cacheSpy: MockInstance<typeof tc.cacheFile>
  beforeEach(() => {
    dlSpy = vi.spyOn(tc, 'downloadTool')
    cacheSpy = vi.spyOn(tc, 'cacheFile')
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('Sets the time output', async () => {
    await run()
    expect(dlSpy).not.toBeCalled()
    expect(cacheSpy).not.toBeCalled()
    expect(exec).not.toBeCalled()
  })
})
