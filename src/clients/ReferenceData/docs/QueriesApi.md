# QueriesApi

All URIs are relative to *http://localhost:8080/api/v1/reference-data*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**executeQuery**](#executequery) | **GET** /queries/{queryId}/filters | Execute query with id and arguments from request and obtain results|
|[**getAllQueries**](#getallqueries) | **GET** /queries | Get all queries|

# **executeQuery**
> { [key: string]: string; } executeQuery()


### Example

```typescript
import {
    QueriesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new QueriesApi(configuration);

let queryId: string; //Query identifier (default to undefined)
let arguments: { [key: string]: string; }; //Arguments for query execution (optional) (default to undefined)
let sessionId: string; //Session identifier used to resolve Sponsor ID in case of it\'s absence (optional) (default to undefined)

const { status, data } = await apiInstance.executeQuery(
    queryId,
    arguments,
    sessionId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **queryId** | [**string**] | Query identifier | defaults to undefined|
| **arguments** | **{ [key: string]: string; }** | Arguments for query execution | (optional) defaults to undefined|
| **sessionId** | [**string**] | Session identifier used to resolve Sponsor ID in case of it\&#39;s absence | (optional) defaults to undefined|


### Return type

**{ [key: string]: string; }**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Query executed |  -  |
|**401** | Intacct SessionId is not valid |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAllQueries**
> Array<Query> getAllQueries()


### Example

```typescript
import {
    QueriesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new QueriesApi(configuration);

const { status, data } = await apiInstance.getAllQueries();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<Query>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Queries found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

