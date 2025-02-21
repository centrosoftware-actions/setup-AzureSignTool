import { describe, expect, it, vi, beforeEach } from 'vitest'
import { getRelease } from '../src/release'
import { Octokit } from '@octokit/rest'

const getLatestReleaseMock =
  vi.fn<Octokit['rest']['repos']['getLatestRelease']>()
const getReleaseByTagMock = vi.fn()

describe('getRelease', () => {
  const octokitMock = new Octokit()

  beforeEach(() => {
    vi.clearAllMocks()
    // @ts-expect-error TS2739
    octokitMock.rest.repos.getLatestRelease = getLatestReleaseMock
    // @ts-expect-error TS2739
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
