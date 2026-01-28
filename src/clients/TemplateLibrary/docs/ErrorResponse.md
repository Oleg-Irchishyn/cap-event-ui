# ErrorResponse

Error response with message

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**reason** | **string** |  | [optional] [default to undefined]
**message** | **string** |  | [optional] [default to undefined]
**details** | [**Array&lt;ErrorDetail&gt;**](ErrorDetail.md) |  | [optional] [default to undefined]
**timestamp** | **string** |  | [optional] [default to undefined]
**requestId** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { ErrorResponse } from './api';

const instance: ErrorResponse = {
    reason,
    message,
    details,
    timestamp,
    requestId,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
