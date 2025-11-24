import { EditableCallbackParams, ICellRendererParams } from 'ag-grid-community';
import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useExternalElementClick } from '@/hooks/useExternalElementClick';
import {
  AddLabel,
  AddNewOptionWrapper,
  AltView,
  DropdownContainer,
  DropdownMenu,
  DropdownWrapper,
  Label,
  Option,
  OptionsWrapper,
  SearchWrapper,
} from '@/app/new/LineItems/styles';
import { ChevronIcon } from '@/app/new/styles';
import { createPortal } from 'react-dom';
import SearchBox from '@/app/components/SearchBox';
import { observer } from 'mobx-react-lite';
import { capEventSettingsStore } from '@/stores';
import Image from 'next/image';
import { prepareDataTestId } from '@/utils/prepareDataTestId';
import { AccountFields } from '../const';

export const DropdownSearchCell = observer((props: ICellRendererParams) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedValue, setSelectedValue] = useState(props.value || '');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const cellKey = `${props.data?.id || 'unknown'}-${props.colDef?.colId || 'unknown'}`;
  const userInputs = capEventSettingsStore.getUserInputs(cellKey);

  const params =
    (typeof props.colDef?.cellEditorParams === 'function'
      ? props.colDef?.cellEditorParams(props)
      : props.colDef?.cellEditorParams) || {};

  const options = params.options;
  const canAddValueFromSearch = params.withAddingFromSearch;
  const withSearch = canAddValueFromSearch || options.length > 3;
  const headerName = props.colDef?.headerName;
  const placeholder = `Select ${headerName}`;
  const searchPlaceholder = params.searchPlaceholder;

  const filteredOptions = [...options, ...userInputs].filter((option) =>
    option?.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const isCellEditable = useMemo(
    () =>
      typeof props.colDef?.editable === 'function'
        ? props.colDef?.editable(props as EditableCallbackParams)
        : props.colDef?.editable,
    [props],
  );

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    props.setValue?.(value);
    setIsOpen(false);
    setSearchValue('');
  };

  // Handle dropdown toggle
  const handleToggle = () => {
    if (!isCellEditable) return;
    if (!isOpen) {
      setSearchValue(''); // Clear search when opening
    }
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: Event) => {
    const target = event.target as Node;
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(target) &&
      triggerRef.current &&
      !triggerRef.current.contains(target)
    ) {
      setIsOpen(false);
      setSearchValue('');
    }
  };
  useExternalElementClick(dropdownRef, handleClickOutside, [isOpen]);

  // Update selected value when props change
  useEffect(() => {
    setSelectedValue(props.value || '');
  }, [props.value]);

  const updateDropdownPosition = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const searchHeight = withSearch ? 60 : 10;
      const dropdownHeight = Math.min(options.length * 38 + searchHeight, 260);
      const indentation = 6;

      // Check if dropdown should appear above or below
      const spaceBelow = viewportHeight - rect.bottom - indentation;
      const spaceAbove = rect.top;

      if (spaceBelow >= dropdownHeight || spaceBelow > spaceAbove) {
        // Position below
        setDropdownPosition({
          top: rect.top + window.scrollY + 32 + indentation,
          left: rect.left + window.scrollX,
        });
      } else {
        // Position above
        setDropdownPosition({
          top: rect.top + window.scrollY - dropdownHeight - indentation,
          left: rect.left + window.scrollX,
        });
      }
    }
  }, [options.length]);

  useEffect(() => {
    document.addEventListener('scroll', updateDropdownPosition);
    document.addEventListener('resize', updateDropdownPosition);

    return () => {
      document.removeEventListener('scroll', updateDropdownPosition);
      document.removeEventListener('resize', updateDropdownPosition);
    };
  }, [isOpen, updateDropdownPosition]);

  useEffect(() => {
    updateDropdownPosition();
  }, [isOpen, updateDropdownPosition]);

  const dropdownWidth = triggerRef?.current?.getBoundingClientRect().width || 'auto';

  const handleAddSearchValue = () => {
    setSearchValue('');
    capEventSettingsStore.addUserInput(cellKey, searchValue);
  };

  const AddNewItem = (
    <AddNewOptionWrapper onClick={handleAddSearchValue}>
      <Image src="/cap-event/icons/plus.svg" alt="plus" width={13} height={13} priority={true} />
      <AddLabel>Add</AddLabel> “{searchValue}”
    </AddNewOptionWrapper>
  );

  if (props.data?.isTotalRow) return null;

  return (
    <DropdownContainer>
      <DropdownWrapper
        data-testid={prepareDataTestId('dropdown-cell', headerName)}
        data-is-open={isOpen}
        data-is-clickable={isCellEditable}
        ref={triggerRef}
        onClick={handleToggle}
      >
        <Label
          data-is-placeholder={!selectedValue}
          data-is-inherited={
            !!props.data?.inheritedFundGroupLineItemId &&
            props.colDef?.field !== AccountFields.allocationBasis &&
            props.colDef?.field !== AccountFields.prFlag
          }
        >
          {selectedValue || placeholder}
        </Label>
        {isCellEditable && <ChevronIcon data-is-open={isOpen} />}
      </DropdownWrapper>

      {isOpen &&
        createPortal(
          <DropdownMenu
            ref={dropdownRef}
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownWidth,
            }}
          >
            {withSearch && (
              <SearchWrapper>
                <SearchBox
                  testId="search"
                  searchText={searchValue}
                  placeholder={searchPlaceholder}
                  searchCallback={setSearchValue}
                  clearCallbackHandler={() => setSearchValue('')}
                />
              </SearchWrapper>
            )}

            <OptionsWrapper>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <Fragment key={option}>
                    {searchValue && canAddValueFromSearch && index === 0 && AddNewItem}
                    <Option
                      data-testid={option}
                      onClick={() => handleSelect(option)}
                      data-is-selected={option === selectedValue}
                    >
                      {option}
                    </Option>
                  </Fragment>
                ))
              ) : searchValue && canAddValueFromSearch ? (
                AddNewItem
              ) : (
                <AltView>No options found</AltView>
              )}
            </OptionsWrapper>
          </DropdownMenu>,
          document.body,
        )}
    </DropdownContainer>
  );
});
