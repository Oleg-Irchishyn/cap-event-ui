# FileMetadata


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | File id. | [optional] [default to undefined]
**name** | **string** | File name | [optional] [default to undefined]
**modifiedBy** | **string** | The name of a person who modified this file recently. | [optional] [default to undefined]
**modifiedAt** | **string** | The date and time when the file was last updated on Box. | [optional] [default to undefined]
**parentFolderId** | **string** | The ID of the folder where this file is located. | [optional] [default to undefined]
**size** | **number** | The size of the file. | [optional] [default to undefined]

## Example

```typescript
import { FileMetadata } from './api';

const instance: FileMetadata = {
    id,
    name,
    modifiedBy,
    modifiedAt,
    parentFolderId,
    size,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
