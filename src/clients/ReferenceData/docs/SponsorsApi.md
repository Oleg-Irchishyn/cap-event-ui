# SponsorsApi

All URIs are relative to *http://localhost:8080/api/v1/reference-data*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getSponsors**](#getsponsors) | **GET** /sponsors | Retrieve list of sponsors|

# **getSponsors**
> Array<Sponsor> getSponsors()


### Example

```typescript
import {
    SponsorsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SponsorsApi(configuration);

const { status, data } = await apiInstance.getSponsors();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<Sponsor>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | List of sponsors |  -  |
|**500** | Server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

