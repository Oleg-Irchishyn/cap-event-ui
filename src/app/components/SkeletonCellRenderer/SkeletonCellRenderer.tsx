'use client';

import React from 'react';

type Props = {
  widthPercent?: number;
  textAlign?: 'start' | 'end' | 'center' | 'left' | 'right';
};

const SkeletonCellRenderer: React.FC<Props> = ({ widthPercent = 80, textAlign }) => {
  let justifyContent: 'flex-start' | 'center' | 'flex-end' = 'flex-start';
  if (textAlign === 'end' || textAlign === 'right') {
    justifyContent = 'flex-end';
  } else if (textAlign === 'center') {
    justifyContent = 'center';
  }

  return (
    <div
      className="ag-skeleton-wrapper"
      data-testid="skeleton-cell"
      style={{ display: 'flex', justifyContent, width: '100%' }}
    >
      <div
        className="ag-skeleton-bar"
        data-testid="skeleton-bar"
        style={{ width: `${widthPercent}%` }}
      />
    </div>
  );
};

export default SkeletonCellRenderer;
