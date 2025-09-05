'use client';

import React, { useState, useMemo, useCallback, useRef, FC } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  AllCommunityModule,
  CellValueChangedEvent,
  ColDef,
  EditableCallbackParams,
  ICellEditorParams,
  ModuleRegistry,
  provideGlobalGridOptions,
  themeAlpine,
} from 'ag-grid-community';
import { observer } from 'mobx-react-lite';
import Image from 'next/image';

import { LineItemRow } from '@/app/new/LineItems/types';
import { ApplyText, ControlButton, TableControls, TableWrapper } from '@/app/new/LineItems/styles';
import { DropdownSearchCell } from '@/app/new/LineItems/cellComponents/DropdownSearchCell';
import { AmountCell } from '@/app/new/LineItems/cellComponents/AmountCell';

import './grid-styles.css';

ModuleRegistry.registerModules([AllCommunityModule]);
provideGlobalGridOptions({ theme: themeAlpine });

const MOCK: LineItemRow[] = [
  {
    id: '1',
    category: 'Category 1',
    reason: 'Reason 1',
    description: 'Description 1',
    insideCMNT: 'CMNT 1',
    amount: 0,
  },
  {
    id: '2',
    category: 'Category 1',
    reason: 'Reason 2',
    description: 'Description 2',
    insideCMNT: 'CMNT 2',
    amount: 0,
  },
  {
    id: '3',
    category: 'Category 2',
    reason: 'Reason 3',
    description: 'Description 3',
    insideCMNT: 'CMNT 3',
    amount: 0,
  },
  {
    id: '4',
    category: 'Category 2',
    reason: 'Reason 3',
    description: 'Description 3',
    insideCMNT: 'CMNT 3',
    amount: 0,
  },
  {
    id: '5',
    category: 'Category 2',
    reason: 'Reason 3 aaa',
    description: 'Description 3 aaa',
    insideCMNT: 'CMNT 1 aaa',
    amount: 0,
  },
];

const getCellKey = (rowId: string, columnId: string) => `${rowId}-${columnId}`;

type Props =
  | {
      level: 'group' | 'entity';
      setDataToStoreCallback: (key: string, dataToStore: LineItemRow[]) => void;
      entityKey: string;
      isDisabled?: false;
    }
  | {
      level?: 'group' | 'entity';
      setDataToStoreCallback?: (key: string, dataToStore: LineItemRow[]) => void;
      entityKey?: string;
      isDisabled?: true;
    };

