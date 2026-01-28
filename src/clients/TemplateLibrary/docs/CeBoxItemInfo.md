# CeBoxItemInfo

The general information about box item.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | The name of the file. | [optional] [default to undefined]
**parentFolderId** | **string** | The id of the parent item to access in the box service. | [optional] [default to undefined]
**modifiedAt** | **string** | The timestamp of the last item modification. | [optional] [default to undefined]
**createdAt** | **string** | The timestamp of item creation. | [optional] [default to undefined]
**size** | **number** | The required disk space to store the file | [optional] [default to undefined]

## Example

```typescript
import { CeBoxItemInfo } from './api';

const instance: CeBoxItemInfo = {
    name,
    parentFolderId,
    modifiedAt,
    createdAt,
    size,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
