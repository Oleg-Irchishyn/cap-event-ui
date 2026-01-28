# CapEventEntityLineItem


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [optional] [default to undefined]
**entity** | [**Entity**](Entity.md) |  | [default to undefined]
**noticeDate** | **string** |  | [default to undefined]
**dueDate** | **string** |  | [default to undefined]
**templateId** | **string** |  | [optional] [default to undefined]
**includeUncalledMgmtFee** | **boolean** |  | [optional] [default to undefined]
**mgmtFeeJournalEntry** | [**MgmtFeeJournalEntry**](MgmtFeeJournalEntry.md) |  | [optional] [default to undefined]
**capEventLineItems** | [**Array&lt;CapEventLineItem&gt;**](CapEventLineItem.md) |  | [default to undefined]

## Example

```typescript
import { CapEventEntityLineItem } from './api';

const instance: CapEventEntityLineItem = {
    id,
    entity,
    noticeDate,
    dueDate,
    templateId,
    includeUncalledMgmtFee,
    mgmtFeeJournalEntry,
    capEventLineItems,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
