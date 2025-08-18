import React, { FC } from 'react';
import { prepareDataTestId } from '@/utils/prepareDataTestId';
import { ClearIcon, SearchIconContainer, SearchInput, SearchWrapper } from './styles';
import Image from 'next/image';

type SearchBoxProps = {
  testId: string;
  width?: number;
  placeholder?: string;
  searchText: string;
  searchCallback: (text: string) => void;
  clearCallbackHandler: () => void;
};

const SearchBox: FC<SearchBoxProps> = ({
  testId,
  width,
  placeholder,
  searchText = '',
  searchCallback = () => {},
  clearCallbackHandler = () => {},
}) => {
  const searchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    searchCallback(event.target.value.toLowerCase());
  };

  return (
    <SearchWrapper data-testid={prepareDataTestId(testId, 'SearchBox')} width={width}>
      <SearchIconContainer>
        <Image src="icons/search.svg" width={15} height={15} alt="search" />
      </SearchIconContainer>
      <SearchInput
        data-testid={testId || 'search-block-input'}
        type="text"
        value={searchText}
        onChange={searchHandler}
        placeholder={placeholder || 'Search'}
      />
      {searchText && <ClearIcon onClick={clearCallbackHandler} />}
    </SearchWrapper>
  );
};

export default SearchBox;
