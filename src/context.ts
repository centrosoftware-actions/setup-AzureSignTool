import * as core from '@actions/core'

export interface Params {
  kvu: string
  kvi: string
  kvs: string
  kvt: string
  kvc: string
  skip_signed: boolean
  files?: string[]
  file_list?: string
  timestamp_url?: string
}

export interface Inputs {
  version: string
  params?: Params
}

function requireParamsString(
  kvu: string,
  kvi: string,
  kvs: string,
  kvt: string,
  kvc: string
): string {
  const errors = []
  if (!kvu) errors.push('- kvu')
  if (!kvi) errors.push('- kvi')
  if (!kvs) errors.push('- kvs')
  if (!kvt) errors.push('- kvt')
  if (!kvc) errors.push('- kvc')
  return errors.join('\n')
}

function getParams(): Params | undefined {
  const kvu = core.getInput('kvu')
  const kvi = core.getInput('kvi')
  const kvs = core.getInput('kvs')
  const kvt = core.getInput('kvt')
  const kvc = core.getInput('kvc')
  const should_sign = !(kvu || kvi || kvs || kvt || kvc)
  if (should_sign) {
    core.info('setup-AzureSignTool: only installing, no signing required')
    return undefined
  }
  const missing_param = !(kvu && kvi && kvs && kvt && kvc)
  if (missing_param) {
    const missingParams = requireParamsString(kvu, kvi, kvs, kvt, kvc)
    throw new Error(
      `setup-AzureSignTool: required parameters for signing are missing:\n${missingParams}`
    )
  }
  const timestamp_url = core.getInput('timestamp_url') || undefined
  const files = getInputList(core.getInput('files'))
  const file_list = core.getInput('file_list') || undefined
  if (files === undefined && file_list === undefined) {
    throw new Error(
      'setup-AzureSignTool: both "file_list" and "files" are not populated!'
    )
  }
  const skip_signed = core.getBooleanInput('skip_signed', { required: true })
  const result: Params = {
    kvu,
    kvi,
    kvs,
    kvt,
    kvc,
    skip_signed,
    files,
    timestamp_url,
    file_list
  }
  return result
}

export async function getInputs(): Promise<Inputs> {
  return {
    version: core.getInput('version') || 'latest',
    params: getParams()
  }
}

export function getInputList(items: string): string[] | undefined {
  if (items == '') {
    return undefined
  }
  return items
    .split(/\r?\n|,|;/)
    .filter((x) => x)
    .reduce<string[]>(
      (acc, line) => acc.concat(line.replace('\\', '/').trim()),
      []
    )
}
