# JournalEntryApi

All URIs are relative to *http://localhost:8080/api/v1/reference-data*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getJournalEntries**](#getjournalentries) | **GET** /journal-entries | Get journal entries by parameters|
|[**getMgmtFeeGLLineItems**](#getmgmtfeegllineitems) | **GET** /journal-entries/mgmt-fee/line-items | Get management fee journal entry line items|
|[**getMgmtFeeJournalEntries**](#getmgmtfeejournalentries) | **GET** /journal-entries/mgmt-fee | Get management fee journal entries|
|[**getTotalAmountJeForEntities**](#gettotalamountjeforentities) | **GET** /journal-entries/entities/total-amount | Get total amount journal entries by entityIds and allocationBasis|

# **getJournalEntries**
> Array<JournalEntry> getJournalEntries()


### Example

```typescript
import {
    JournalEntryApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new JournalEntryApi(configuration);

let batchNo: number; //Batch number to filter journal entry (default to undefined)
let accountKey: string; //Account key to filter journal entry (default to undefined)
let allocationBasis: string; //Allocation basis to filter journal entry (default to undefined)
let entityId: string; //Entity ID to filter journal entry (default to undefined)
let sessionId: string; //Session identifier used to resolve Sponsor ID in case of it\'s absence (optional) (default to undefined)

const { status, data } = await apiInstance.getJournalEntries(
    batchNo,
    accountKey,
    allocationBasis,
    entityId,
    sessionId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **batchNo** | [**number**] | Batch number to filter journal entry | defaults to undefined|
| **accountKey** | [**string**] | Account key to filter journal entry | defaults to undefined|
| **allocationBasis** | [**string**] | Allocation basis to filter journal entry | defaults to undefined|
| **entityId** | [**string**] | Entity ID to filter journal entry | defaults to undefined|
| **sessionId** | [**string**] | Session identifier used to resolve Sponsor ID in case of it\&#39;s absence | (optional) defaults to undefined|


### Return type

**Array<JournalEntry>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | List of journal entries |  -  |
|**400** | Bad request |  -  |
|**401** | Intacct SessionId is not valid |  -  |
|**500** | Server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getMgmtFeeGLLineItems**
> Array<JournalEntry> getMgmtFeeGLLineItems()


### Example

```typescript
import {
    JournalEntryApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new JournalEntryApi(configuration);

let batchNo: number; //Batch number to filter journal entry line items (default to undefined)
let entityId: string; //Entity ID to filter journal entry line items (default to undefined)
let state: string; //State to filter journal entry line items (default to undefined)
let calledFlag: string; //Called flag to filter journal entry line items (default to undefined)
let fsLineItems: Array<string>; //List of financial statement line items to filter (optional) (default to undefined)
let sessionId: string; //Session identifier used to resolve Sponsor ID in case of it\'s absence (optional) (default to undefined)

const { status, data } = await apiInstance.getMgmtFeeGLLineItems(
    batchNo,
    entityId,
    state,
    calledFlag,
    fsLineItems,
    sessionId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **batchNo** | [**number**] | Batch number to filter journal entry line items | defaults to undefined|
| **entityId** | [**string**] | Entity ID to filter journal entry line items | defaults to undefined|
| **state** | [**string**] | State to filter journal entry line items | defaults to undefined|
| **calledFlag** | [**string**] | Called flag to filter journal entry line items | defaults to undefined|
| **fsLineItems** | **Array&lt;string&gt;** | List of financial statement line items to filter | (optional) defaults to undefined|
| **sessionId** | [**string**] | Session identifier used to resolve Sponsor ID in case of it\&#39;s absence | (optional) defaults to undefined|


### Return type

**Array<JournalEntry>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | List of management fee journal entry line items |  -  |
|**400** | Bad request |  -  |
|**401** | Intacct SessionId is not valid |  -  |
|**500** | Server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getMgmtFeeJournalEntries**
> Array<JournalEntry> getMgmtFeeJournalEntries()


### Example

```typescript
import {
    JournalEntryApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new JournalEntryApi(configuration);

let entityIds: Array<string>; //List of entity IDs to filter journal entries (optional) (default to undefined)
let fsLineItems: Array<string>; //List of financial statement line items to filter (optional) (default to undefined)
let calledFlag: string; //Called flag to filter journal entries (optional) (default to undefined)
let sessionId: string; //Session identifier used to resolve Sponsor ID in case of it\'s absence (optional) (default to undefined)

const { status, data } = await apiInstance.getMgmtFeeJournalEntries(
    entityIds,
    fsLineItems,
    calledFlag,
    sessionId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **entityIds** | **Array&lt;string&gt;** | List of entity IDs to filter journal entries | (optional) defaults to undefined|
| **fsLineItems** | **Array&lt;string&gt;** | List of financial statement line items to filter | (optional) defaults to undefined|
| **calledFlag** | [**string**] | Called flag to filter journal entries | (optional) defaults to undefined|
| **sessionId** | [**string**] | Session identifier used to resolve Sponsor ID in case of it\&#39;s absence | (optional) defaults to undefined|


### Return type

**Array<JournalEntry>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | List of management fee journal entries |  -  |
|**400** | Bad request |  -  |
|**401** | Intacct SessionId is not valid |  -  |
|**500** | Server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getTotalAmountJeForEntities**
> Array<JournalEntry> getTotalAmountJeForEntities()


### Example

```typescript
import {
    JournalEntryApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new JournalEntryApi(configuration);

let entityIds: Array<string>; // (default to undefined)
let allocationBasis: string; //Allocation basis (default to undefined)
let toDate: string; //Date up to which transactions are included (inclusive) (default to undefined)
let sessionId: string; //Session identifier used to resolve Sponsor ID in case of it\'s absence (optional) (default to undefined)

const { status, data } = await apiInstance.getTotalAmountJeForEntities(
    entityIds,
    allocationBasis,
    toDate,
    sessionId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **entityIds** | **Array&lt;string&gt;** |  | defaults to undefined|
| **allocationBasis** | [**string**] | Allocation basis | defaults to undefined|
| **toDate** | [**string**] | Date up to which transactions are included (inclusive) | defaults to undefined|
| **sessionId** | [**string**] | Session identifier used to resolve Sponsor ID in case of it\&#39;s absence | (optional) defaults to undefined|


### Return type

**Array<JournalEntry>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | List of journal entries that contains total amount for entities |  -  |
|**400** | Bad request |  -  |
|**401** | Intacct SessionId is not valid |  -  |
|**500** | Server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

