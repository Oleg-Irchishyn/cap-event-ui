# CapEvent


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [optional] [default to undefined]
**name** | **string** |  | [optional] [default to undefined]
**capEventType** | [**CapEventType**](CapEventType.md) |  | [default to undefined]
**sponsor** | [**Sponsor**](Sponsor.md) |  | [default to undefined]
**fundGroup** | [**FundGroup**](FundGroup.md) |  | [default to undefined]
**entities** | [**Array&lt;Entity&gt;**](Entity.md) | The list with IDs of selected entities | [default to undefined]
**noticeDate** | **string** |  | [optional] [default to undefined]
**status** | [**CapEventStatus**](CapEventStatus.md) |  | [optional] [default to undefined]
**comment** | **string** |  | [optional] [default to undefined]
**footnotes** | **{ [key: string]: string; }** |  | [optional] [default to undefined]
**capEventFundGroupLineItems** | [**Array&lt;CapEventFundGroupLineItem&gt;**](CapEventFundGroupLineItem.md) |  | [optional] [default to undefined]
**capEventEntityLineItems** | [**Array&lt;CapEventEntityLineItem&gt;**](CapEventEntityLineItem.md) |  | [optional] [default to undefined]
**capEventAggregatedLineItems** | [**Array&lt;CapEventAggregatedLineItem&gt;**](CapEventAggregatedLineItem.md) |  | [optional] [default to undefined]
**totalAmount** | **number** |  | [optional] [default to undefined]
**createdAt** | **string** |  | [optional] [default to undefined]
**createdBy** | **string** |  | [optional] [default to undefined]
**modifiedAt** | **string** |  | [optional] [default to undefined]
**modifiedBy** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { CapEvent } from './api';

const instance: CapEvent = {
    id,
    name,
    capEventType,
    sponsor,
    fundGroup,
    entities,
    noticeDate,
    status,
    comment,
    footnotes,
    capEventFundGroupLineItems,
    capEventEntityLineItems,
    capEventAggregatedLineItems,
    totalAmount,
    createdAt,
    createdBy,
    modifiedAt,
    modifiedBy,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
