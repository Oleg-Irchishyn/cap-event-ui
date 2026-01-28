# LineItemBase


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [optional] [default to undefined]
**account** | [**Account**](Account.md) |  | [default to undefined]
**investment** | [**Investment**](Investment.md) |  | [optional] [default to undefined]
**allocationBasis** | **string** |  | [default to undefined]
**allocationBasisId** | **string** |  | [default to undefined]
**amount** | **number** |  | [default to undefined]
**isMfLineItem** | **boolean** |  | [optional] [default to undefined]

## Example

```typescript
import { LineItemBase } from './api';

const instance: LineItemBase = {
    id,
    account,
    investment,
    allocationBasis,
    allocationBasisId,
    amount,
    isMfLineItem,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
