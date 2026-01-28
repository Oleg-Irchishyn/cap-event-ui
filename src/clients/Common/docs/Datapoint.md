# Datapoint


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [optional] [default to undefined]
**name** | **string** |  | [default to undefined]
**datapointTable** | [**Array&lt;Datapoint&gt;**](Datapoint.md) |  | [optional] [default to undefined]
**value** | **string** |  | [optional] [default to undefined]
**defaultValue** | **string** |  | [optional] [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**queryId** | **string** |  | [optional] [default to undefined]
**sourceType** | [**DatapointSourceType**](DatapointSourceType.md) |  | [optional] [default to undefined]
**queryFilters** | [**Array&lt;QueryFilter&gt;**](QueryFilter.md) |  | [optional] [default to undefined]
**sourceField** | **string** |  | [optional] [default to undefined]
**scope** | [**DatapointScope**](DatapointScope.md) |  | [optional] [default to undefined]

## Example

```typescript
import { Datapoint } from './api';

const instance: Datapoint = {
    id,
    name,
    datapointTable,
    value,
    defaultValue,
    description,
    queryId,
    sourceType,
    queryFilters,
    sourceField,
    scope,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
