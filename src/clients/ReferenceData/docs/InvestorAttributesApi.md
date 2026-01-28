# InvestorAttributesApi

All URIs are relative to *http://localhost:8080/api/v1/reference-data*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getInvestorAttributes**](#getinvestorattributes) | **GET** /investor-attributes | Get investor attributes|

# **getInvestorAttributes**
> InvestorAttribute getInvestorAttributes()

Returns investor attributes for provided investorId and entityId

### Example

```typescript
import {
    InvestorAttributesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InvestorAttributesApi(configuration);

let investorId: string; //Investor ID (default to undefined)
let entityId: string; //Entity ID (default to undefined)
let sessionId: string; //Session identifier (optional) (default to undefined)

const { status, data } = await apiInstance.getInvestorAttributes(
    investorId,
    entityId,
    sessionId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **investorId** | [**string**] | Investor ID | defaults to undefined|
| **entityId** | [**string**] | Entity ID | defaults to undefined|
| **sessionId** | [**string**] | Session identifier | (optional) defaults to undefined|


### Return type

**InvestorAttribute**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Investor attributes found |  -  |
|**400** | Bad request |  -  |
|**401** | Intacct SessionId is not valid |  -  |
|**500** | Server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

