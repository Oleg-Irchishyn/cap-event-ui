import RootStore from '../RootStore';
import CapEventSettingsStore from '../CapEventSettingsStore';
import EntityDatesStore from '../EntityDatesStore';
import PreviewScreenStore from '../PreviewScreenStore';

describe('RootStore', () => {
  it('initializes all stores correctly', () => {
    const rootStore = new RootStore();

    expect(rootStore.capEventSettingsStore).toBeInstanceOf(CapEventSettingsStore);
    expect(rootStore.entityDatesStore).toBeInstanceOf(EntityDatesStore);
    expect(rootStore.previewScreenStore).toBeInstanceOf(PreviewScreenStore);
  });

  it('passes RootStore instance to each store', () => {
    const rootStore = new RootStore();

    expect(rootStore.capEventSettingsStore.root).toBe(rootStore);
    expect(rootStore.entityDatesStore.root).toBe(rootStore);
    expect(rootStore.previewScreenStore.root).toBe(rootStore);
  });

  it('creates unique store instances for each property', () => {
    const rootStore = new RootStore();

    expect(rootStore.capEventSettingsStore).not.toBe(rootStore.entityDatesStore);
    expect(rootStore.capEventSettingsStore).not.toBe(rootStore.previewScreenStore);
    expect(rootStore.entityDatesStore).not.toBe(rootStore.previewScreenStore);
  });

  it('creates new store instances on each RootStore instantiation', () => {
    const rootStore1 = new RootStore();
    const rootStore2 = new RootStore();

    expect(rootStore1.capEventSettingsStore).not.toBe(rootStore2.capEventSettingsStore);
    expect(rootStore1.entityDatesStore).not.toBe(rootStore2.entityDatesStore);
    expect(rootStore1.previewScreenStore).not.toBe(rootStore2.previewScreenStore);
  });

  it('has all required store properties defined', () => {
    const rootStore = new RootStore();

    expect(rootStore.capEventSettingsStore).toBeDefined();
    expect(rootStore.entityDatesStore).toBeDefined();
    expect(rootStore.previewScreenStore).toBeDefined();
  });
});
