# DefaultApi

All URIs are relative to *http://localhost:8081/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**allocateEntities**](#allocateentities) | **POST** /cap-events/fund-group/allocate | Allocate entities for fund group data|
|[**allocateLineItem**](#allocatelineitem) | **POST** /cap-events/line-items/allocate | Allocate investors for cap event line item|
|[**createDraft**](#createdraft) | **POST** /cap-events/draft | Creates capital event as draft|
|[**deleteCapEvent**](#deletecapevent) | **DELETE** /cap-events/{id} | Delete capital event and related files by ID|
|[**getAllocatedMgmtFeeJournalEntries**](#getallocatedmgmtfeejournalentries) | **GET** /cap-events/journal-entries/mgmt-fee/allocate | Retrieve allocated journal entry|
|[**getCapEventById**](#getcapeventbyid) | **GET** /cap-events/{id} | Get capital event by ID|
|[**getCapEventList**](#getcapeventlist) | **GET** /cap-events | Retrieve Capital event list with optional filters: Sponsor ID and Status list|
|[**getCapEventTypes**](#getcapeventtypes) | **GET** /cap-events/types | Retrieve list of capital event types|
|[**getMgmtFeeJournalEntries**](#getmgmtfeejournalentries) | **GET** /cap-events/journal-entries/mgmt-fee | Retrieve management fee journal entries for entities|
|[**getMgmtFeeLineItems**](#getmgmtfeelineitems) | **GET** /cap-events/line-items/mgmt-fees | Retrieve list of CELIs represents uncalled management fee entries|
|[**investorDocumentContent**](#investordocumentcontent) | **POST** /cap-events/investors/document | Generate document content for Investor. Request line item should contain plInvestorEntries related to only one Investor|
|[**process**](#process) | **POST** /cap-events/process | Process capital event|
|[**submit**](#submit) | **POST** /cap-events | Submits capital event|
|[**update**](#update) | **POST** /cap-events/{id} | Update capital event in status draft|

# **allocateEntities**
> { [key: string]: number; } allocateEntities(fundGroupAllocationInput)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    FundGroupAllocationInput
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let fundGroupAllocationInput: FundGroupAllocationInput; //
let sessionId: string; //Session identifier used to resolve Sponsor ID in case of it\'s absence (optional) (default to undefined)

const { status, data } = await apiInstance.allocateEntities(
    fundGroupAllocationInput,
    sessionId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **fundGroupAllocationInput** | **FundGroupAllocationInput**|  | |
| **sessionId** | [**string**] | Session identifier used to resolve Sponsor ID in case of it\&#39;s absence | (optional) defaults to undefined|


### Return type

**{ [key: string]: number; }**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Map of entity IDs to allocated amounts |  -  |
|**400** | Bad request |  -  |
|**401** | Intacct SessionId is not valid |  -  |
|**500** | Server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **allocateLineItem**
> Array<InvestorEntry> allocateLineItem(allocationInput)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    AllocationInput
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let allocationInput: AllocationInput; //
let sessionId: string; //Session identifier used to resolve Sponsor ID in case of it\'s absence (optional) (default to undefined)

const { status, data } = await apiInstance.allocateLineItem(
    allocationInput,
    sessionId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **allocationInput** | **AllocationInput**|  | |
| **sessionId** | [**string**] | Session identifier used to resolve Sponsor ID in case of it\&#39;s absence | (optional) defaults to undefined|


### Return type

**Array<InvestorEntry>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | List of allocated investor entries |  -  |
|**400** | Bad request |  -  |
|**401** | Intacct SessionId is not valid |  -  |
|**404** | Resource not found |  -  |
|**500** | Server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createDraft**
> CapEvent createDraft(capEventDraft)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    CapEventDraft
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let capEventDraft: CapEventDraft; //

const { status, data } = await apiInstance.createDraft(
    capEventDraft
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **capEventDraft** | **CapEventDraft**|  | |


### Return type

**CapEvent**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The CapEvent object stored in the system. |  -  |
|**400** | Bad request |  -  |
|**500** | Server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteCapEvent**
> deleteCapEvent()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //Capital event ID to delete (default to undefined)

const { status, data } = await apiInstance.deleteCapEvent(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Capital event ID to delete | defaults to undefined|


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
|**204** | Capital event successfully deleted |  -  |
|**400** | Bad request |  -  |
|**404** | Capital event not found |  -  |
|**500** | Server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAllocatedMgmtFeeJournalEntries**
> Array<InvestorEntry> getAllocatedMgmtFeeJournalEntries()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let batchNo: number; //Batch number to filter journal entry (default to undefined)
let accountKey: string; //Account key to filter journal entry (default to undefined)
let allocationBasis: string; //Allocation basis to filter journal entry (default to undefined)
let allocationBasisId: string; //Allocation basis id to allocate journal entries (default to undefined)
let entityId: string; //Entity ID to filter journal entry (default to undefined)
let sessionId: string; //Session identifier used to resolve Sponsor ID in case of it\'s absence (optional) (default to undefined)

const { status, data } = await apiInstance.getAllocatedMgmtFeeJournalEntries(
    batchNo,
    accountKey,
    allocationBasis,
    allocationBasisId,
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
| **allocationBasisId** | [**string**] | Allocation basis id to allocate journal entries | defaults to undefined|
| **entityId** | [**string**] | Entity ID to filter journal entry | defaults to undefined|
| **sessionId** | [**string**] | Session identifier used to resolve Sponsor ID in case of it\&#39;s absence | (optional) defaults to undefined|


### Return type

**Array<InvestorEntry>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | List of management fee journal entries grouped by entity ID |  -  |
|**400** | Bad request |  -  |
|**401** | Intacct SessionId is not valid |  -  |
|**500** | Server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getCapEventById**
> CapEvent getCapEventById()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //Capital event ID (default to undefined)
let sessionId: string; //Session identifier used to resolve Sponsor ID in case of it\'s absence (optional) (default to undefined)

const { status, data } = await apiInstance.getCapEventById(
    id,
    sessionId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Capital event ID | defaults to undefined|
| **sessionId** | [**string**] | Session identifier used to resolve Sponsor ID in case of it\&#39;s absence | (optional) defaults to undefined|


### Return type

**CapEvent**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The CapEvent object stored in the system. |  -  |
|**404** | Capital event not found |  -  |
|**500** | Server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getCapEventList**
> Array<CapEvent> getCapEventList()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let sponsorId: string; //Optional Sponsor ID filter to search for matching entries (optional) (default to undefined)
let statuses: Array<CapEventStatus>; //Optional Status List filter to search for matching entries (optional) (default to undefined)
let sessionId: string; //Session identifier used to resolve Sponsor ID in case of it\'s absence (optional) (default to undefined)

const { status, data } = await apiInstance.getCapEventList(
    sponsorId,
    statuses,
    sessionId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **sponsorId** | [**string**] | Optional Sponsor ID filter to search for matching entries | (optional) defaults to undefined|
| **statuses** | **Array&lt;CapEventStatus&gt;** | Optional Status List filter to search for matching entries | (optional) defaults to undefined|
| **sessionId** | [**string**] | Session identifier used to resolve Sponsor ID in case of it\&#39;s absence | (optional) defaults to undefined|


### Return type

**Array<CapEvent>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | List of capital events |  -  |
|**401** | Intacct SessionId is not valid |  -  |
|**500** | Server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getCapEventTypes**
> Array<CapEventType> getCapEventTypes()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.getCapEventTypes();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<CapEventType>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | List of capital event types |  -  |
|**400** | Bad request |  -  |
|**404** | No event types found |  -  |
|**500** | Server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getMgmtFeeJournalEntries**
> { [key: string]: Array<MgmtFeeJournalEntry>; } getMgmtFeeJournalEntries()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let entityIds: Array<string>; //List of entity IDs to search for matching journal entries (default to undefined)
let sessionId: string; //Session identifier used to resolve Sponsor ID in case of it\'s absence (optional) (default to undefined)

const { status, data } = await apiInstance.getMgmtFeeJournalEntries(
    entityIds,
    sessionId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **entityIds** | **Array&lt;string&gt;** | List of entity IDs to search for matching journal entries | defaults to undefined|
| **sessionId** | [**string**] | Session identifier used to resolve Sponsor ID in case of it\&#39;s absence | (optional) defaults to undefined|


### Return type

**{ [key: string]: Array<MgmtFeeJournalEntry>; }**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Map of management fee journal entries grouped by entity ID |  -  |
|**400** | Bad request |  -  |
|**401** | Intacct SessionId is not valid |  -  |
|**500** | Server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getMgmtFeeLineItems**
> Array<CapEventLineItem> getMgmtFeeLineItems()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let batchNo: number; //Batch Number to search for matching entries (default to undefined)
let entityId: string; //Entity ID to search for matching entries (default to undefined)
let sessionId: string; //Session identifier used to resolve Sponsor ID in case of it\'s absence (optional) (default to undefined)

const { status, data } = await apiInstance.getMgmtFeeLineItems(
    batchNo,
    entityId,
    sessionId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **batchNo** | [**number**] | Batch Number to search for matching entries | defaults to undefined|
| **entityId** | [**string**] | Entity ID to search for matching entries | defaults to undefined|
| **sessionId** | [**string**] | Session identifier used to resolve Sponsor ID in case of it\&#39;s absence | (optional) defaults to undefined|


### Return type

**Array<CapEventLineItem>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | List of management fee entries |  -  |
|**401** | Intacct SessionId is not valid |  -  |
|**500** | Server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **investorDocumentContent**
> File investorDocumentContent(investorDocumentInput)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    InvestorDocumentInput
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let investorDocumentInput: InvestorDocumentInput; //
let sessionId: string; //Session identifier used to resolve Sponsor ID in case of it\'s absence (optional) (default to undefined)

const { status, data } = await apiInstance.investorDocumentContent(
    investorDocumentInput,
    sessionId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **investorDocumentInput** | **InvestorDocumentInput**|  | |
| **sessionId** | [**string**] | Session identifier used to resolve Sponsor ID in case of it\&#39;s absence | (optional) defaults to undefined|


### Return type

**File**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/octet-stream, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Binary data of generated investor document |  -  |
|**400** | Bad request |  -  |
|**404** | Resource not found |  -  |
|**500** | Server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **process**
> Array<CapEventAggregatedLineItem> process(capEvent)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    CapEvent
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let capEvent: CapEvent; //
let sessionId: string; //Session identifier used to resolve Sponsor ID in case of it\'s absence (optional) (default to undefined)

const { status, data } = await apiInstance.process(
    capEvent,
    sessionId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **capEvent** | **CapEvent**|  | |
| **sessionId** | [**string**] | Session identifier used to resolve Sponsor ID in case of it\&#39;s absence | (optional) defaults to undefined|


### Return type

**Array<CapEventAggregatedLineItem>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | List of capital event line items with investor entries |  -  |
|**400** | Bad request |  -  |
|**401** | Intacct SessionId is not valid |  -  |
|**404** | Resource not found |  -  |
|**500** | Server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **submit**
> CapEvent submit(capEvent)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    CapEvent
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let capEvent: CapEvent; //
let sessionId: string; //Session identifier used to resolve Sponsor ID in case of it\'s absence (optional) (default to undefined)

const { status, data } = await apiInstance.submit(
    capEvent,
    sessionId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **capEvent** | **CapEvent**|  | |
| **sessionId** | [**string**] | Session identifier used to resolve Sponsor ID in case of it\&#39;s absence | (optional) defaults to undefined|


### Return type

**CapEvent**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The CapEvent object stored in the system. |  -  |
|**400** | Bad request |  -  |
|**404** | Resource not found |  -  |
|**500** | Server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **update**
> CapEvent update(capEventDraft)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    CapEventDraft
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //Capital event ID to update (default to undefined)
let capEventDraft: CapEventDraft; //

const { status, data } = await apiInstance.update(
    id,
    capEventDraft
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **capEventDraft** | **CapEventDraft**|  | |
| **id** | [**string**] | Capital event ID to update | defaults to undefined|


### Return type

**CapEvent**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The CapEvent object stored in the system. |  -  |
|**400** | Bad request |  -  |
|**404** | Capital event not found |  -  |
|**500** | Server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

