# InvestmentsApi

All URIs are relative to *http://localhost:8080/api/v1/reference-data*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getInvestments**](#getinvestments) | **GET** /investments | Retrieve list of investments|

# **getInvestments**
> Array<Investment> getInvestments()


### Example

```typescript
import {
    InvestmentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InvestmentsApi(configuration);

let sessionId: string; //Session identifier used to resolve Sponsor ID in case of it\'s absence (optional) (default to undefined)

const { status, data } = await apiInstance.getInvestments(
    sessionId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **sessionId** | [**string**] | Session identifier used to resolve Sponsor ID in case of it\&#39;s absence | (optional) defaults to undefined|


### Return type

**Array<Investment>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | List of investments |  -  |
|**400** | Bad request |  -  |
|**401** | Intacct SessionId is not valid |  -  |
|**500** | Server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

