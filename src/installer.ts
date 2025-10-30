import * as os from 'os'
import * as path from 'path'
import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import { getRelease } from './release.js'
import { Octokit } from '@octokit/rest'

const osArch: string = os.arch()
const owner = 'vcsjones'
const repo = 'AzureSignTool'
const toolName = 'AzureSignTool'
const exeName = 'azuresigntool.exe'

const addToPath = (exePath: string) => {
  const dir = path.dirname(exePath)
  core.addPath(dir)
  core.debug(`Added ${dir} to PATH`)
}

export async function installAzureSignTool(
  client: Octokit,
  tag: string
): Promise<string> {
  core.startGroup('download and install AzureSignTool')
  const exePath = await getAzureSignTool(client, tag)
  addToPath(exePath)
  core.endGroup()
  return exeName
}

export async function getAzureSignTool(
  client: Octokit,
  tag: string
): Promise<string> {
  core.startGroup(`Configuring ${toolName}...`)
  // try to find the requested version in the tool-cache
  // find the required version of the tool
  let releaseData: Awaited<ReturnType<typeof getRelease>>['data'] | undefined
  let tag_name = tag

  // download the releaseData only for "latest"
  // the tag could be a valid version and we could save a call
  // to github, hence, less ratelimit problems
  if (tag === 'latest') {
    core.info(`Retrieving releaseData for latest tag`)
    const { data: data } = await getRelease(client, {
      repo,
      owner,
      tag
    })
    releaseData = data
    tag_name = releaseData.tag_name
  }
  const semver = tag_name.replace(/^v/, '')
  core.info(`Searching for ${semver} cached tool`)
  const cachedToolPath = tc.find(repo, semver, osArch)
  if (cachedToolPath) {
    core.info(`Found ${semver} in the tool cache`)
    core.debug(`Exe path is ${cachedToolPath}`)
    return path.join(cachedToolPath, exeName)
  }
  core.info(`Cache miss, tool not installed`)

  // download the releaseData
  // we missed the cache and the original tag was not "latest"
  if (!releaseData) {
    core.info(`Retrieving releaseData for ${tag_name} tag`)
    const { data: data } = await getRelease(client, {
      repo,
      owner,
      tag
    })
    releaseData = data
  }

  const asset = releaseData.assets.find((asset) => asset.name.includes(osArch))
  if (!asset) {
    throw new Error(`asset not found for arch: ${osArch}`)
  }

  const downloadUrl = asset.browser_download_url
  const downloadPath: string = await tc.downloadTool(downloadUrl)
  core.debug(`Downloaded to ${downloadPath}`)

  const cachePath: string = await tc.cacheFile(
    downloadPath,
    exeName,
    toolName,
    semver,
    osArch
  )
  core.debug(`Cached to ${cachePath}`)

  const exePath: string = path.join(cachePath, exeName)
  core.info(`Installed ${semver}`)
  core.debug(`Exe path is ${exePath}`)
  return exePath
}
