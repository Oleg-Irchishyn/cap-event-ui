import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import AllocationPreviewMetaData from '@/app/new/LineItems/AllocationPreviewMetaData';
import { ALLOCATION_PREVIEW_META_DATA_KEYS } from '@/app/new/LineItems/const';
import { AllocationPreviewMetaDataType } from '@/app/new/LineItems/types';

describe('AllocationPreviewMetaData', () => {
  const fullMeta: AllocationPreviewMetaDataType = {
    callDistributionReason: 'Reason A',
    txnCurrency: 'EUR',
    investment: 'Investment X',
    amount: '(500,000.00)',
    allocationBasis: 'Commitment',
  };

  it('renders all labels from config', () => {
    render(<AllocationPreviewMetaData allocationPreviewMetaData={fullMeta} />);
    Object.values(ALLOCATION_PREVIEW_META_DATA_KEYS).forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('renders provided values', () => {
    render(<AllocationPreviewMetaData allocationPreviewMetaData={fullMeta} />);
    expect(screen.getByText('Reason A')).toBeInTheDocument();
    expect(screen.getByText('EUR')).toBeInTheDocument();
    expect(screen.getByText('Investment X')).toBeInTheDocument();
    expect(screen.getByText('(500,000.00)')).toBeInTheDocument();
    expect(screen.getByText('Commitment')).toBeInTheDocument();
  });

  it('defaults txnCurrency to dash when missing', () => {
    const meta = {
      ...fullMeta,
      txnCurrency: undefined,
    } as unknown as AllocationPreviewMetaDataType;
    render(<AllocationPreviewMetaData allocationPreviewMetaData={meta} />);
    const row = screen.getByText('Txn Currency').parentElement as HTMLElement;
    expect(within(row).getByText('-')).toBeInTheDocument();
  });

  it('defaults missing values to dash', () => {
    const meta = {
      ...fullMeta,
      investment: undefined,
    } as unknown as AllocationPreviewMetaDataType;
    render(<AllocationPreviewMetaData allocationPreviewMetaData={meta} />);
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('renders the same number of items as config keys', () => {
    render(<AllocationPreviewMetaData allocationPreviewMetaData={fullMeta} />);
    const labels = Object.values(ALLOCATION_PREVIEW_META_DATA_KEYS);
    const foundLabels = labels.map((l) => screen.getByText(l));
    expect(foundLabels).toHaveLength(labels.length);
  });
});
