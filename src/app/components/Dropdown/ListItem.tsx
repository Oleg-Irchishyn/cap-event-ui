import React, { FC, useRef, useState } from 'react';

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

type ListItemProps = {
  item: DropdownItemType;
  checkbox: boolean;
  itemClickHandler: (item: DropdownItemType) => () => void;
  withDescription?: boolean;
  withBackground?: boolean;
  excludedTooltipMessage?: string;
};

const ListItem: FC<ListItemProps> = ({
  item,
  checkbox,
  itemClickHandler,
  withDescription = false,
  withBackground = true,
  excludedTooltipMessage = '',
}) => {
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
          {withDescription && <ItemDescription>{item.description}</ItemDescription>}
        </LabelWrapper>
      </ItemLabelWrapper>
    </ItemWrapper>
  );
};

export default ListItem;
