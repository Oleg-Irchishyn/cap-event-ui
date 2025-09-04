import React, { useEffect, useRef, useState } from 'react';

import { prepareDataTestId } from '@/utils/prepareDataTestId';

import {
  ChevronButton,
  HiddenOptions,
  HiddenOptionsCounter,
  InputFiledWrapper,
  MultiSelectInputWrapper,
  Placeholder,
  RemoveButton,
  SelectedInputLabel,
  SelectedInputWrapper,
  SingleSelectInput,
  SingleSelectInputWrapper,
} from './styles';
import { DropdownItemType } from '@/app/components/Dropdown/Dropdown';

export const VIEWPORT_GAP = 4;

export const prepareArrayRefs = (): [ref: HTMLDivElement[], (element: HTMLDivElement) => void] => {
  const refs: HTMLDivElement[] = [];
  return [refs, (element) => element && refs.push(element)];
};

interface Props<T> {
  isOpen: boolean;
  isError: boolean;
  isReadOnly: boolean;
  isDisabled: boolean;
  placeholder: string;
  selectedItems: DropdownItemType<T>[];
  isMultiSelect: boolean;
  onDeselectItemClickHandler?: (item: DropdownItemType<T>, isDisabled?: boolean) => () => void;
  openDropdownHandler: () => void;
  testId: string;
}
const DropdownInputField = <T,>({
  isOpen,
  isError,
  isReadOnly,
  isDisabled,
  placeholder,
  selectedItems = [],
  isMultiSelect,
  onDeselectItemClickHandler = () => () => {},
  openDropdownHandler,
  testId = 'dropdown-input',
}: Props<T>) => {
  const multiselectRef = useRef<HTMLDivElement>(null);
  const truncatedLabelRef = useRef<(HTMLDivElement | null)[]>([]);
  const hiddenOptionsCountRef = useRef<HTMLDivElement>(null);

  const [selectedOptionsRefs, selectedOptionsRef] = prepareArrayRefs();

  const visibleLabel = selectedItems[0]?.label;

  const [hiddenOptionsCounter, setHiddenOptionsCounter] = useState(0);

  const handleHiddenOptions = () => {
    let counter = 0;

    const remainItemsCount = selectedOptionsRefs.slice(9).length;
    const slicedSelectedOptionsRefs = selectedOptionsRefs.slice(0, 9);

    slicedSelectedOptionsRefs.forEach((e) => {
      e.style.display = 'flex';
    });

    // eslint-disable-next-line no-unsafe-optional-chaining
    const countWidth = (hiddenOptionsCountRef?.current?.offsetWidth || 0) + VIEWPORT_GAP;
    const elementsWidth = slicedSelectedOptionsRefs.reduce(
      (acc, { offsetWidth = 0 }) => acc + offsetWidth + VIEWPORT_GAP,
      0,
    );

    const { hiddenCount } = slicedSelectedOptionsRefs.reduceRight(
      (acc, current) => {
        if (!current) return acc;

        const viewportWidth = multiselectRef?.current?.offsetWidth || 0;
        const allowedWidth =
          elementsWidth >= viewportWidth ? viewportWidth - countWidth : viewportWidth;

        if (acc.elementsWidth >= allowedWidth) {
          acc.elementsWidth -= current.offsetWidth + VIEWPORT_GAP;
          acc.hiddenCount += 1;
          current.style.display = 'none';
        }

        return acc;
      },
      { elementsWidth, hiddenCount: 0 },
    );

    if (hiddenOptionsCountRef.current) {
      const offsetWidth = multiselectRef?.current?.offsetWidth || 0;
      hiddenOptionsCountRef.current.style.visibility =
        elementsWidth >= offsetWidth ? 'visible' : 'hidden';
    }

    counter = hiddenCount + remainItemsCount;

    if (hiddenOptionsCounter !== counter) setHiddenOptionsCounter(counter);
  };

  useEffect(() => {
    handleHiddenOptions();
  }, [selectedItems, hiddenOptionsCounter]);

  const handleInputClick = (e: React.MouseEvent<HTMLElement>) => {
    if (!isReadOnly && !(e.target as HTMLElement).className.includes('RemoveButton'))
      openDropdownHandler();
  };

  return (
    <InputFiledWrapper
      data-is-open={isOpen}
      data-is-error={isError}
      data-is-disabled={isDisabled}
      data-is-read-only={isReadOnly}
      onClick={handleInputClick}
    >
      {selectedItems.length === 0 && <Placeholder>{placeholder || 'Placeholder'}</Placeholder>}

      {selectedItems.length > 0 && !isMultiSelect && (
        <SingleSelectInputWrapper>
          <SingleSelectInput>{visibleLabel}</SingleSelectInput>
        </SingleSelectInputWrapper>
      )}

      {selectedItems.length > 0 && isMultiSelect && (
        <MultiSelectInputWrapper
          data-testid={prepareDataTestId(testId, 'InputField', 'MultiSelectInput')}
          ref={multiselectRef}
        >
          {selectedItems.map((item, index) => (
            <SelectedInputWrapper
              data-is-read-only={isReadOnly}
              data-testid={prepareDataTestId(testId, 'SelectedInput', item.label)}
              key={`selected-input-${item.id}-${item.label}-${item.state}`}
              ref={selectedOptionsRef}
            >
              <SelectedInputLabel
                ref={(element) => {
                  truncatedLabelRef.current[index] = element;
                }}
                data-testid={prepareDataTestId(testId, 'SelectedInputLabel', item.label)}
              >
                {item.displayName || item.label}
              </SelectedInputLabel>
              <RemoveButton
                data-testid={prepareDataTestId(testId, 'RemoveButton', item.label)}
                data-is-disabled={item.isDisabled}
                className="RemoveButton"
                onClick={onDeselectItemClickHandler(item, item.isDisabled)}
              />
            </SelectedInputWrapper>
          ))}
          <HiddenOptions
            data-testid={prepareDataTestId(testId, 'InputField', 'HiddenOptions')}
            ref={hiddenOptionsCountRef}
          >
            <HiddenOptionsCounter
              data-testid={prepareDataTestId(testId, 'HiddenOptions', 'HiddenOptionsCounter')}
            >
              {`+${hiddenOptionsCounter}`}
            </HiddenOptionsCounter>
          </HiddenOptions>
        </MultiSelectInputWrapper>
      )}

      <ChevronButton
        data-is-open={isOpen}
        data-is-disabled={isDisabled}
        data-is-read-only={isReadOnly}
      />
    </InputFiledWrapper>
  );
};

export default DropdownInputField;
