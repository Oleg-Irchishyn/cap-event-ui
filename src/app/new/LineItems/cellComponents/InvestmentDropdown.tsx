import { EditableCallbackParams, ICellRendererParams } from 'ag-grid-community';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useExternalElementClick } from '@/hooks/useExternalElementClick';
import {
  AltView,
  DropdownContainer,
  DropdownMenu,
  DropdownWrapper,
  InvestmentRefreshButton,
  InvestmentLabel,
  InvestmentNewItemButton,
  InvestmentOptionWrapper,
  InvestmentSubLabel,
  InvestmentTitleWrapper,
  Label,
  Loader,
  Option,
  OptionsWrapper,
  RedirectIcon,
  PlusIcon,
  RefreshIcon,
  SearchWrapper,
  LinkButtonWrapper,
} from '@/app/new/LineItems/styles';
import { ChevronIcon } from '@/app/new/styles';
import { createPortal } from 'react-dom';
import SearchBox from '@/app/components/SearchBox';
import { observer } from 'mobx-react-lite';
import { capEventSettingsStore } from '@/stores';
import { generateIntacctLink } from '@/utils/generateIntacctLink';

export const InvestmentDropdown = observer((props: ICellRendererParams) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedValue, setSelectedValue] = useState(props.value || '');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const options = capEventSettingsStore.investments;
  const withSearch = options.length > 3;
  const placeholder = `Select ${props.colDef?.headerName}`;

  const filteredOptions = options.filter(
    (option) =>
      option.title?.toLowerCase().includes(searchValue.toLowerCase()) ||
      option.type?.toLowerCase().includes(searchValue.toLowerCase()) ||
      option.id?.toLowerCase().includes(searchValue.toLowerCase()) ||
      option.name?.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const isCellEditable =
    typeof props.colDef?.editable === 'function'
      ? props.colDef?.editable(props as EditableCallbackParams)
      : props.colDef?.editable;

  const handleSelect = (value?: string) => {
    if (value) {
      setSelectedValue(value);
      props.setValue?.(value);
      setIsOpen(false);
      setSearchValue('');
    }
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

  const refreshInvestments = () => {
    capEventSettingsStore.fetchInvestments();
  };

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

  return (
    <DropdownContainer>
      <DropdownWrapper
        data-is-open={isOpen}
        data-is-clickable={isCellEditable}
        ref={triggerRef}
        onClick={handleToggle}
      >
        <Label data-is-placeholder={!selectedValue} data-is-inherited={!!props.data?.inheritedId}>
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
              maxHeight: '350px',
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

            <InvestmentRefreshButton
              onClick={refreshInvestments}
              data-is-loading={capEventSettingsStore.areInvestmentsLoading}
            >
              {capEventSettingsStore.areInvestmentsLoading ? (
                <Loader />
              ) : (
                <>
                  <RefreshIcon /> Refresh List
                </>
              )}
            </InvestmentRefreshButton>

            <LinkButtonWrapper
              href={generateIntacctLink(capEventSettingsStore.sessionId, 'view')}
              target="_blank"
            >
              <InvestmentNewItemButton>
                <PlusIcon /> Add New Item
              </InvestmentNewItemButton>
            </LinkButtonWrapper>

            <OptionsWrapper>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => {
                  const label = option.title || option.name;
                  return (
                    <Option
                      key={label}
                      onClick={() => handleSelect(label)}
                      data-is-selected={label === selectedValue}
                    >
                      <InvestmentOptionWrapper>
                        <InvestmentTitleWrapper>
                          <InvestmentLabel>{label}</InvestmentLabel>
                          <LinkButtonWrapper
                            href={generateIntacctLink(
                              capEventSettingsStore.sessionId,
                              'edit',
                              option.id,
                            )}
                            target="_blank"
                          >
                            <RedirectIcon />
                          </LinkButtonWrapper>
                        </InvestmentTitleWrapper>
                        <InvestmentSubLabel>Id: {option.id}</InvestmentSubLabel>
                        <InvestmentSubLabel>{option.type}</InvestmentSubLabel>
                      </InvestmentOptionWrapper>
                    </Option>
                  );
                })
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
