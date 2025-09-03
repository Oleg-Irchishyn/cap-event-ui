import React, { Dispatch, FC, SetStateAction, useRef, useState } from 'react';

import { useExternalElementClick } from '@/hooks/useExternalElementClick';

import DropdownInputField from './DropdownInputField';
import ListView from './ListView';
import { DropdownWrapper, ErrorLabel, FieldLabel, LabelContainer } from './styles';
import Image from 'next/image';

export type DropdownItemType = {
  label: string;
  displayName?: string;
  description?: string;
  state: string;
  id?: string;
  isDisabled?: boolean;
};

interface Props {
  items: DropdownItemType[];
  selectedItems: DropdownItemType[];
  selectHandler: (item: DropdownItemType) => void;
  placeholder: string;
  isReadOnly?: boolean;
  isDisabled?: boolean;
  isMultiSelect?: boolean;
  checkbox?: boolean;
  label: string;
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
  deselectItem?: (item: DropdownItemType) => () => void;
  onAdditionalFilterChange?: (item: DropdownItemType) => () => void;
  testId: string;
  isHideAlternativeButton?: boolean;
  onOpenChange?: (isOpen: boolean) => boolean;
  errorMessage?: string;
  additionalFilters?: DropdownItemType[];
  excludedTooltipMessage?: string;
}

const Dropdown: FC<Props> = ({
  items,
  selectedItems,
  selectHandler = () => {},
  placeholder,
  isReadOnly = false,
  isDisabled = false,
  isMultiSelect = false,
  checkbox = false,
  label = '',
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
}) => {
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

  const itemClickHandler = (item: DropdownItemType) => () => {
    selectHandler(item);

    if (!isMultiSelect) {
      closeDropdown();
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <LabelContainer>
        <FieldLabel>{label}</FieldLabel>
        {errorMessage && (
          <ErrorLabel>
            <Image src="icons/error-outline.svg" alt="error" width={15} height={15} />
            {errorMessage}
          </ErrorLabel>
        )}
      </LabelContainer>
      <DropdownWrapper ref={dropdownRef}>
        <DropdownInputField
          testId={testId}
          isOpen={isOpen}
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
