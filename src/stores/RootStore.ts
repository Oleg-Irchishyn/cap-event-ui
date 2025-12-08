import CapEventSettingsStore from '@/stores/CapEventSettingsStore';
import EntityDatesStore from '@/stores/EntityDatesStore';
import PreviewScreenStore from '@/stores/PreviewScreenStore';

class RootStore {
  capEventSettingsStore: CapEventSettingsStore;
  entityDatesStore: EntityDatesStore;
  previewScreenStore: PreviewScreenStore;

  constructor() {
    this.capEventSettingsStore = new CapEventSettingsStore(this);
    this.entityDatesStore = new EntityDatesStore(this);
    this.previewScreenStore = new PreviewScreenStore(this);
  }
}

export default RootStore;
