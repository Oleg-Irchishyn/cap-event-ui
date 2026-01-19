export const AccountFields = {
  capitalCategory: 'capitalCategory',
  callDistributionReason: 'callDistributionReason',
  defaultDescription: 'defaultDescription',
  insideCommitment: 'insideCommitment',
  investment: 'investment',
  prDate: 'prDate',
  prFlag: 'prFlag',
  amount: 'amount',
  allocationBasis: 'allocationBasis',
  drCr: 'drCr',
  actions: 'actions',
};

export const AccountFieldTitles = {
  [AccountFields.capitalCategory]: 'Category',
  [AccountFields.callDistributionReason]: 'Call/Distribution Reason',
  [AccountFields.defaultDescription]: 'Notice Line Description',
  [AccountFields.insideCommitment]: 'Inside CMNT',
  [AccountFields.investment]: 'Investment',
  [AccountFields.prDate]: 'PR Date',
  [AccountFields.prFlag]: 'PR Flag',
  [AccountFields.amount]: 'Amount',
  [AccountFields.allocationBasis]: 'Allocation Basis',
  [AccountFields.drCr]: 'Dr/Cr',
  [AccountFields.actions]: 'Actions',
};

export const AccountFieldIds = {
  [AccountFields.capitalCategory]: '0',
  [AccountFields.callDistributionReason]: '1',
  [AccountFields.defaultDescription]: '2',
  [AccountFields.insideCommitment]: '3',
  [AccountFields.investment]: '4',
  [AccountFields.prDate]: '5',
  [AccountFields.prFlag]: '6',
  [AccountFields.allocationBasis]: '7',
  [AccountFields.amount]: '8',
  [AccountFields.drCr]: '9',
  [AccountFields.actions]: '10',
};

// Other Table Fields
export const OtherAccountFields = {
  accountName: 'accountName',
  defaultDescription: 'defaultDescription',
  insideCommitment: 'insideCommitment',
  investment: 'investment',
  prDate: 'prDate',
  prFlag: 'prFlag',
  actions: 'actions',
};

export const OtherAccountFieldTitles = {
  [OtherAccountFields.accountName]: 'Account',
  [OtherAccountFields.defaultDescription]: 'Notice Line Description',
  [OtherAccountFields.insideCommitment]: 'Inside Commitment',
  [OtherAccountFields.investment]: 'Investment',
  [OtherAccountFields.prDate]: 'PR Date',
  [OtherAccountFields.prFlag]: 'PR Flag',
  [OtherAccountFields.actions]: 'Actions',
};

export const OtherAccountFieldIds = {
  [OtherAccountFields.accountName]: '0',
  [OtherAccountFields.defaultDescription]: '1',
  [OtherAccountFields.insideCommitment]: '2',
  [OtherAccountFields.investment]: '3',
  [OtherAccountFields.prDate]: '4',
  [OtherAccountFields.prFlag]: '5',
  [OtherAccountFields.actions]: '6',
};

export const investmentMandatoryCategories = [
  'Cont - Investments',
  'Cont - ROE',
  'Cont – ROC',
  'Dist – ROC',
  'Dist - Income',
  'Dist - Gain',
  'Dist – Dividend',
];

export const LineItemTypes = {
  group: 'group',
  entity: 'entity',
};

export const USER_PROVIDED_OPTION = 'User-Provided';
export const MANUAL_UPLOAD = 'Manual Upload';

export const YesNoOptions = ['Yes', 'No'];

export const TEXT_INPUT_MAX_LENGTH = 200;

export const NOTICE_LINE_DESCRIPTION_INPUT_PROPS = {
  placeholder: 'Enter Notice Line Description',
  name: 'notice-line-description-cell',
  maxLength: TEXT_INPUT_MAX_LENGTH,
};

export const ALLOCATION_PREVIEW_META_DATA_KEYS = {
  callDistributionReason: 'Call/Distribution Reason',
  txnCurrency: 'Txn Currency',
  investment: 'Investment',
  amount: 'Amount',
  allocationBasis: 'Allocation Basis',
};
