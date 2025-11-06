import React, { FC, useRef, useState, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import Image from 'next/image';
import { useExternalElementClick } from '@/hooks/useExternalElementClick';
import { prepareDataTestId } from '@/utils/prepareDataTestId';
import {
  CloseIconContainer,
  ModalContainer,
  ModalWrapper,
  TitleContainer,
  ControlButton,
  FootnotesContainer,
  FootnotesList,
  ButtonsContainer,
  ItemWrapper,
  RemoveItem,
  FieldLabel,
  TextAreaWrapper,
} from './styles';
import Dropdown from '@/app/components/Dropdown';
import { capEventSettingsStore } from '@/stores';
import { ITEM_STATES } from '@/const/common';
import { DropdownItemType } from '@/app/components/Dropdown/Dropdown';
import { TextArea } from '@/app/new/styles';
import Button, { BUTTON_THEMES } from '@/app/components/Button';

const CloseIcon = () => (
  <Image src="icons/cross.svg" width={10} height={10} alt="modal-close-icon" />
);

type FootnoteItem = {
  description: string;
  footnote: string;
};

type Props = {
  isOpen: boolean;
  handleClose: () => void;
};

const initFootnotes = () => {
  if (capEventSettingsStore.footnotes.length) {
    return capEventSettingsStore.footnotes;
  }
  return [{ description: '', footnote: '' }];
};

const areArraysEqual = (arr1: FootnoteItem[], arr2: FootnoteItem[]): boolean => {
  if (arr1.length !== arr2.length) return false;
  return arr1.every(
    (item, index) =>
      item.description === arr2[index]?.description && item.footnote === arr2[index]?.footnote,
  );
};

const FootnotesModal: FC<Props> = ({ isOpen, handleClose }) => {
  const modalRef = useRef(null);
  const [footnoteItems, setFootnoteItems] = useState<FootnoteItem[]>(initFootnotes());

  const isSaveEnabled = useMemo(() => {
    const allItemsPopulated = footnoteItems.every(
      (item) => item.description.trim() !== '' && item.footnote.trim() !== '',
    );

    const hasChanges = !areArraysEqual(footnoteItems, capEventSettingsStore.footnotes);

    return allItemsPopulated && hasChanges;
  }, [footnoteItems]);

  const closeModal = () => {
    setFootnoteItems(initFootnotes());
    handleClose();
  };

  const handleSave = () => {
    capEventSettingsStore.setFootnotes(footnoteItems);
    closeModal();
  };

  useExternalElementClick(modalRef, () => {
    if (isOpen) closeModal();
  }, [isOpen]);

  const prepareDropdownItems = (
    allDescriptions: string[],
    currentIndex: number,
  ): DropdownItemType[] => {
    const selectedDescriptions = footnoteItems.map((item) => item.description).filter(Boolean);

    const getItemState = (item: string) =>
      footnoteItems[currentIndex]?.description === item
        ? ITEM_STATES.SELECTED
        : ITEM_STATES.OPTIONAL;

    return allDescriptions.map((item) => ({
      label: item,
      state: selectedDescriptions.includes(item) ? ITEM_STATES.EXCLUDED : getItemState(item),
    }));
  };

  const handleSelectDescription = (index: number) => (item: DropdownItemType) => {
    setFootnoteItems((prev) =>
      prev.map((footnote, i) =>
        i === index ? { ...footnote, description: item.label } : footnote,
      ),
    );
  };

  const handleTextareaChange = (index: number) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFootnoteItems((prev) =>
      prev.map((footnote, i) =>
        i === index ? { ...footnote, footnote: e.target.value } : footnote,
      ),
    );
  };

  const addNewFootnote = () => {
    setFootnoteItems((prev) => [...prev, { description: '', footnote: '' }]);
  };

  const removeItem = (index: number) => {
    setFootnoteItems((prev) => {
      if (prev.length <= 1) {
        return prev;
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  return isOpen ? (
    <ModalWrapper>
      <ModalContainer ref={modalRef}>
        <TitleContainer>
          <div>Footnote(s) Settings</div>
          <CloseIconContainer onClick={closeModal}>
            <CloseIcon />
          </CloseIconContainer>
        </TitleContainer>
        <FootnotesList>
          {footnoteItems.map((item, index) => {
            const dropdownItems = prepareDropdownItems(
              capEventSettingsStore.customEntityDescription,
              index,
            );
            const selectedItems = dropdownItems.filter(
              (ddItem) => ddItem.label === item.description,
            );

            return (
              <FootnotesContainer key={index}>
                <ItemWrapper>
                  <div style={{ maxWidth: '340px' }}>
                    <Dropdown
                      items={dropdownItems}
                      selectedItems={selectedItems}
                      selectHandler={handleSelectDescription(index)}
                      placeholder="Select Notice Line Description"
                      label="Notice Line Description"
                      testId={`description-dropdown-${index}`}
                    />
                  </div>
                  <TextAreaWrapper>
                    <FieldLabel>Footnote Text Area</FieldLabel>
                    <TextArea
                      name={`footnote-${index}`}
                      rows={5}
                      value={item.footnote}
                      placeholder="Enter footnote text"
                      style={{ maxHeight: '250px' }}
                      onChange={handleTextareaChange(index)}
                    />
                  </TextAreaWrapper>
                </ItemWrapper>
                <RemoveItem onClick={() => removeItem(index)}></RemoveItem>
              </FootnotesContainer>
            );
          })}
        </FootnotesList>
        <ControlButton data-testid={prepareDataTestId('add-footnote')} onClick={addNewFootnote}>
          <Image src={'icons/plus.svg'} alt="plus" width={13} height={13} priority={true} />
          Add New Footnote
        </ControlButton>
        <ButtonsContainer>
          <Button
            testId="cancel"
            width="91px"
            onClick={closeModal}
            buttonTheme={BUTTON_THEMES.secondary}
          >
            Cancel
          </Button>

          <Button
            width="91px"
            testId="save"
            onClick={handleSave}
            buttonTheme={BUTTON_THEMES.primary}
            disabled={!isSaveEnabled}
          >
            Save
          </Button>
        </ButtonsContainer>
      </ModalContainer>
    </ModalWrapper>
  ) : null;
};

export default observer(FootnotesModal);
