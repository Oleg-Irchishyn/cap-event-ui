import { useEffect, useMemo, useState } from 'react';
import { PreviewScreenRow, SubTotalTableRow } from '@/app/preview-screen/types';

import { useToast } from '@/providers/ToastProvider';
import { capEventSettingsStore, previewScreenStore } from '@/stores';
import {
  getDynamicColumnsDefs,
  getPreviewScreenColumnDefs,
  getPreviewSubTotalColumnDefs,
  getTopGridColumnDefs,
  getSubTotalRows,
} from '@/utils/getPreviewScreenColumnDefs';
import type { RowClickedEvent } from 'ag-grid-community';

export const usePreviewScreenDetails = () => {
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
      setSubTotalRows(getSubTotalRows(newRows));
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

  const columnDefs = useMemo(
    () => [...staticColumns, ...dynamicColumns],
    [staticColumns, dynamicColumns],
  );

  const topGridColumnDefs = useMemo(
    () => getTopGridColumnDefs(lineItems, isLoading),
    [lineItems, isLoading],
  );

  const bigColumnWidth = useMemo(
    () => getPreviewScreenColumnDefs()?.reduce((sum, col) => sum + (col?.initialWidth ?? 0), 0),
    [],
  );

  const subTotalStaticColumns = useMemo(
    () => getPreviewSubTotalColumnDefs(bigColumnWidth, isLoading),
    [bigColumnWidth, isLoading],
  );

  const subTotalColumnDefs = useMemo(
    () => [...subTotalStaticColumns, ...dynamicColumns],
    [subTotalStaticColumns, dynamicColumns],
  );

  return {
    rows,
    subTotalRows,
    isLoading,
    lineItems,
    columnDefs,
    topGridColumnDefs,
    subTotalColumnDefs,
    onRowClicked,
    selectedRow,
    noticePreviewDoc,
    isLoadingPreview,
    closeModal,
  };
};
