import { CapEventPackageServer } from '@/api/java';

export interface EventType {
  id: string;
  name: string;
  description: string;
  abbreviation: string;
}

export const getEventTypes = async () => {
  try {
    const { data } = await CapEventPackageServer.get<EventType[]>('/cap-events/types');
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`${error.message}. Error getting event types`);
    }
  }

  return null;
};
