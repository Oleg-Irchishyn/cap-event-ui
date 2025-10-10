import CapEventSettingsStore from '@/stores/CapEventSettingsStore';
import EntityDatesStore from '@/stores/EntityDatesStore';

const entityDatesStore = new EntityDatesStore();
const capEventSettingsStore = new CapEventSettingsStore();

export { capEventSettingsStore, entityDatesStore };
