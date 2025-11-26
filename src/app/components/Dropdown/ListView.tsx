import React, { useEffect } from 'react';

import DropdownMenu from './DropdownMenu';
import ListItem from './ListItem';
import {
  ListViewContainer,
  ListViewWrapper,
  LoaderWrapper,
  NoData,
  ScrollContainer,
} from './styles';
import { DropdownItemType } from '@/app/components/Dropdown/Dropdown';
import { Loader } from '@/app/new/LineItems/styles';

type ListViewProps<T> = {
  testId: string;
  items: DropdownItemType<T>[];
  itemClickHandler: (item: DropdownItemType<T>) => () => void;
  onAdditionalFilterChange?: (item: DropdownItemType<T>) => () => void;
  isLoadingItems: boolean;
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
  additionalFilters?: DropdownItemType<T>[];
  excludedTooltipMessage?: string;
  noDataText: string;
};

const ListView = <T,>({
  testId = 'ListView',
  items,
  itemClickHandler,
  isLoadingItems,
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
  noDataText,
}: ListViewProps<T>) => {
  useEffect(() => () => onSearchChangeHandler(''), []);

  const displayDropdownContent = () => {
    if (isLoadingItems)
      return (
        <LoaderWrapper>
          <Loader />
        </LoaderWrapper>
      );

    if (items.length === 0 && noDataText) {
      return <NoData>{noDataText}</NoData>;
    }

    return (
      <>
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
      </>
    );
  };

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
        <ScrollContainer>{displayDropdownContent()}</ScrollContainer>
      </ListViewContainer>
    </ListViewWrapper>
  );
};

export default ListView;
