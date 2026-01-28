# Entity


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [optional] [default to undefined]
**name** | **string** |  | [optional] [default to undefined]
**dueDateDays** | **string** |  | [optional] [default to undefined]
**dueDateType** | **string** |  | [optional] [default to undefined]
**mfBasis** | **string** |  | [optional] [default to undefined]
**allocationBasis** | [**AllocationBasis**](AllocationBasis.md) |  | [optional] [default to undefined]
**allocationBasisPostInvPeriod** | [**AllocationBasis**](AllocationBasis.md) |  | [optional] [default to undefined]
**mfBasisDateDefault** | **string** |  | [optional] [default to undefined]
**yearFractionApproach** | **string** |  | [optional] [default to undefined]
**mfPercent** | **string** |  | [optional] [default to undefined]
**mfStartDate** | **string** |  | [optional] [default to undefined]
**mfStepDownDate** | **string** |  | [optional] [default to undefined]
**mfPercentPostInvPeriod** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { Entity } from './api';

const instance: Entity = {
    id,
    name,
    dueDateDays,
    dueDateType,
    mfBasis,
    allocationBasis,
    allocationBasisPostInvPeriod,
    mfBasisDateDefault,
    yearFractionApproach,
    mfPercent,
    mfStartDate,
    mfStepDownDate,
    mfPercentPostInvPeriod,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
