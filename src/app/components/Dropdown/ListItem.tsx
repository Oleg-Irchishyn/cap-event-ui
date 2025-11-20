import React, { useRef, useState } from 'react';

import { ITEM_STATES } from '@/const/common';

import {
  ItemCheckbox,
  ItemDescription,
  ItemLabel,
  ItemLabelWrapper,
  ItemWrapper,
  LabelWrapper,
} from './styles';
import { DropdownItemType } from '@/app/components/Dropdown/Dropdown';
import Tooltip from '@/app/components/Tooltip';

const { SELECTED, EXCLUDED } = ITEM_STATES;

type ListItemProps<T> = {
  item: DropdownItemType<T>;
  checkbox: boolean;
  itemClickHandler: (item: DropdownItemType<T>) => () => void;
  withDescription?: boolean;
  withBackground?: boolean;
  excludedTooltipMessage?: string;
};

const ListItem = <T,>({
  item,
  checkbox,
  itemClickHandler,
  withDescription = false,
  withBackground = true,
  excludedTooltipMessage = '',
}: ListItemProps<T>) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const labelRef = useRef<HTMLDivElement>(null);

  return (
    <ItemWrapper
      data-is-withbackground={withBackground}
      data-is-selected={item.state === SELECTED}
      data-is-disabled={item.state === EXCLUDED}
      $withdescription={withDescription ? 1 : 0}
      onClick={itemClickHandler(item)}
      onMouseEnter={item.state === EXCLUDED ? () => setShowTooltip(true) : undefined}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <ItemLabelWrapper>
        {checkbox && (
          <ItemCheckbox
            style={{
              width: '16px',
              height: '16px',
            }}
            checked={item.state === SELECTED}
            disabled={item.state === EXCLUDED}
            onChange={() => {}}
          />
        )}

        <LabelWrapper ref={labelRef}>
          <Tooltip
            targetRef={labelRef}
            showTooltip={showTooltip}
            tooltipMessage={excludedTooltipMessage}
          />
          <ItemLabel
            data-is-disabled={item.state === EXCLUDED}
            $withdescription={withDescription ? 1 : 0}
          >
            {item.label}
          </ItemLabel>
          {withDescription && (
            <>
              <ItemDescription>{item.description}</ItemDescription>
              {item.additionalDescription && (
                <ItemDescription>{item.additionalDescription}</ItemDescription>
              )}
            </>
          )}
        </LabelWrapper>
      </ItemLabelWrapper>
    </ItemWrapper>
  );
};

export default ListItem;
