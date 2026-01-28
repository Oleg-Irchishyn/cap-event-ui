# TemplateApi

All URIs are relative to *http://localhost:8080/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createTemplate**](#createtemplate) | **POST** /templates | Create new template|
|[**getTemplateById**](#gettemplatebyid) | **GET** /templates/{templateId} | Get template by id|
|[**getTemplateContent**](#gettemplatecontent) | **GET** /templates/{templateId}/content | Returns required template.|
|[**getTemplateContentByParameters**](#gettemplatecontentbyparameters) | **GET** /templates/content | Returns template by sponsor, group, and entity IDs.|
|[**getTemplateMetadata**](#gettemplatemetadata) | **GET** /template/metadata | Get template metadata|
|[**getTemplates**](#gettemplates) | **GET** /templates | Get list of the available and allowed templates.|
|[**updateTemplate**](#updatetemplate) | **PUT** /templates/{templateId} | Upload a new version of the template.|

# **createTemplate**
> Template createTemplate()

This endpoint creates a new template for selected assignment level

### Example

```typescript
import {
    TemplateApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TemplateApi(configuration);

let sponsorId: string; //ID of the sponsor (required) (default to undefined)
let sponsorName: string; //Name of the sponsor (required) (default to undefined)
let newTemplate: File; //Template file to upload (only .dotx files are accepted) (default to undefined)
let fundGroupId: string; //ID of the fund group (optional) (optional) (default to undefined)
let entityId: string; //ID of the entity (optional) (optional) (default to undefined)

const { status, data } = await apiInstance.createTemplate(
    sponsorId,
    sponsorName,
    newTemplate,
    fundGroupId,
    entityId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **sponsorId** | [**string**] | ID of the sponsor (required) | defaults to undefined|
| **sponsorName** | [**string**] | Name of the sponsor (required) | defaults to undefined|
| **newTemplate** | [**File**] | Template file to upload (only .dotx files are accepted) | defaults to undefined|
| **fundGroupId** | [**string**] | ID of the fund group (optional) | (optional) defaults to undefined|
| **entityId** | [**string**] | ID of the entity (optional) | (optional) defaults to undefined|


### Return type

**Template**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Template created successfully |  -  |
|**400** | Bad request - invalid or missing parameters, or invalid file format (only .dotx files are accepted) |  -  |
|**401** | Unauthorized - authentication required |  -  |
|**403** | Forbidden - insufficient permissions |  -  |
|**409** | Conflict - file already exist |  -  |
|**422** | Unprocessable Entity - validation errors |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getTemplateById**
> Template getTemplateById()

This endpoint retrieves a template by template ID.

### Example

```typescript
import {
    TemplateApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TemplateApi(configuration);

let templateId: string; //ID of the template (default to undefined)
let sessionId: string; //Session identifier used to resolve Sponsor ID in case of it\'s absence (optional) (default to undefined)

const { status, data } = await apiInstance.getTemplateById(
    templateId,
    sessionId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **templateId** | [**string**] | ID of the template | defaults to undefined|
| **sessionId** | [**string**] | Session identifier used to resolve Sponsor ID in case of it\&#39;s absence | (optional) defaults to undefined|


### Return type

**Template**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successfully retrieved template |  -  |
|**400** | Bad request - invalid or missing parameters |  -  |
|**401** | Unauthorized - authentication required |  -  |
|**403** | Forbidden - insufficient permissions |  -  |
|**404** | No templates found for the specified criteria |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getTemplateContent**
> File getTemplateContent()

Returns ZIP archive with the required template and the CSV file with available endpoints.

### Example

```typescript
import {
    TemplateApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TemplateApi(configuration);

let templateId: string; //ID of the template whichi should be updated. (default to undefined)

const { status, data } = await apiInstance.getTemplateContent(
    templateId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **templateId** | [**string**] | ID of the template whichi should be updated. | defaults to undefined|


### Return type

**File**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/zip, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | ZIP file with the MS Word template and the CSV file with available endpoints. |  -  |
|**401** | Unauthorized - authentication required |  -  |
|**403** | Forbidden - insufficient permissions |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getTemplateContentByParameters**
> File getTemplateContentByParameters()

Returns ZIP archive with the template and the CSV file with available datapoints. Searches for a template matching the provided IDs, or falls back to a default template if not found.

### Example

```typescript
import {
    TemplateApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TemplateApi(configuration);

let sponsorId: string; //ID of the sponsor. (default to undefined)
let fundGroupId: string; //ID of the fund group. (optional) (default to undefined)
let entityId: string; //ID of the entity. (optional) (default to undefined)

const { status, data } = await apiInstance.getTemplateContentByParameters(
    sponsorId,
    fundGroupId,
    entityId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **sponsorId** | [**string**] | ID of the sponsor. | defaults to undefined|
| **fundGroupId** | [**string**] | ID of the fund group. | (optional) defaults to undefined|
| **entityId** | [**string**] | ID of the entity. | (optional) defaults to undefined|


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
|**200** | ZIP file with the MS Word template and the CSV file with available datapoints. |  -  |
|**401** | Unauthorized - authentication required |  -  |
|**403** | Forbidden - insufficient permissions |  -  |
|**404** | Template not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getTemplateMetadata**
> TemplateMetadata getTemplateMetadata()

This endpoint retrieves a template metadata based on sponsor ID, fund group ID and entity ID.

### Example

```typescript
import {
    TemplateApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TemplateApi(configuration);

let sponsorId: string; //ID of the sponsor (default to undefined)
let fundGroupId: string; //ID of the fund group id (optional) (default to undefined)
let entityId: string; //ID of the entity (optional) (default to undefined)
let depth: number; //Specifies the depth of nested objects to include in the response. 0 - returns only the library-stored data; 1 - additionally includes Box file information. (optional) (default to 1)

const { status, data } = await apiInstance.getTemplateMetadata(
    sponsorId,
    fundGroupId,
    entityId,
    depth
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **sponsorId** | [**string**] | ID of the sponsor | defaults to undefined|
| **fundGroupId** | [**string**] | ID of the fund group id | (optional) defaults to undefined|
| **entityId** | [**string**] | ID of the entity | (optional) defaults to undefined|
| **depth** | [**number**] | Specifies the depth of nested objects to include in the response. 0 - returns only the library-stored data; 1 - additionally includes Box file information. | (optional) defaults to 1|


### Return type

**TemplateMetadata**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successfully retrieved template metadata |  -  |
|**400** | Bad request - invalid or missing parameters |  -  |
|**401** | Unauthorized - authentication required |  -  |
|**403** | Forbidden - insufficient permissions |  -  |
|**404** | No templates found for the specified criteria |  -  |
|**422** | Unprocessable Entity - validation errors |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getTemplates**
> Array<Template> getTemplates()

This endpoint retrieves a list of the available and allowed templates.

### Example

```typescript
import {
    TemplateApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TemplateApi(configuration);

let sessionId: string; //Session identifier used to resolve Sponsor ID in case of it\'s absence (optional) (default to undefined)

const { status, data } = await apiInstance.getTemplates(
    sessionId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **sessionId** | [**string**] | Session identifier used to resolve Sponsor ID in case of it\&#39;s absence | (optional) defaults to undefined|


### Return type

**Array<Template>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successfully retrieved list of the templates |  -  |
|**401** | Unauthorized - authentication required |  -  |
|**403** | Forbidden - insufficient permissions |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateTemplate**
> updateTemplate()

Upload a new version of the template. Even if template is identical it will create a new template version.

### Example

```typescript
import {
    TemplateApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TemplateApi(configuration);

let templateId: string; //ID of the template which should be updated. (default to undefined)
let newTemplate: File; //Template file to upload (only .dotx files are accepted) (default to undefined)

const { status, data } = await apiInstance.updateTemplate(
    templateId,
    newTemplate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **templateId** | [**string**] | ID of the template which should be updated. | defaults to undefined|
| **newTemplate** | [**File**] | Template file to upload (only .dotx files are accepted) | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | Returns 204 status code on success. |  -  |
|**400** | Bad request - invalid or missing parameters, or invalid file format (only .dotx files are accepted) |  -  |
|**401** | Unauthorized - authentication required |  -  |
|**403** | Forbidden - insufficient permissions |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

