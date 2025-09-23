'use client';

import React from 'react';

type Props = {
  widthPercent?: number;
};

const SkeletonCellRenderer: React.FC<Props> = ({ widthPercent = 80 }) => {
  return (
    <div className="ag-skeleton-wrapper" data-testid="skeleton-cell">
      <div
        className="ag-skeleton-bar"
        data-testid="skeleton-bar"
        style={{ width: `${widthPercent}%` }}
      />
    </div>
  );
};

export default SkeletonCellRenderer;
