import RootStore from '@/stores/RootStore';

// Create singleton RootStore instance - this persists in memory across navigation
const rootStore = new RootStore();

// Export RootStore instance for direct access if needed
export { rootStore };

// Export convenience references to child stores for direct usage
export const capEventSettingsStore = rootStore.capEventSettingsStore;
export const entityDatesStore = rootStore.entityDatesStore;
export const previewScreenStore = rootStore.previewScreenStore;
