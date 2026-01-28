# Template

The information about template in the system.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | The id of the template registered in the library in UUID format. | [default to undefined]
**boxFile** | [**CeBoxFile**](CeBoxFile.md) |  | [optional] [default to undefined]
**description** | **string** | The user description of the template. | [optional] [default to undefined]
**sourceTemplate** | [**Template**](Template.md) |  | [optional] [default to undefined]
**sponsor** | [**Sponsor**](Sponsor.md) |  | [optional] [default to undefined]
**fundGroup** | [**FundGroup**](FundGroup.md) |  | [optional] [default to undefined]
**entity** | [**Entity**](Entity.md) |  | [optional] [default to undefined]
**createdBy** | **string** | The name or id of the user who created a template. | [optional] [default to undefined]
**modifiedBy** | **string** | The name or id of the user who make the last changes in a template. | [optional] [default to undefined]
**status** | **string** | The status of the template. | [optional] [default to undefined]
**templateName** | **string** | Name of template. | [optional] [default to undefined]

## Example

```typescript
import { Template } from './api';

const instance: Template = {
    id,
    boxFile,
    description,
    sourceTemplate,
    sponsor,
    fundGroup,
    entity,
    createdBy,
    modifiedBy,
    status,
    templateName,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
