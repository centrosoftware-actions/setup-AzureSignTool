import { describe, expect, it, vi, beforeEach } from 'vitest'
import { getRelease } from '../src/release.js'
import { Octokit } from '@octokit/rest'

const getLatestReleaseMock = vi.fn<Octokit['rest']['repos']['getLatestRelease']>()
const getReleaseByTagMock = vi.fn<Octokit['rest']['repos']['getReleaseByTag']>()

describe('getRelease', () => {
  const octokitMock = new Octokit()

  beforeEach(() => {
    vi.clearAllMocks()
    octokitMock.rest.repos.getLatestRelease = getLatestReleaseMock
    octokitMock.rest.repos.getReleaseByTag = getReleaseByTagMock
  })

  it('should call getLatestRelease when useLatest is true', () => {
    getRelease(octokitMock, {
      owner: 'owner',
      repo: 'repo',
      tag: 'latest'
    })
    expect(getLatestReleaseMock).toHaveBeenCalled()
    expect(getReleaseByTagMock).not.toHaveBeenCalled()
  })

  it('should call getReleaseByTag when useLatest is false', () => {
    getRelease(octokitMock, {
      owner: 'owner',
      repo: 'repo',
      tag: 'v1.2.3'
    })

    expect(getLatestReleaseMock).not.toHaveBeenCalled()
    expect(getReleaseByTagMock).toHaveBeenCalled()
  })
})
