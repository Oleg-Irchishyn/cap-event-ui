import { renderHook, act } from '@testing-library/react';

jest.mock('@/const/common', () => ({
  ITEM_STATES: {
    SELECTED: 'S',
    OPTIONAL: 'O',
    EXCLUDED: 'X',
    MANDATORY: 'M',
    ALTERNATIVE: 'A',
    EXCLUDED_SELECTED: 'XS',
  },
  GENERAL_SETTINGS_FIELDS: {
    EVENT_TYPE: 'Event Type',
    TEMPLATE: 'Template',
    FUND_GROUP: 'Fund Group',
    ENTITIES: 'Entity(ies)',
    NOTICE_DATE: 'Notice Date',
  },
}));

jest.mock('@/stores', () => {
  const capEventSettingsStore = {
    isGeneralSettingsEmpty: jest.fn(() => true),
    fundEntities: [] as Array<{ id?: string; label?: string; state: string }>,
    setFundEntities: jest.fn(),
    isNoticeDateValid: true,
  };
  const entityDatesStore = {
    noticeDate: null as unknown as Date | null,
    hasDifferentDates: false,
  };
  return { capEventSettingsStore, entityDatesStore };
});

import { useConfirmationModal } from '@/hooks/useConfirmationModal';
import { GENERAL_SETTINGS_FIELDS, ITEM_STATES } from '@/const/common';
import { capEventSettingsStore } from '@/stores';

const setConfirmationEnabled = (enabled: boolean) => {
  (capEventSettingsStore.isGeneralSettingsEmpty as unknown as jest.Mock).mockReturnValue(!enabled);
};

beforeEach(() => {
  jest.clearAllMocks();
  capEventSettingsStore.fundEntities = [];
  setConfirmationEnabled(false);
});

describe('useConfirmationModal', () => {
  test('confirmFieldChange resolves immediately when disabled', async () => {
    setConfirmationEnabled(false);
    const { result } = renderHook(() => useConfirmationModal());

    const promise = result.current.confirmFieldChange(GENERAL_SETTINGS_FIELDS.ENTITIES);
    await expect(promise).resolves.toBe(true);
    expect(result.current.modal.isOpen).toBe(false);
    expect(result.current.isConfirmationModalEnabled).toBe(false);
  });

  test('confirmFieldChange opens modal and proceeds resolving true', async () => {
    setConfirmationEnabled(true);
    const { result } = renderHook(() => useConfirmationModal());

    let promise!: Promise<boolean>;
    act(() => {
      promise = result.current.confirmFieldChange(GENERAL_SETTINGS_FIELDS.NOTICE_DATE);
    });

    expect(result.current.modal.isOpen).toBe(true);
    expect(result.current.modal.title).toBe(GENERAL_SETTINGS_FIELDS.NOTICE_DATE);

    await act(async () => {
      result.current.modal.handleProceed();
      await expect(promise).resolves.toBe(true);
    });

    expect(result.current.modal.isOpen).toBe(false);
    expect(result.current.isConfirmationModalEnabled).toBe(true);
  });

  test('closing entities dropdown with selection change opens modal and handleClose reverts', () => {
    setConfirmationEnabled(true);
    capEventSettingsStore.fundEntities = [
      { label: 'A', state: ITEM_STATES.SELECTED },
      { label: 'B', state: ITEM_STATES.OPTIONAL },
    ];
    const { result } = renderHook(() => useConfirmationModal());

    act(() => {
      result.current.onEntitiesDropdownOpenChange(true);
    });

    capEventSettingsStore.fundEntities = [
      { label: 'A', state: ITEM_STATES.SELECTED },
      { label: 'B', state: ITEM_STATES.SELECTED },
    ];

    act(() => {
      result.current.onEntitiesDropdownOpenChange(false);
    });
    expect(result.current.modal.isOpen).toBe(true);

    act(() => {
      result.current.modal.handleClose();
    });

    expect(capEventSettingsStore.setFundEntities).toHaveBeenCalledTimes(1);
    expect(capEventSettingsStore.setFundEntities).toHaveBeenCalledWith([
      { label: 'A', state: ITEM_STATES.SELECTED },
      { label: 'B', state: ITEM_STATES.OPTIONAL },
    ]);
    expect(result.current.modal.isOpen).toBe(false);
  });

  test('closing entities dropdown without change does not open modal', () => {
    setConfirmationEnabled(true);
    capEventSettingsStore.fundEntities = [
      { label: 'A', state: ITEM_STATES.SELECTED },
      { label: 'B', state: ITEM_STATES.OPTIONAL },
    ];
    const { result } = renderHook(() => useConfirmationModal());

    act(() => {
      result.current.onEntitiesDropdownOpenChange(true);
    });

    act(() => {
      result.current.onEntitiesDropdownOpenChange(false);
    });

    expect(result.current.modal.isOpen).toBe(false);
    expect(capEventSettingsStore.setFundEntities).not.toHaveBeenCalled();
  });

  test('selection change does not open modal when disabled', () => {
    setConfirmationEnabled(false);
    capEventSettingsStore.fundEntities = [
      { label: 'A', state: ITEM_STATES.OPTIONAL },
      { label: 'B', state: ITEM_STATES.OPTIONAL },
    ];
    const { result } = renderHook(() => useConfirmationModal());

    act(() => {
      result.current.onEntitiesDropdownOpenChange(true);
    });

    capEventSettingsStore.fundEntities = [
      { label: 'A', state: ITEM_STATES.SELECTED },
      { label: 'B', state: ITEM_STATES.OPTIONAL },
    ];
    act(() => {
      result.current.onEntitiesDropdownOpenChange(false);
    });

    expect(result.current.isConfirmationModalEnabled).toBe(false);
    expect(result.current.modal.isOpen).toBe(false);
    expect(capEventSettingsStore.setFundEntities).not.toHaveBeenCalled();
  });
});
