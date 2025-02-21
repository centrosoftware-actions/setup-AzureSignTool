import { Octokit } from '@octokit/rest'

export interface GetReleaseOptions {
  readonly owner: string
  readonly repo: string
  readonly tag: string
}

// get github release of a repository depending on the release value:
// - "latest" download the latest release
// - "$tag" download the release referenced by the tag
export async function getRelease(
  octokit: Octokit,
  { owner, repo, tag }: GetReleaseOptions
) {
  if (tag === 'latest') {
    return octokit.rest.repos.getLatestRelease({ owner, repo })
  }
  return octokit.rest.repos.getReleaseByTag({
    owner,
    repo,
    tag: tag
  })
}
