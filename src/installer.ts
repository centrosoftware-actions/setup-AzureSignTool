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
  core.startGroup('installAzureSignTool')
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
  // try to find the requested version in the tool-cach
  const requestedSemver = tag.replace(/^v/, '')
  const cachedToolPath = tc.find(repo, requestedSemver, osArch)
  if (cachedToolPath) {
    core.debug(`Found ${requestedSemver} in the tool cache`)
    return path.join(cachedToolPath, exeName)
  }
  core.debug(`Can't find ${requestedSemver} in the tool cache`)

  // find the required version of the tool
  const { data } = await getRelease(client, {
    repo,
    owner,
    tag
  })
  const semver: string = data.tag_name.replace(/^v/, '')
  core.info(`${semver} found`)

  const asset = data.assets.find((asset) => asset.name.includes(osArch))
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
  core.debug(`Exe path is ${exePath}`)
  return exePath
}
