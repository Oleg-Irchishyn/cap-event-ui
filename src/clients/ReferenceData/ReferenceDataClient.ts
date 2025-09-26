/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { AxiosHttpRequest } from './core/AxiosHttpRequest';
import { AccountsService } from './services/AccountsService';
import { EntitiesService } from './services/EntitiesService';
import { FundGroupsService } from './services/FundGroupsService';
import { InvestmentsService } from './services/InvestmentsService';
import { SessionService } from './services/SessionService';
type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;
export class ReferenceDataClient {
    public readonly accounts: AccountsService;
    public readonly entities: EntitiesService;
    public readonly fundGroups: FundGroupsService;
    public readonly investments: InvestmentsService;
    public readonly session: SessionService;
    public readonly request: BaseHttpRequest;
    constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = AxiosHttpRequest) {
        this.request = new HttpRequest({
            BASE: config?.BASE ?? '/api/v1/reference-data',
            VERSION: config?.VERSION ?? '1',
            WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
            CREDENTIALS: config?.CREDENTIALS ?? 'include',
            TOKEN: config?.TOKEN,
            USERNAME: config?.USERNAME,
            PASSWORD: config?.PASSWORD,
            HEADERS: config?.HEADERS,
            ENCODE_PATH: config?.ENCODE_PATH,
        });
        this.accounts = new AccountsService(this.request);
        this.entities = new EntitiesService(this.request);
        this.fundGroups = new FundGroupsService(this.request);
        this.investments = new InvestmentsService(this.request);
        this.session = new SessionService(this.request);
    }
}

