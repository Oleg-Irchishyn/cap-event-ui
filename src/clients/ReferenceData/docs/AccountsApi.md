# AccountsApi

All URIs are relative to *http://localhost:8080/api/v1/reference-data*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getAccounts**](#getaccounts) | **GET** /accounts | Retrieve list of accounts|
|[**getMappedAccount**](#getmappedaccount) | **GET** /accounts/mapped/{id} | Get mapped account|

# **getAccounts**
> Array<Account> getAccounts()


### Example

```typescript
import {
    AccountsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AccountsApi(configuration);

let sponsorId: string; //Sponsor ID which accounts to retrieve (default to undefined)
let fsGroupings: Array<string>; //Financial Groupings to include (optional) (default to undefined)
let capitalCategories: Array<string>; //Capital Categories to exclude (optional) (default to undefined)
let sessionId: string; //Session identifier used to resolve Sponsor ID in case of it\'s absence (optional) (default to undefined)

const { status, data } = await apiInstance.getAccounts(
    sponsorId,
    fsGroupings,
    capitalCategories,
    sessionId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **sponsorId** | [**string**] | Sponsor ID which accounts to retrieve | defaults to undefined|
| **fsGroupings** | **Array&lt;string&gt;** | Financial Groupings to include | (optional) defaults to undefined|
| **capitalCategories** | **Array&lt;string&gt;** | Capital Categories to exclude | (optional) defaults to undefined|
| **sessionId** | [**string**] | Session identifier used to resolve Sponsor ID in case of it\&#39;s absence | (optional) defaults to undefined|


### Return type

**Array<Account>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | List of accounts |  -  |
|**401** | Intacct SessionId is not valid |  -  |
|**404** | No resourse found |  -  |
|**500** | Server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getMappedAccount**
> Account getMappedAccount()


### Example

```typescript
import {
    AccountsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AccountsApi(configuration);

let id: string; //Source account ID to search for mapped account (default to undefined)
let sessionId: string; //Session identifier used to resolve Sponsor ID in case of it\'s absence (optional) (default to undefined)

const { status, data } = await apiInstance.getMappedAccount(
    id,
    sessionId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Source account ID to search for mapped account | defaults to undefined|
| **sessionId** | [**string**] | Session identifier used to resolve Sponsor ID in case of it\&#39;s absence | (optional) defaults to undefined|


### Return type

**Account**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | List of accounts |  -  |
|**401** | Intacct SessionId is not valid |  -  |
|**404** | No resourse found |  -  |
|**500** | Server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