const ConfigurationTable: FC<Props> = ({
  level,
  setDataToStoreCallback = () => {},
  isDisabled,
  entityKey,
}) => {
  const editableCellRef = useRef<{ [key: string]: boolean }>({ '0-0': true });
  const [rowData, setRowData] = useState<LineItemRow[]>([
    {
      id: '1',
      category: '',
      reason: '',
      description: '',
      insideCMNT: '',
      amount: 0,
    },
  ]);

  const filterUniqueEntities = (values: LineItemRow[], key: string) => {
    const temp = values.reduce(
      (acc, item) => {
        const itemKey = item[key as keyof LineItemRow];
        if (!acc[itemKey]) {
          acc[itemKey] = item;
        }
        return acc;
      },
      {} as { [key: string]: LineItemRow },
    );

    return Object.keys(temp);
  };

  const filterBySelectedValue = useCallback((selectedCategory: string, key: string) => {
    const selectedEntities = MOCK.filter((entity) => entity.category === selectedCategory);

    return filterUniqueEntities(selectedEntities, key);
  }, []);

  const categoryOptions = filterUniqueEntities(MOCK, 'category');

  const editableCallback = useCallback(
    (params: EditableCallbackParams, requireEdit?: boolean) => {
      if (isDisabled) return false;
      if (requireEdit) return true;

      const columnId = params.column?.getColId() || '';
      const rowId = params.node.id || '';
      const key = getCellKey(rowId, columnId);
      return editableCellRef.current[key];
    },
    [isDisabled],
  );

  const reasonCellEditorsParamsCallback = useCallback(
    (params: ICellEditorParams) => {
      const selectedCategory = params.data.category;
      const possibleValues = filterBySelectedValue(selectedCategory, 'reason');
      return { options: possibleValues };
    },
    [filterBySelectedValue],
  );

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        colId: '0',
        headerName: 'Category',
        field: 'category',
        cellRenderer: DropdownSearchCell,
        cellEditor: DropdownSearchCell,
        editable: editableCallback,
        flex: 1,
        cellEditorParams: { options: categoryOptions },
        cellStyle: { padding: '0px' },
      },
      {
        colId: '1',
        headerName: 'Call/Distribution Reason',
        field: 'reason',
        cellRenderer: DropdownSearchCell,
        cellEditor: DropdownSearchCell,
        editable: editableCallback,
        flex: 1,
        cellStyle: { padding: '0px' },
        cellEditorParams: reasonCellEditorsParamsCallback,
      },
      {
        colId: '2',
        headerName: 'Call Line Description',
        field: 'description',
        editable: editableCallback,
        flex: 1,
        cellRenderer: DropdownSearchCell,
        cellEditor: DropdownSearchCell,
        cellStyle: { padding: '0px' },
        cellEditorParams: reasonCellEditorsParamsCallback,
      },
      {
        colId: '3',
        headerName: 'Inside CMNT',
        field: 'insideCMNT',
        editable: editableCallback,
        flex: 1,
        cellRenderer: DropdownSearchCell,
        cellEditor: DropdownSearchCell,
        cellStyle: { padding: '0px' },
        cellEditorParams: reasonCellEditorsParamsCallback,
      },
      {
        colId: '4',
        headerName: 'Amount',
        field: 'amount',
        cellRenderer: AmountCell,
        editable: false,
        flex: 1,
        headerClass: 'custom-header',
        cellRendererParams: (params: EditableCallbackParams) => editableCallback(params, true),
      },
    ],
    [categoryOptions, editableCallback, reasonCellEditorsParamsCallback],
  );

  const defaultColDef = useMemo(
    () => ({
      resizable: false,
      sortable: false,
      filter: false,
      floatingFilter: false,
      suppressSizeToFit: false,
    }),
    [],
  );

  const addNewRow = useCallback(() => {
    const newRow: LineItemRow = {
      id: Date.now().toString(),
      category: '',
      reason: '',
      description: '',
      insideCMNT: '',
      amount: 0,
    };
    const rowId = String(rowData.length);
    const key = getCellKey(rowId, '0');
    editableCellRef.current[key] = true;

    setRowData((prev) => [...prev, newRow]);
  }, [rowData.length]);

  const onCellValueChanged = useCallback(
    (params: CellValueChangedEvent) => {
      const { data, colDef, newValue } = params;
      const fieldName = colDef.field || '-';

      setRowData((prev) => {
        const updatedData = prev.map((row) => {
          if (row.id === data.id) {
            const updatedRow = { ...row, [fieldName]: newValue };

            // If category changed, also clear dependent fields
            if (fieldName === 'category') {
              updatedRow.reason = '';
              updatedRow.description = '';
              updatedRow.insideCMNT = '';

              const rowId = String(params.rowIndex);
              const cellKeysToBlock = [getCellKey(rowId, '2'), getCellKey(rowId, '3')];
              cellKeysToBlock.forEach((key) => (editableCellRef.current[key] = false));
            }

            return updatedRow;
          }
          return row;
        });

        // Call the callback with the updated data
        setDataToStoreCallback(entityKey || '-', updatedData);
        return updatedData;
      });

      const rowId = params.node.id || '';
      const nextColumnId = Number(params.column.getColId()) + 1;
      const key = getCellKey(rowId, String(nextColumnId));
      editableCellRef.current[key] = true;
    },
    [entityKey, setDataToStoreCallback],
  );

  const isDataChanged = true;

  return (
    <TableWrapper className="ag-theme-alpine">
      <AgGridReact
        columnDefs={columnDefs}
        rowData={rowData}
        defaultColDef={defaultColDef}
        onCellValueChanged={onCellValueChanged}
        rowSelection="multiple"
        animateRows={true}
        pagination={false}
        suppressPaginationPanel={true}
        domLayout="autoHeight"
        suppressHorizontalScroll={false}
        suppressColumnVirtualisation={false}
        suppressRowVirtualisation={false}
        rowHeight={40}
        headerHeight={40}
      />
      <TableControls>
        <ControlButton data-is-disabled={isDisabled} onClick={!isDisabled ? addNewRow : () => {}}>
          <Image
            src={isDisabled ? 'icons/plus-disabled.svg' : 'icons/plus.svg'}
            alt="plus"
            width={13}
            height={13}
            priority={true}
          />
          Add New Row
        </ControlButton>
        {level === 'group' && (
          <ControlButton
            data-is-disabled={isDisabled}
            data-is-clickable={isDataChanged}
            onClick={isDataChanged ? addNewRow : () => {}}
          >
            <Image
              src={isDataChanged ? 'icons/checkmark-green.svg' : 'icons/checkmark.svg'}
              alt="checkmark"
              width={13}
              height={13}
              priority={true}
            />
            <ApplyText data-is-active={isDataChanged}>Apply</ApplyText>
          </ControlButton>
        )}
      </TableControls>
    </TableWrapper>
  );
};

export default observer(ConfigurationTable);
