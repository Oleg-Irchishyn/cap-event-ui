import React, { FC, useEffect } from 'react';

import DropdownMenu from './DropdownMenu';
import ListItem from './ListItem';
import { ListViewContainer, ListViewWrapper, ScrollContainer } from './styles';
import { DropdownItemType } from '@/app/components/Dropdown/Dropdown';

type ListViewProps = {
  testId: string;
  items: DropdownItemType[];
  itemClickHandler: (item: DropdownItemType) => () => void;
  onAdditionalFilterChange?: (item: DropdownItemType) => () => void;
  checkbox: boolean;
  withSearch: boolean;
  searchPlaceholder?: string;
  onSearchChangeHandler: (text: string) => void;
  searchText: string;
  withControls: boolean;
  withDescription: boolean;
  onSelectAllHandler?: () => void;
  onDeselectAllHandler?: () => void;
  onSelectAlternativeClickHandler?: () => void;
  isSelectAllAvailable: boolean;
  isDeselectAllAvailable: boolean;
  isHideAlternativeButton: boolean;
  additionalFilters?: DropdownItemType[];
  excludedTooltipMessage?: string;
};

const ListView: FC<ListViewProps> = ({
  testId = 'ListView',
  items,
  itemClickHandler,
  checkbox,
  withSearch,
  searchPlaceholder,
  onSearchChangeHandler,
  searchText,
  withControls,
  withDescription,
  onSelectAllHandler,
  onDeselectAllHandler,
  onSelectAlternativeClickHandler,
  isSelectAllAvailable,
  isDeselectAllAvailable,
  isHideAlternativeButton,
  additionalFilters,
  onAdditionalFilterChange,
  excludedTooltipMessage,
}) => {
  useEffect(() => () => onSearchChangeHandler(''), []);

  return (
    <ListViewWrapper data-testid={testId}>
      <ListViewContainer>
        <DropdownMenu
          testId={testId}
          withSearch={withSearch}
          searchText={searchText}
          withControls={withControls}
          additionalFilters={additionalFilters}
          searchPlaceholder={searchPlaceholder}
          onSelectAllHandler={onSelectAllHandler}
          isSelectAllAvailable={isSelectAllAvailable}
          onDeselectAllHandler={onDeselectAllHandler}
          onSearchChangeHandler={onSearchChangeHandler}
          isDeselectAllAvailable={isDeselectAllAvailable}
          isHideAlternativeButton={isHideAlternativeButton}
          onAdditionalFilterChange={onAdditionalFilterChange}
          onSelectAlternativeClickHandler={onSelectAlternativeClickHandler}
        />
        <ScrollContainer>
          {items.map((item) => (
            <ListItem
              key={item.label}
              item={item}
              checkbox={checkbox}
              withDescription={withDescription}
              itemClickHandler={itemClickHandler}
              excludedTooltipMessage={excludedTooltipMessage}
            />
          ))}
        </ScrollContainer>
      </ListViewContainer>
    </ListViewWrapper>
  );
};

export default ListView;
