import React from 'react';

import { prepareDataTestId } from '@/utils/prepareDataTestId';

import SearchBox from '../SearchBox';
import {
  AlternativeButton,
  ControlsContainer,
  ControlsLabel,
  ControlsLine,
  DeselectButton,
  SearchContainer,
  SelectAllButton,
  Separator,
} from './styles';
import { DropdownItemType } from '@/app/components/Dropdown/Dropdown';
import ListItem from '@/app/components/Dropdown/ListItem';

type DropdownMenuProps<T> = {
  testId: string;
  controlsLabel?: string;
  withControls: boolean;
  withSearch: boolean;
  searchPlaceholder?: string;
  onSearchChangeHandler: (text: string) => void;
  searchText: string;
  onSelectAllHandler?: () => void;
  onDeselectAllHandler?: () => void;
  isSelectAllAvailable: boolean;
  isDeselectAllAvailable: boolean;
  onSelectAlternativeClickHandler?: () => void;
  isHideAlternativeButton: boolean;
  additionalFilters?: DropdownItemType<T>[];
  onAdditionalFilterChange?: (item: DropdownItemType<T>) => () => void;
};

const DropdownMenu = <T,>({
  testId,
  controlsLabel,
  withControls,
  withSearch = true,
  searchPlaceholder = 'Type for Searching',
  onSearchChangeHandler,
  searchText,
  onSelectAllHandler,
  onDeselectAllHandler,
  isSelectAllAvailable,
  isDeselectAllAvailable,
  onSelectAlternativeClickHandler,
  isHideAlternativeButton,
  additionalFilters,
  onAdditionalFilterChange = () => () => {},
}: DropdownMenuProps<T>) => (
  <>
    {withSearch && (
      <SearchContainer data-testid={prepareDataTestId(testId, 'Search')}>
        <SearchBox
          testId={prepareDataTestId(testId, 'SearchBox')}
          searchText={searchText}
          placeholder={searchPlaceholder}
          searchCallback={onSearchChangeHandler}
          clearCallbackHandler={() => onSearchChangeHandler('')}
        />
      </SearchContainer>
    )}
    {additionalFilters &&
      additionalFilters.map((item) => (
        <ListItem
          key={item.label}
          item={item}
          checkbox
          withBackground={false}
          itemClickHandler={onAdditionalFilterChange}
        />
      ))}
    {withControls && (
      <>
        <ControlsLine>
          <ControlsLabel>{controlsLabel}</ControlsLabel>
          <ControlsContainer data-testid={prepareDataTestId(testId, 'Controls')}>
            <SelectAllButton
              data-testid={prepareDataTestId(testId, 'SelectAllButton')}
              data-is-disabled={!isSelectAllAvailable}
              onClick={isSelectAllAvailable ? onSelectAllHandler : () => {}}
            />
            <DeselectButton
              data-testid={prepareDataTestId(testId, 'DeselectButton')}
              data-is-disabled={!isDeselectAllAvailable}
              onClick={isDeselectAllAvailable ? onDeselectAllHandler : () => {}}
            />
            {!isHideAlternativeButton && (
              <AlternativeButton
                data-testid={prepareDataTestId(testId, 'AlternativeButton')}
                onClick={onSelectAlternativeClickHandler}
              />
            )}
          </ControlsContainer>
        </ControlsLine>
        <Separator />
      </>
    )}
  </>
);

export default DropdownMenu;
