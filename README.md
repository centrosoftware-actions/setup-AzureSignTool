# setup-AzureSignTool

This action will install and configure
[AzureSignTool](https://github.com/vcsjones/AzureSignTool) of version `v6.0.0`
onwards (only `AOT` executables)

## ⚠️ Known issues

The dotnet version used to compile `AzureSignTool` has a bug reguarding absolute
path with globs. The actions tries to alliviate this issue trying to translate
absolute paths to relative paths, but this work only if the `cwd` of the process
and the glob paths are on the same Windows drive.

To sidestep this problem altogether, make sure that the output of your
compilation step is a folder on the current directory (eg. `./build`)

## Install only

```yml
uses: centrosoftware-actions/setup-AzureSignTool@v0
  with:
    version: v6.0.1
```

## Install and sign

```yml
uses: centrosoftware-actions/setup-AzureSignTool@v0
  with:
    version: v6.0.1
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
