'use client';

import { useEffect, useMemo, useState } from 'react';
import { ColDef, RowClickedEvent } from 'ag-grid-community';
import { observer } from 'mobx-react-lite';

import { capEventSettingsStore, previewScreenStore } from '@/stores';
import { useToast } from '@/providers/ToastProvider';
import BackgroundContainer from '@/app/components/BackgroundContainer';
import PreviewScreenModal from '@/app/preview-screen/PreviewScreenModal';
import PreviewScreenTable, {
  CombinedTitleCell,
  GeneralInfoCell,
} from '@/app/preview-screen/PreviewScreenTable';
import { Title, Wrapper } from '@/app/new/styles';
import { prepareDataTestId } from '@/utils/prepareDataTestId';

import { PreviewScreenRow, SubTotalTableRow, GENERAL_INFO, LINE_ITEMS_FIELDS } from './types';
import PreviewSubTotalTable from '@/app/preview-screen/PreviewSubTotalTable';
import {
  getDynamicColumnsDefs,
  getPreviewScreenColumnDefs,
  getPreviewSubTotalColumnDefs,
  getSubTotalRows,
  getTopDynamicColumnDefs,
} from '@/utils/getPreviewScreenColumnDefs';
import SkeletonCellRenderer from '@/app/components/SkeletonCellRenderer';
import {
  AMOUNT_FIELD,
  COMMITMENT_FIELD,
  TOTAL_AMOUNT_DUE_HEADER,
  TOTAL_CAPITAL_COMMITMENT_HEADER,
} from '@/const/previewScreen';

const PreviewScreenDetails = () => {
  const toast = useToast();
  const [rows, setRows] = useState<PreviewScreenRow[]>([]);
  const [selectedRow, setSelectedRow] = useState<PreviewScreenRow | null>(null);
  const [noticePreviewDoc, setNoticePreviewDoc] = useState<Blob | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [subTotalRows, setSubTotalRows] = useState<SubTotalTableRow[]>([]);

  useEffect(() => {
    const process = async () => {
      setRows([]);
      const newRows = await previewScreenStore.processPayload(toast);
      setRows(newRows);
      const subTotalNewRows = getSubTotalRows(newRows);
      setSubTotalRows(subTotalNewRows);
    };
    process();
  }, [toast]);

  const onRowClicked = async (e: RowClickedEvent) => {
    if (e.data?.isAggregated) {
      setSelectedRow(e.data);
      setIsLoadingPreview(true);
      const blob = await previewScreenStore.fetchDoc(e.data, toast);
      if (blob) {
        setNoticePreviewDoc(blob);
      } else {
        closeModal();
      }
      setIsLoadingPreview(false);
    }
  };

  const closeModal = () => {
    setSelectedRow(null);
    setNoticePreviewDoc(null);
  };

  const lineItems = useMemo(
    () =>
      [...capEventSettingsStore.entitiesLineItem].sort(([aLabel], [bLabel]) => {
        return (aLabel || '').localeCompare(bLabel || '', undefined, {
          sensitivity: 'base',
          numeric: true,
        });
      }),
    [],
  );

  const isLoading = previewScreenStore.isLoading;

  const dynamicColumns = useMemo(
    () => getDynamicColumnsDefs(lineItems, isLoading),
    [isLoading, lineItems],
  );

  const staticColumns = useMemo(() => getPreviewScreenColumnDefs(isLoading), [isLoading]);

  const topDynamicColumnDefs = useMemo(
    () => getTopDynamicColumnDefs(lineItems, isLoading),
    [lineItems, isLoading],
  );

  const columnDefs = useMemo(
    () => [...staticColumns, ...dynamicColumns],
    [staticColumns, dynamicColumns],
  );

  const topGridColumnDefs = useMemo(() => {
    const combinedGeneralInfoColumn: ColDef = {
      headerName: 'General Info',
      field: GENERAL_INFO,
      flex: 6.7,
      sortable: false,
      resizable: true,
      cellRenderer: isLoading ? SkeletonCellRenderer : GeneralInfoCell,
      cellRendererParams: isLoading ? { widthPercent: 100 } : undefined,
    };

    const combinedTitleColumn: ColDef = {
      headerName: 'Titles',
      field: LINE_ITEMS_FIELDS,
      flex: 2.5,
      sortable: false,
      resizable: true,
      cellStyle: { textAlign: 'right' },
      cellRenderer: isLoading ? SkeletonCellRenderer : CombinedTitleCell,
      cellRendererParams: isLoading ? { widthPercent: 100 } : undefined,
    };

    const totalCommitmentColumn: ColDef = {
      headerName: TOTAL_CAPITAL_COMMITMENT_HEADER,
      field: COMMITMENT_FIELD,
      flex: 1.5,
      sortable: false,
      resizable: true,
      minWidth: 100,
      headerClass: 'ag-right-aligned-header',
      cellStyle: { textAlign: 'right' },
      valueGetter: () => '',
      cellRendererSelector: () =>
        isLoading ? { component: SkeletonCellRenderer, params: { widthPercent: 40 } } : undefined,
    };

    const totalAmountDueColumn: ColDef = {
      headerName: TOTAL_AMOUNT_DUE_HEADER,
      field: AMOUNT_FIELD,
      flex: 1,
      sortable: false,
      resizable: true,
      minWidth: 100,
      headerClass: 'ag-right-aligned-header',
      cellStyle: { textAlign: 'right' },
      valueGetter: () => '',
      cellRendererSelector: () =>
        isLoading ? { component: SkeletonCellRenderer, params: { widthPercent: 40 } } : undefined,
    };

    return [
      combinedGeneralInfoColumn,
      combinedTitleColumn,
      ...topDynamicColumnDefs,
      totalCommitmentColumn,
      totalAmountDueColumn,
    ];
  }, [isLoading, topDynamicColumnDefs]);

  // Sub-Total Table
  const bigColumnWidth = useMemo(
    () => getPreviewScreenColumnDefs()?.reduce((sum, col) => sum + (col?.initialWidth ?? 0), 0),
    [],
  );
  const subTotalStaticColumns = useMemo(
    () => getPreviewSubTotalColumnDefs(bigColumnWidth, isLoading),
    [bigColumnWidth, isLoading],
  );

  const subTotalColumnDefs = [...subTotalStaticColumns, ...dynamicColumns];

  return (
    <>
      <BackgroundContainer testId={prepareDataTestId('background', 'preview-screen')}>
        <Wrapper>
          <Title>Preview Screen</Title>

          <PreviewScreenTable
            testId={prepareDataTestId('table', 'preview-screen')}
            rows={rows}
            lineItems={lineItems}
            columnDefs={columnDefs}
            topGridColumnDefs={topGridColumnDefs}
            isLoading={isLoading}
            onRowClicked={onRowClicked}
          />
          <PreviewSubTotalTable
            rows={subTotalRows}
            columnDefs={subTotalColumnDefs}
            testId={prepareDataTestId('sub-total-table', 'preview-screen')}
            isLoading={isLoading}
          />
        </Wrapper>
      </BackgroundContainer>
      {selectedRow && (
        <PreviewScreenModal
          noticePreviewDoc={noticePreviewDoc}
          closeModal={closeModal}
          selectedRow={selectedRow}
          isLoading={isLoadingPreview}
        />
      )}
    </>
  );
};
export default observer(PreviewScreenDetails);
