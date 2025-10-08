import { useCallback, useRef, useState } from 'react';
import { capEventSettingsStore, entityDatesStore } from '@/stores';
import { ITEM_STATES, GENERAL_SETTINGS_FIELDS } from '@/const/common';

type RevertAction = () => void;

type FieldTitle = (typeof GENERAL_SETTINGS_FIELDS)[keyof typeof GENERAL_SETTINGS_FIELDS];

export const useConfirmationModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState<FieldTitle>(GENERAL_SETTINGS_FIELDS.ENTITIES);
  const resolverRef = useRef<((proceed: boolean) => void) | null>(null);
  const revertActionRef = useRef<RevertAction | null>(null);

  const prevSelectedSetRef = useRef<Set<string> | null>(null);
  const prevStateByKeyRef = useRef<Map<string, string> | null>(null);

  const isEntityCELIsEnabled = !capEventSettingsStore.isGeneralSettingsEmpty(
    entityDatesStore.noticeDate,
    entityDatesStore.hasDifferentDates,
  );

  const openModal = useCallback((fieldTitle: FieldTitle, revertAction: RevertAction | null) => {
    setTitle(fieldTitle);
    revertActionRef.current = revertAction;
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (revertActionRef.current) {
      revertActionRef.current();
    }
    if (resolverRef.current) {
      resolverRef.current(false);
    }
    resolverRef.current = null;
    revertActionRef.current = null;
  }, []);

  const handleProceed = useCallback(() => {
    setIsOpen(false);
    if (resolverRef.current) {
      resolverRef.current(true);
    }
    resolverRef.current = null;
    revertActionRef.current = null;
  }, []);

  const confirmFieldChange = useCallback(
    (fieldTitle: FieldTitle): Promise<boolean> => {
      if (!isEntityCELIsEnabled) return Promise.resolve(true);
      return new Promise<boolean>((resolve) => {
        resolverRef.current = resolve;
        openModal(fieldTitle, null);
      });
    },
    [isEntityCELIsEnabled, openModal],
  );

  const applyEntitiesSnapshot = useCallback((previousStateByKey: Map<string, string> | null) => {
    if (!previousStateByKey) return;
    const reverted = capEventSettingsStore.fundEntities.map((entity) => {
      const key = entity.id ?? entity.label;
      const prevState = previousStateByKey.get(key);
      return prevState ? { ...entity, state: prevState } : entity;
    });
    capEventSettingsStore.setFundEntities(reverted);
  }, []);

  const onEntitiesDropdownOpenChange = useCallback(
    (isOpenDropdown: boolean): boolean => {
      const snapshotSelections = () => {
        const selectedKeys = new Set<string>();
        const stateByKey = new Map<string, string>();
        for (const entity of capEventSettingsStore.fundEntities) {
          const key = entity.id ?? entity.label;
          stateByKey.set(key, entity.state);
          if (entity.state === ITEM_STATES.SELECTED) selectedKeys.add(key);
        }
        return { selectedKeys, stateByKey };
      };

      const hasSelectionChanged = (prevSelected: Set<string>) => {
        const currentSelectedKeys = new Set<string>();
        for (const entity of capEventSettingsStore.fundEntities) {
          if (entity.state !== ITEM_STATES.SELECTED) continue;
          const key = entity.id ?? entity.label;
          if (!prevSelected.has(key)) return true;
          currentSelectedKeys.add(key);
        }

        return currentSelectedKeys.size !== prevSelected.size;
      };

      if (isOpenDropdown) {
        const { selectedKeys, stateByKey } = snapshotSelections();
        prevSelectedSetRef.current = selectedKeys;
        prevStateByKeyRef.current = stateByKey;
        return true;
      }

      const prevSelected = prevSelectedSetRef.current;
      if (!prevSelected) return true;

      const hasChanged = hasSelectionChanged(prevSelected);
      if (hasChanged && isEntityCELIsEnabled) {
        const previousStateByKey = prevStateByKeyRef.current;
        const revert = () => applyEntitiesSnapshot(previousStateByKey);
        openModal(GENERAL_SETTINGS_FIELDS.ENTITIES, revert);
        return false;
      }

      return true;
    },
    [isEntityCELIsEnabled, openModal, applyEntitiesSnapshot],
  );

  return {
    modal: {
      isOpen,
      title,
      handleClose,
      handleProceed,
    },
    isConfirmationModalEnabled: isEntityCELIsEnabled,
    confirmFieldChange,
    onEntitiesDropdownOpenChange,
  };
};

export default useConfirmationModal;
