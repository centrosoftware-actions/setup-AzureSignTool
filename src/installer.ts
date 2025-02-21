import * as os from 'os'
import * as path from 'path'
import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import { getRelease } from './release.js'
import { Octokit } from '@octokit/rest'

const osArch: string = os.arch()
const owner = 'vcsjones'
const repo = 'AzureSignTool'
const exeName = 'azuresigntool.exe'

export async function getAzureSignTool(
  client: Octokit,
  tag: string
): Promise<string> {
  const { data } = await getRelease(client, {
    repo,
    owner,
    tag
  })
  const semver: string = data.tag_name.replace(/^v/, '')
  core.info(`AzureSignTool ${semver} found`)

  const asset = data.assets.find((asset) => asset.name.includes(osArch))
  if (!asset) {
    throw new Error(`asset not found for arch: ${osArch}`)
  }
  const downloadUrl = asset.browser_download_url
  core.startGroup(`Downloading ${downloadUrl}...`)

  const downloadPath: string = await tc.downloadTool(downloadUrl)
  core.info(`Downloaded to ${downloadPath}`)

  const cachePath: string = await tc.cacheFile(
    downloadPath,
    exeName,
    repo,
    semver,
    osArch
  )
  core.debug(`Cached to ${cachePath}`)

  const exePath: string = path.join(cachePath, exeName)
  core.debug(`Exe path is ${exePath}`)
  core.endGroup()

  return exePath
}
