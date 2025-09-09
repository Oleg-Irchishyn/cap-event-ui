import { EditableCallbackParams, ICellRendererParams } from 'ag-grid-community';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useExternalElementClick } from '@/hooks/useExternalElementClick';
import {
  AddNewOption,
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

export const DropdownSearchCell = (props: ICellRendererParams) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedValue, setSelectedValue] = useState(props.value || '');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [userInputs, setUserInputs] = useState<string[]>([]);

  const params =
    (typeof props.colDef?.cellEditorParams === 'function'
      ? props.colDef?.cellEditorParams(props)
      : props.colDef?.cellEditorParams) || {};

  const options = params.options;
  const withSearch = options.length > 3;
  const canAddValueFromSearch = params.withAddingFromSearch;
  const placeholder = `Select ${props.colDef?.headerName}`;

  const filteredOptions = [...options, ...userInputs].filter((option) =>
    option.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const isCellEditable =
    typeof props.colDef?.editable === 'function'
      ? props.colDef?.editable(props as EditableCallbackParams)
      : props.colDef?.editable;

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
      const dropdownHeight = Math.min(options.length * 32 + 60, 260); // +60 for search input
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
    setUserInputs((prev) => [...prev, searchValue]);
  };

  return (
    <DropdownContainer>
      <DropdownWrapper
        data-is-open={isOpen}
        data-is-clickable={isCellEditable}
        ref={triggerRef}
        onClick={handleToggle}
      >
        <Label data-is-placeholder={!selectedValue}>{selectedValue || placeholder}</Label>
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
                  searchCallback={setSearchValue}
                  clearCallbackHandler={() => setSearchValue('')}
                />
              </SearchWrapper>
            )}

            <OptionsWrapper>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <Option
                    key={option}
                    onClick={() => handleSelect(option)}
                    data-is-selected={option === selectedValue}
                  >
                    {option}
                  </Option>
                ))
              ) : (
                <AltView>
                  No options found
                  {searchValue && canAddValueFromSearch && (
                    <AddNewOption onClick={handleAddSearchValue}>Add item</AddNewOption>
                  )}
                </AltView>
              )}
            </OptionsWrapper>
          </DropdownMenu>,
          document.body,
        )}
    </DropdownContainer>
  );
};
