# JournalEntry

Journal entry

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**account** | [**Account**](Account.md) |  | [optional] [default to undefined]
**investment** | [**Investment**](Investment.md) |  | [optional] [default to undefined]
**prDate** | **string** |  | [optional] [default to undefined]
**prFlag** | **string** |  | [optional] [default to undefined]
**agnstCommit** | **string** |  | [optional] [default to undefined]
**allocationBasis** | **string** |  | [optional] [default to undefined]
**amount** | **number** | Amount of the journal entry | [optional] [default to undefined]
**trType** | **number** | Tr type | [optional] [default to undefined]
**batchDate** | **string** | Batch date | [optional] [default to undefined]
**description** | **string** | Description | [optional] [default to undefined]
**batchNo** | **number** | Batch number | [optional] [default to undefined]
**entity** | [**Entity**](Entity.md) |  | [optional] [default to undefined]
**exchangeRate** | **number** |  | [optional] [default to undefined]
**classId** | **string** |  | [optional] [default to undefined]
**customerId** | **string** |  | [optional] [default to undefined]
**isRounded** | **boolean** |  | [optional] [default to undefined]
**optOutInvestors** | **string** |  | [optional] [default to undefined]
**allocationBasisDate** | **string** | Allocation Basis date | [optional] [default to undefined]

## Example

```typescript
import { JournalEntry } from './api';

const instance: JournalEntry = {
    account,
    investment,
    prDate,
    prFlag,
    agnstCommit,
    allocationBasis,
    amount,
    trType,
    batchDate,
    description,
    batchNo,
    entity,
    exchangeRate,
    classId,
    customerId,
    isRounded,
    optOutInvestors,
    allocationBasisDate,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
