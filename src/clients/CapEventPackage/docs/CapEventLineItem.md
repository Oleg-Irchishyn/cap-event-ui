# CapEventLineItem


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
**batchNo** | **number** |  | [optional] [default to undefined]
**originAccountKey** | **string** |  | [optional] [default to undefined]
**fundGroupLineItemInheritanceId** | **string** | A unique identifier that shows the correspondence between this CapEventLineItem and the CapEventFundGroupLineItem from which it was allocated. If there is no such correspondence, the value should be null. | [optional] [default to undefined]
**prDate** | **string** |  | [default to undefined]
**prFlag** | **boolean** |  | [default to undefined]

## Example

```typescript
import { CapEventLineItem } from './api';

const instance: CapEventLineItem = {
    id,
    account,
    investment,
    allocationBasis,
    allocationBasisId,
    amount,
    isMfLineItem,
    batchNo,
    originAccountKey,
    fundGroupLineItemInheritanceId,
    prDate,
    prFlag,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
