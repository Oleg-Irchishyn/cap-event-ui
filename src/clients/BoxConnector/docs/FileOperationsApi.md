# FileOperationsApi

All URIs are relative to */api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addFile**](#addfile) | **POST** /files | Add file.|
|[**copyFile**](#copyfile) | **POST** /files/{id}/copy | Copy file to another folder.|
|[**deleteFile**](#deletefile) | **DELETE** /files/{id} | Delete file by ID.|
|[**getFile**](#getfile) | **GET** /files/{id}/content | Get file by ID.|
|[**getFileMetadata**](#getfilemetadata) | **GET** /files/{id}/metadata | Get file metadata.|
|[**getFilesMetadata**](#getfilesmetadata) | **POST** /files/metadata | Get files metadata.|
|[**updateFile**](#updatefile) | **PUT** /files/{id} | Update file by ID.|
|[**uploadNewFileVersion**](#uploadnewfileversion) | **POST** /files/{id}/content | Upload new version of file.|

# **addFile**
> IdResponse addFile()

Uploads a new file in the folder with the folder ID from the request. The name of uploaded file will be the same as the file in request.

### Example

```typescript
import {
    FileOperationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FileOperationsApi(configuration);

let folderId: string; //ID of the folder where the file will be located. (default to undefined)
let file: File; //File attachment. (default to undefined)

const { status, data } = await apiInstance.addFile(
    folderId,
    file
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **folderId** | [**string**] | ID of the folder where the file will be located. | defaults to undefined|
| **file** | [**File**] | File attachment. | defaults to undefined|


### Return type

**IdResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Successfully created. Returns id of created file. |  -  |
|**400** | Bad Request |  -  |
|**401** | Unauthorized |  -  |
|**403** | Forbidden |  -  |
|**409** | Conflict |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **copyFile**
> IdResponse copyFile()

Creates a copy of the file with the specified file ID in the target folder.

### Example

```typescript
import {
    FileOperationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FileOperationsApi(configuration);

let id: string; //Source file identifier (default to undefined)
let targetFolderId: string; //Target folder identifier where the file will be copied (default to undefined)
let newName: string; //The new name for copied file. If parameter empty or null then original name will be used. (optional) (default to undefined)

const { status, data } = await apiInstance.copyFile(
    id,
    targetFolderId,
    newName
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Source file identifier | defaults to undefined|
| **targetFolderId** | [**string**] | Target folder identifier where the file will be copied | defaults to undefined|
| **newName** | [**string**] | The new name for copied file. If parameter empty or null then original name will be used. | (optional) defaults to undefined|


### Return type

**IdResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Successfully copied. Returns id of copied file. |  -  |
|**400** | Bad Request |  -  |
|**401** | Unauthorized |  -  |
|**403** | Forbidden |  -  |
|**404** | Not Found |  -  |
|**409** | Conflict |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteFile**
> deleteFile()

Deletes the file with the file ID from the request.

### Example

```typescript
import {
    FileOperationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FileOperationsApi(configuration);

let id: string; //File identifier (default to undefined)

const { status, data } = await apiInstance.deleteFile(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | File identifier | defaults to undefined|


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

# **getFile**
> File getFile()

Get file by ID

### Example

```typescript
import {
    FileOperationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FileOperationsApi(configuration);

let id: string; //File identifier (default to undefined)

const { status, data } = await apiInstance.getFile(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | File identifier | defaults to undefined|


### Return type

**File**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/octet-stream, application/json


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

# **getFileMetadata**
> FileMetadata getFileMetadata()

Gets file metadata.

### Example

```typescript
import {
    FileOperationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FileOperationsApi(configuration);

let id: string; //File identifier (default to undefined)

const { status, data } = await apiInstance.getFileMetadata(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | File identifier | defaults to undefined|


### Return type

**FileMetadata**

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

# **getFilesMetadata**
> Array<FileMetadata> getFilesMetadata(getFilesMetadataRequest)

Gets files metadata.

### Example

```typescript
import {
    FileOperationsApi,
    Configuration,
    GetFilesMetadataRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new FileOperationsApi(configuration);

let getFilesMetadataRequest: GetFilesMetadataRequest; //

const { status, data } = await apiInstance.getFilesMetadata(
    getFilesMetadataRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **getFilesMetadataRequest** | **GetFilesMetadataRequest**|  | |


### Return type

**Array<FileMetadata>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
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

# **updateFile**
> IdResponse updateFile()

Replaces the old file with file ID from request with the new one with new id. The update file    operation comprises two requests to BOX: delete file and upload a new file. The name of the uploaded file will be       the same as the file in request.

### Example

```typescript
import {
    FileOperationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FileOperationsApi(configuration);

let id: string; //File identifier (default to undefined)
let folderId: string; //ID of the folder where the file will be located. (default to undefined)
let file: File; //File attachment. (default to undefined)

const { status, data } = await apiInstance.updateFile(
    id,
    folderId,
    file
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | File identifier | defaults to undefined|
| **folderId** | [**string**] | ID of the folder where the file will be located. | defaults to undefined|
| **file** | [**File**] | File attachment. | defaults to undefined|


### Return type

**IdResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successfully updated. Returns new id of replaced file. |  -  |
|**400** | Bad Request |  -  |
|**401** | Unauthorized |  -  |
|**403** | Forbidden |  -  |
|**404** | Not Found |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **uploadNewFileVersion**
> IdResponse uploadNewFileVersion()

Uploads a new version of the file with the specified file ID. File name and id won\'t be changed after this operation.

### Example

```typescript
import {
    FileOperationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FileOperationsApi(configuration);

let id: string; //File identifier (default to undefined)
let file: File; // (default to undefined)

const { status, data } = await apiInstance.uploadNewFileVersion(
    id,
    file
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | File identifier | defaults to undefined|
| **file** | [**File**] |  | defaults to undefined|


### Return type

**IdResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successfully uploaded new version. Returns id of the file. |  -  |
|**400** | Bad Request |  -  |
|**401** | Unauthorized |  -  |
|**403** | Forbidden |  -  |
|**404** | Not Found |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

