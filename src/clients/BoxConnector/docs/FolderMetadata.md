# FolderMetadata


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**modifiedBy** | **string** | The name of a person who changed the folder\&#39;s content recently | [optional] [default to undefined]
**modifiedAt** | **string** | The date and time when the folder\&#39;s content was last updated on Box. | [optional] [default to undefined]
**parentFolderId** | **string** | The ID of the folder where this folder is located. Could be null if it\&#39;s root folder. | [optional] [default to undefined]
**size** | **number** | The size of the folder. | [optional] [default to undefined]

## Example

```typescript
import { FolderMetadata } from './api';

const instance: FolderMetadata = {
    modifiedBy,
    modifiedAt,
    parentFolderId,
    size,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
