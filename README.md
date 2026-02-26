# setup-AzureSignTool

This action installs and configures [AzureSignTool](https://github.com/vcsjones/AzureSignTool) on the runner's path.

Only versions `v6.0.0` and later are supported (AOT executables only).

## ⚠️ Known issues

The .NET package `Microsoft.Extensions.FileSystemGlobbing` used by `AzureSignTool`
has a bug when matching absolute paths with globs
([issue](https://github.com/dotnet/runtime/issues/62333)).\
This was fixed in `AzureSignTool` starting with `v7.0.0`.

For versions older than `v7.0.0`, this action attempts to work around the bug by
translating absolute paths to relative paths.\
This only works if the process
`cwd` and the glob paths are on the same Windows drive.

To avoid the issue entirely, ensure your build output is a folder in the
current directory (for example, `./build`).

## Usage examples

### Install only

```yml
uses: centrosoftware-actions/setup-AzureSignTool@v1
with:
  version: latest
```

### Install and sign

```yml
uses: centrosoftware-actions/setup-AzureSignTool@v1
with:
  version: v7.0.0
  kvu: ${{ secrets.kvu }}
  kvi: ${{ secrets.kvi }}
  kvs: ${{ secrets.kvs }}
  kvt: ${{ secrets.kvt }}
  kvc: ${{ secrets.kvc }}
  # list of files and globs to sign
  files: |
    file1
    dir/**/*.dll
    ...
  # file containing one file path per row
  file_list: files_to_sign.txt
  # url to timestamp service; if not set, no timestamp is added
  timestamp_url: http://timestamp.digicert.com
  # skip signing already signed files (default: false)
  skip_signed: true
```
