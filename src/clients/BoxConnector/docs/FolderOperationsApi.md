# FolderOperationsApi

All URIs are relative to */api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createFolder**](#createfolder) | **POST** /folder | Create folder.|
|[**deleteFolder**](#deletefolder) | **DELETE** /folder/{id} | Delete folder by ID.|
|[**getFolder**](#getfolder) | **GET** /folder/{id} | Get folder by ID.|
|[**updateFolder**](#updatefolder) | **PATCH** /folder/{id}/name | Update folder\&#39;s name by ID.|

# **createFolder**
> IdResponse createFolder(createFolderRequest)

Creates a folder in the folder with the folder ID from the request.

### Example

```typescript
import {
    FolderOperationsApi,
    Configuration,
    CreateFolderRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new FolderOperationsApi(configuration);

let createFolderRequest: CreateFolderRequest; //

const { status, data } = await apiInstance.createFolder(
    createFolderRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createFolderRequest** | **CreateFolderRequest**|  | |


### Return type

**IdResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Successfully created. Returns id of created folder. |  -  |
|**400** | Bad Request |  -  |
|**401** | Unauthorized |  -  |
|**403** | Forbidden |  -  |
|**409** | Conflict |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteFolder**
> deleteFolder()

Removes the folder with folder ID from the request. Removes all contents.

### Example

```typescript
import {
    FolderOperationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FolderOperationsApi(configuration);

let id: string; //Folder identifier (default to undefined)

const { status, data } = await apiInstance.deleteFolder(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Folder identifier | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | No content |  -  |
|**400** | Bad Request |  -  |
|**401** | Unauthorized |  -  |
|**403** | Forbidden |  -  |
|**404** | Not Found |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getFolder**
> GetFolderResponse getFolder()

Get folder by ID

### Example

```typescript
import {
    FolderOperationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FolderOperationsApi(configuration);

let id: string; //Folder identifier (default to undefined)

const { status, data } = await apiInstance.getFolder(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Folder identifier | defaults to undefined|


### Return type

**GetFolderResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful response |  -  |
|**400** | Bad Request |  -  |
|**401** | Unauthorized |  -  |
|**403** | Forbidden |  -  |
|**404** | Not Found |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateFolder**
> IdResponse updateFolder(updateFolderRequest)

Updates the folder\'s name. Returns the same folder ID from the request.

### Example

```typescript
import {
    FolderOperationsApi,
    Configuration,
    UpdateFolderRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new FolderOperationsApi(configuration);

let id: string; //Folder identifier (default to undefined)
let updateFolderRequest: UpdateFolderRequest; //

const { status, data } = await apiInstance.updateFolder(
    id,
    updateFolderRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateFolderRequest** | **UpdateFolderRequest**|  | |
| **id** | [**string**] | Folder identifier | defaults to undefined|


### Return type

**IdResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successfully updated. Returns id of updated folder. |  -  |
|**400** | Bad Request |  -  |
|**401** | Unauthorized |  -  |
|**403** | Forbidden |  -  |
|**404** | Not Found |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

