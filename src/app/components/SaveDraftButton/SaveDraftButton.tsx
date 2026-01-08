import router from 'next/router';

import { CapEventPackageApi } from '@/api';
import { capEventSettingsStore, entityDatesStore, previewScreenStore } from '@/stores';
import { useToast } from '@/providers/ToastProvider';
import { showErrorToast } from '@/utils/showErrorToast';
import { ROUTES } from '@/const/routes';
import useSaveDraftButton from '@/hooks/useSaveDraftButton';

import Button, { BUTTON_THEMES } from '@/app/components/Button';

const SaveDraftButton = () => {
  const toast = useToast();
  const { isSaveDraftDisabled } = useSaveDraftButton();

  const handleSaveDraft = async () => {
    try {
      const payload = previewScreenStore.buildPayload(true);
      if (payload) {
        const requestWithAggregatedLineItems = previewScreenStore.withAggregatedLineItems(payload);

        const response = await CapEventPackageApi.default.createDraft(
          requestWithAggregatedLineItems,
        );
        if (response) {
          toast.success('Successfully Saved');
          router.push(ROUTES.MAIN.path);
          setTimeout(() => {
            capEventSettingsStore.resetStore();
            entityDatesStore.resetAllDates();
          }, 1000);
        }
      }
    } catch (error) {
      showErrorToast(error);
      console.error(error);
    }
  };
  return (
    <Button
      style={{ display: 'none' }}
      testId="save-draft"
      disabled={isSaveDraftDisabled}
      width="auto"
      onClick={handleSaveDraft}
      buttonTheme={BUTTON_THEMES.secondary}
    >
      Save Draft
    </Button>
  );
};

export default SaveDraftButton;
