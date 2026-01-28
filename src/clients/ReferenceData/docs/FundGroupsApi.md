# FundGroupsApi

All URIs are relative to *http://localhost:8080/api/v1/reference-data*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**searchFundGroupsBySponsor**](#searchfundgroupsbysponsor) | **GET** /fund-groups/search | Search fund groups by sponsor ID|

# **searchFundGroupsBySponsor**
> Array<FundGroup> searchFundGroupsBySponsor()


### Example

```typescript
import {
    FundGroupsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FundGroupsApi(configuration);

let sponsorId: string; //Sponsor ID used to filter fund groups (optional) (default to undefined)
let sessionId: string; //Session identifier used to resolve Sponsor ID in case of it\'s absence (optional) (default to undefined)

const { status, data } = await apiInstance.searchFundGroupsBySponsor(
    sponsorId,
    sessionId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **sponsorId** | [**string**] | Sponsor ID used to filter fund groups | (optional) defaults to undefined|
| **sessionId** | [**string**] | Session identifier used to resolve Sponsor ID in case of it\&#39;s absence | (optional) defaults to undefined|


### Return type

**Array<FundGroup>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | List of fund groups found |  -  |
|**400** | Bad request |  -  |
|**401** | Intacct SessionId is not valid |  -  |
|**404** | No fund groups found |  -  |
|**500** | Server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

