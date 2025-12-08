import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';

import GeneralSettings from '@/app/new/GeneralSettings';
import { CapEventPackageApi, ReferenceDataApi } from '@/api';
import { capEventSettingsStore, entityDatesStore } from '@/stores';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ComponentProps<'img'>) => React.createElement('img', { ...props }),
}));

jest.mock('@/app/components/BackgroundContainer', () => {
  const BackgroundContainer = ({
    children,
    testId,
  }: {
    children: React.ReactNode;
    testId?: string;
  }) => <div data-testid={testId || 'background'}>{children}</div>;
  return BackgroundContainer;
});

jest.mock('@/app/components/ConfirmationModal', () => () => null);

jest.mock('@/app/components/Dropdown', () => {
  type DropdownItem = { label: string; id?: string; state?: string };
  type Props = {
    testId: string;
    selectHandler: (item: DropdownItem) => void;
    onOpenChange?: (isOpen: boolean) => boolean;
  };
  const Dropdown = (props: Props) => (
    <div data-testid={props.testId}>
      <button
        data-testid={`${props.testId}-select`}
        onClick={() => props.selectHandler({ label: 'Capital Call', id: 'EVT1', state: 'S' })}
      >
        select
      </button>
      {props.onOpenChange && (
        <>
          <button data-testid={`${props.testId}-open`} onClick={() => props.onOpenChange?.(true)}>
            open
          </button>
          <button data-testid={`${props.testId}-close`} onClick={() => props.onOpenChange?.(false)}>
            close
          </button>
        </>
      )}
    </div>
  );
  return Dropdown;
});

jest.mock('@/app/components/DatePicker', () => {
  type Props = { onChange: (value: unknown) => void };
  const DatePicker = (props: Props) => (
    <div>
      <button data-testid="date-change" onClick={() => props.onChange(new Date('2025-01-02'))}>
        change-date
      </button>
      <button data-testid="date-clear" onClick={() => props.onChange(null)}>
        clear-date
      </button>
    </div>
  );
  return DatePicker;
});

jest.mock('@/api', () => {
  const CapEventPackageApi = { default: { getCapEventTypes: jest.fn() } };
  return {
    CapEventPackageApi,
    ReferenceDataApi: {
      fundGroups: { searchFundGroupsBySponsor: jest.fn() },
      entities: { getEntitiesByFundGroup: jest.fn() },
      sponsors: { getSponsors: jest.fn() },
    },
    TemplateLibraryApi: {
      template: { getStandardTemplatesMetadata: jest.fn() },
    },
  };
});

jest.mock('@/stores', () => {
  type Item = { label: string; id?: string; state?: string };
  const capEventSettingsStore = {
    eventTypes: [] as Item[],
    sponsors: [] as Item[],
    fundGroups: [] as Item[],
    fundEntities: [] as Item[],
    setEventTypes: jest.fn(),
    setSponsors: jest.fn(),
    setFundGroups: jest.fn(),
    setFundEntities: jest.fn(),
    setEntitiesDropdownOpen: jest.fn(),
    fetchInvestments: jest.fn(),
    investments: [],
  };
  const entityDatesStore = {
    noticeDate: null as Date | null,
    hasDifferentDates: false,
    clearGeneralNoticeDate: jest.fn(),
    setNoticeDate: jest.fn(),
    setSelectedEventType: jest.fn(),
    recalcEntityDueDatesForSelectedFunds: jest.fn(),
    updateEntityDatesFromGeneral: jest.fn(),
    resetAllDates: jest.fn(),
  };
  return { capEventSettingsStore, entityDatesStore };
});

const confirmationHook = {
  modal: { isOpen: false, title: '', handleClose: jest.fn(), handleProceed: jest.fn() },
  isConfirmationModalEnabled: false,
  confirmFieldChange: jest.fn().mockResolvedValue(true),
  onEntitiesDropdownOpenChange: jest.fn(),
};

jest.mock('@/hooks/useConfirmationModal', () => ({
  __esModule: true,
  default: () => confirmationHook,
}));

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('GeneralSettings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    confirmationHook.isConfirmationModalEnabled = false;
    confirmationHook.confirmFieldChange = jest.fn().mockResolvedValue(true);

    (CapEventPackageApi.default.getCapEventTypes as jest.Mock).mockResolvedValue([
      { name: 'Capital Call', abbreviation: 'CC' },
    ]);
    (ReferenceDataApi.fundGroups.searchFundGroupsBySponsor as jest.Mock).mockResolvedValue([
      { id: 'FG1', name: 'Group 1' },
    ]);
    (ReferenceDataApi.entities.getEntitiesByFundGroup as jest.Mock).mockResolvedValue([]);
  });

  it('fetches event types and sponsors on mount', async () => {
    renderWithTheme(<GeneralSettings />);
    await waitFor(() => expect(CapEventPackageApi.default.getCapEventTypes).toHaveBeenCalled());
    await waitFor(() => expect(ReferenceDataApi.sponsors.getSponsors).toHaveBeenCalled());
    expect(capEventSettingsStore.setEventTypes).toHaveBeenCalled();
    expect(capEventSettingsStore.setSponsors).toHaveBeenCalled();
  });

  it('selecting event type confirms when enabled', async () => {
    confirmationHook.isConfirmationModalEnabled = true;
    (confirmationHook.confirmFieldChange as jest.Mock).mockResolvedValue(true);

    renderWithTheme(<GeneralSettings />);

    await waitFor(() => {
      expect(capEventSettingsStore.setEventTypes).toHaveBeenCalled();
    });
  });

  it('changing notice date when confirmation disabled updates entity dates', async () => {
    confirmationHook.isConfirmationModalEnabled = false;

    renderWithTheme(<GeneralSettings />);

    fireEvent.click(screen.getByTestId('date-change'));

    expect(entityDatesStore.setNoticeDate).toHaveBeenCalled();
    expect(entityDatesStore.updateEntityDatesFromGeneral).toHaveBeenCalled();
  });

  it('clearing notice date: when confirmation disabled, clears immediately', async () => {
    confirmationHook.isConfirmationModalEnabled = false;

    renderWithTheme(<GeneralSettings />);

    fireEvent.click(screen.getByTestId('date-clear'));

    expect(confirmationHook.confirmFieldChange).not.toHaveBeenCalled();
    expect(entityDatesStore.clearGeneralNoticeDate).toHaveBeenCalledTimes(1);
  });

  it('clearing notice date: when confirmation enabled, respects user choice', async () => {
    confirmationHook.isConfirmationModalEnabled = true;
    renderWithTheme(<GeneralSettings />);

    (confirmationHook.confirmFieldChange as jest.Mock).mockResolvedValueOnce(false);
    fireEvent.click(screen.getByTestId('date-clear'));
    await waitFor(() => expect(confirmationHook.confirmFieldChange).toHaveBeenCalled());
    expect(entityDatesStore.clearGeneralNoticeDate).not.toHaveBeenCalled();

    (confirmationHook.confirmFieldChange as jest.Mock).mockResolvedValueOnce(true);
    fireEvent.click(screen.getByTestId('date-clear'));
    await waitFor(() => expect(entityDatesStore.clearGeneralNoticeDate).toHaveBeenCalledTimes(1));
  });
});
