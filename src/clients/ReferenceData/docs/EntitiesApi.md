# EntitiesApi

All URIs are relative to *http://localhost:8080/api/v1/reference-data*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getEntitiesByFundGroup**](#getentitiesbyfundgroup) | **GET** /fund-groups/{fundGroupId}/entities | Get entities by fund group ID|

# **getEntitiesByFundGroup**
> Array<Entity> getEntitiesByFundGroup()


### Example

```typescript
import {
    EntitiesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EntitiesApi(configuration);

let fundGroupId: string; // (default to undefined)
let sessionId: string; //Session identifier (optional) (default to undefined)
let statuses: Array<string>; //Filter by entity statuses (optional) (default to undefined)
let typesToExclude: Array<string>; //Exclude specific entity types (optional) (default to undefined)

const { status, data } = await apiInstance.getEntitiesByFundGroup(
    fundGroupId,
    sessionId,
    statuses,
    typesToExclude
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **fundGroupId** | [**string**] |  | defaults to undefined|
| **sessionId** | [**string**] | Session identifier | (optional) defaults to undefined|
| **statuses** | **Array&lt;string&gt;** | Filter by entity statuses | (optional) defaults to undefined|
| **typesToExclude** | **Array&lt;string&gt;** | Exclude specific entity types | (optional) defaults to undefined|


### Return type

**Array<Entity>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | List of entities found |  -  |
|**400** | Bad request |  -  |
|**401** | Intacct SessionId is not valid |  -  |
|**404** | No entities found |  -  |
|**500** | Server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

