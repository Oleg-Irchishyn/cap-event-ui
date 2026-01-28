# AllocationBasesApi

All URIs are relative to *http://localhost:8080/api/v1/reference-data*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getAllocationBases**](#getallocationbases) | **GET** /allocation-bases | Retrieve list of AllocationBasis|

# **getAllocationBases**
> Array<AllocationBasis> getAllocationBases()


### Example

```typescript
import {
    AllocationBasesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AllocationBasesApi(configuration);

let sessionId: string; //Session identifier used to resolve Sponsor ID in case of it\'s absence (optional) (default to undefined)

const { status, data } = await apiInstance.getAllocationBases(
    sessionId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **sessionId** | [**string**] | Session identifier used to resolve Sponsor ID in case of it\&#39;s absence | (optional) defaults to undefined|


### Return type

**Array<AllocationBasis>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | List of AllocationBasis |  -  |
|**401** | Intacct SessionId is not valid |  -  |
|**500** | Server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

