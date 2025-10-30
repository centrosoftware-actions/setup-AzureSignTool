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
import * as os from 'os'

import * as release from '../src/release.js'

const osArch: string = os.arch()

const mockResultData = {
  data: {
    tag_name: 'test_tag',
    assets: [
      { name: `${osArch}_test`, browser_download_url: 'http://test_url' }
    ]
  }
}

vi.mock('../src/release.js', () => {
  return {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getRelease: vi.fn((_client: Octokit, _args: release.GetReleaseOptions) => {
      return mockResultData
    })
  }
})

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
import { Octokit } from '@octokit/rest'

describe('setup-AzureSignTool', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.unstubAllEnvs()
  })

  it('test run function downloading "latest" tag', async () => {
    await run()
    expect(release.getRelease)
    expect(tc.find).toBeCalled()
    expect(tc.downloadTool).toBeCalled()
    expect(tc.cacheFile).toBeCalled()
    expect(exec.exec).not.toBeCalled()
  })

  it('test run function downloading a non "latest" tag', async () => {
    setInput('version', 'test_version')
    await run()
    expect(release.getRelease)
    expect(tc.find).toBeCalled()
    expect(tc.downloadTool).toBeCalled()
    expect(tc.cacheFile).toBeCalled()
    expect(exec.exec).not.toBeCalled()
  })

  it('test run function passing partial data', async () => {
    setInput('kvu', 'test_user')
    await run()
    expect(core.setFailed).toBeCalled()
  })
})
