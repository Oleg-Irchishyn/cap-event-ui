import { FC } from 'react';

import TruncatedValueTooltip from '@/app/components/TruncatedValueTooltip';

import { AllocationPreviewMetaDataProps, AllocationPreviewMetaDataType } from './types';
import { ALLOCATION_PREVIEW_META_DATA_KEYS } from './const';
import {
  AllocationPreviewMetaDataWrapper,
  AllocationPreviewMetaDataItem,
  AllocationPreviewMetaDataItemLabel,
  AllocationPreviewMetaDataItemValue,
} from './styles';

const AllocationPreviewMetaData: FC<AllocationPreviewMetaDataProps> = ({
  allocationPreviewMetaData,
}) => {
  const metaDataKeys = Object.keys(
    ALLOCATION_PREVIEW_META_DATA_KEYS,
  ) as (keyof typeof ALLOCATION_PREVIEW_META_DATA_KEYS)[];

  return (
    <AllocationPreviewMetaDataWrapper>
      {metaDataKeys.map((key) => {
        const value = allocationPreviewMetaData?.[key as keyof AllocationPreviewMetaDataType];
        const displayValue =
          key === ALLOCATION_PREVIEW_META_DATA_KEYS.txnCurrency
            ? ((value as string) ?? 'USD')
            : ((value as string) ?? '-');
        return (
          <AllocationPreviewMetaDataItem key={key}>
            <TruncatedValueTooltip
              text={ALLOCATION_PREVIEW_META_DATA_KEYS[key]}
              Wrapper={AllocationPreviewMetaDataItemLabel}
            />
            <TruncatedValueTooltip
              text={displayValue}
              Wrapper={AllocationPreviewMetaDataItemValue}
            />
          </AllocationPreviewMetaDataItem>
        );
      })}
    </AllocationPreviewMetaDataWrapper>
  );
};

export default AllocationPreviewMetaData;
