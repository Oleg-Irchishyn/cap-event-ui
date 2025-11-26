import React, { Dispatch, SetStateAction, useRef, useState } from 'react';

import { useExternalElementClick } from '@/hooks/useExternalElementClick';

import DropdownInputField from './DropdownInputField';
import ListView from './ListView';
import { AdditionalLabel, DropdownWrapper, ErrorLabel, FieldLabel, LabelContainer } from './styles';
import Image from 'next/image';
import { ITEM_STATES } from '@/const/common';

export type DropdownItemType<T = object> = {
  label: string;
  displayName?: string;
  description?: string;
  additionalDescription?: string;
  state: string;
  id?: string;
  isDisabled?: boolean;
} & T;

interface Props<T> {
  items: DropdownItemType<T>[];
  selectedItems: DropdownItemType<T>[];
  selectHandler: (item: DropdownItemType<T>) => void;
  isLoadingItems?: boolean;
  placeholder: string;
  isReadOnly?: boolean;
  isDisabled?: boolean;
  isMultiSelect?: boolean;
  checkbox?: boolean;
  label: string;
  additionalLabel?: string;
  withSearch?: boolean;
  withControls?: boolean;
  onSearchChangeHandler?: Dispatch<SetStateAction<string>>;
  searchText?: string;
  withDescription?: boolean;
  onSelectAllHandler?: () => void;
  onDeselectAllHandler?: () => void;
  onSelectAlternativeClickHandler?: () => void;
  isSelectAllAvailable?: boolean;
  isDeselectAllAvailable?: boolean;
  deselectItem?: (item: DropdownItemType<T>) => () => void;
  onAdditionalFilterChange?: (item: DropdownItemType<T>) => () => void;
  testId: string;
  isHideAlternativeButton?: boolean;
  onOpenChange?: (isOpen: boolean) => boolean;
  errorMessage?: string;
  additionalFilters?: DropdownItemType<T>[];
  excludedTooltipMessage?: string;
  isCompact?: boolean;
  noDataText?: string;
}

const Dropdown = <T,>({
  items,
  selectedItems,
  selectHandler = () => {},
  isLoadingItems = false,
  placeholder,
  isReadOnly = false,
  isDisabled = false,
  isMultiSelect = false,
  checkbox = false,
  label = '',
  additionalLabel = '',
  withSearch = false,
  withControls = false,
  onSearchChangeHandler = () => {},
  searchText = '',
  withDescription = false,
  onSelectAllHandler,
  onDeselectAllHandler,
  onSelectAlternativeClickHandler,
  isSelectAllAvailable = true,
  isDeselectAllAvailable = true,
  deselectItem,
  testId,
  isHideAlternativeButton = false,
  onOpenChange = () => true,
  errorMessage = '',
  additionalFilters,
  onAdditionalFilterChange,
  excludedTooltipMessage,
  isCompact = false,
  noDataText = '',
}: Props<T>) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const closeDropdown = () => {
    const canCloseDropdown = onOpenChange(false);
    if (canCloseDropdown) {
      setIsOpen(false);
    }
    return canCloseDropdown;
  };

  const openDropdown = () => {
    setIsOpen(true);
    onOpenChange(true);
  };

  useExternalElementClick(dropdownRef, () => {
    if (isOpen) {
      closeDropdown();
    }
  }, [isOpen]);

  const openDropdownHandler = () => {
    if (isDisabled || isReadOnly) return;
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  };

  const itemClickHandler = (item: DropdownItemType<T>) => () => {
    if (item.state === ITEM_STATES.EXCLUDED) return;
    selectHandler(item);

    if (!isMultiSelect) {
      closeDropdown();
    }
  };

  return (
    <div style={{ width: isCompact ? 'auto' : '100%' }}>
      <LabelContainer $isCompact={isCompact}>
        <FieldLabel $isCompact={isCompact}>
          {label}
          <AdditionalLabel>{additionalLabel}</AdditionalLabel>
        </FieldLabel>
        {errorMessage && (
          <ErrorLabel>
            <Image src="/cap-event/icons/error-outline.svg" alt="error" width={15} height={15} />
            {errorMessage}
          </ErrorLabel>
        )}
      </LabelContainer>
      <DropdownWrapper ref={dropdownRef} $isCompact={isCompact}>
        <DropdownInputField
          testId={testId}
          isOpen={isOpen}
          isCompact={isCompact}
          isReadOnly={isReadOnly}
          isDisabled={isDisabled}
          placeholder={placeholder}
          selectedItems={selectedItems}
          isMultiSelect={isMultiSelect}
          isError={Boolean(errorMessage)}
          openDropdownHandler={openDropdownHandler}
          onDeselectItemClickHandler={deselectItem}
        />

        {isOpen && (
          <ListView
            testId={testId}
            items={items}
            checkbox={checkbox}
            withSearch={withSearch}
            searchText={searchText}
            noDataText={noDataText}
            isLoadingItems={isLoadingItems}
            withControls={withControls}
            withDescription={withDescription}
            itemClickHandler={itemClickHandler}
            additionalFilters={additionalFilters}
            onSelectAllHandler={onSelectAllHandler}
            onDeselectAllHandler={onDeselectAllHandler}
            isSelectAllAvailable={isSelectAllAvailable}
            onSearchChangeHandler={onSearchChangeHandler}
            excludedTooltipMessage={excludedTooltipMessage}
            isDeselectAllAvailable={isDeselectAllAvailable}
            isHideAlternativeButton={isHideAlternativeButton}
            onAdditionalFilterChange={onAdditionalFilterChange}
            onSelectAlternativeClickHandler={onSelectAlternativeClickHandler}
          />
        )}
      </DropdownWrapper>
    </div>
  );
};

export default Dropdown;
