import * as context from './context.js'
import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as installer from './installer.js'
import * as os from 'os'
import * as path from 'path'
import { Octokit } from '@octokit/rest'

export async function run(): Promise<void> {
  try {
    if (os.platform() != 'win32') {
      core.setFailed('Not supported on platform different from windows')
      return
    }

    const inputs: context.Inputs = await context.getInputs()
    const octokit = new Octokit()
    const azureSignTool = await installer.getAzureSignTool(
      octokit,
      inputs.version
    )

    const dir = path.dirname(azureSignTool)
    core.addPath(dir)
    core.debug(`Added ${dir} to PATH`)
    if (!inputs.params) {
      return
    }
    const params = inputs.params

    let command = `${azureSignTool} -kvu ${params.kvu} -kvi ${params.kvi} -kvt ${params.kvt} -kvs ${params.kvs} -kvc ${params.kvc}`
    if (params.timestamp_url) {
      command = command.concat(` -tr ${params.timestamp_url}`)
    }
    if (core.isDebug()) {
      command = command.concat(' -v')
    }
    if (params.file_list) {
      command = command.concat(` -ifl ${params.file_list}`)
    }
    if (params.files) {
      command = command.concat(` ${params.files.join(' ')}`)
    }
    await exec.exec(command)
  } catch (error) {
    core.setFailed(`something bad happened: ${error}`)
  }
}
