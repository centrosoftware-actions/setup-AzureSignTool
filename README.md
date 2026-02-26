# setup-AzureSignTool

This action will install and configure
[AzureSignTool](https://github.com/vcsjones/AzureSignTool) of version `v6.0.0`
onwards (only `AOT` executables)

## ⚠️ Known issues

The dotnet package `Microsoft.Extensions.FileSystemGlobbing` used by `AzureSignTool` has a bug reguarding absolute path with globs ([issue](https://github.com/dotnet/runtime/issues/62333)).
From the version `7.0.0` onward this logic was patched from the `AzureSignTool`'s side.
The actions tries to alliviate this issue for versions older than `7.0.0` by translating
absolute paths to relative paths, this only works if the `cwd` of the process
and the glob paths are on the same `Windows` drive.

To sidestep this problem altogether, make sure that the output of your
compilation step is a folder on the current directory (eg. `./build`)

## Install only

```yml
uses: centrosoftware-actions/setup-AzureSignTool@v1
  with:
    version: v7.0.0
```

## Install and sign

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
    # url to timestamp service, if not set, timestamp will not be set
    timestamp_url: http://timestamp.digicert.com
    # skip signing already signed files (default: false)
    skip_signed: true
```
