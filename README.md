# setup-AzureSignTool

This action will install and configure [AzureSignTool](https://github.com/vcsjones/AzureSignTool) of version `v6.0.0` onwards (only `AOT` executables)

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
    # list of files to sign
    files: |
      file1
      ...
    # file containing one file path per row
    file_list: files_to_sign.txt
    # url to timestamp service, if not set, timestamp will not be set
    timestamp_url: http://timestamp.digicert.com
```
