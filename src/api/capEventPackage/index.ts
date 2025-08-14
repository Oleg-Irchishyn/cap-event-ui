import { CapEventPackageServer } from '@/api/java';

export interface EventType {
  id: number;
  name: string;
  description: string;
}

export const getEventTypes = async () => {
  try {
    const { data } = await CapEventPackageServer.get<EventType[]>('eventTypes');
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`${error.message}. Error getting event types`);
    }
  }

  return null;
};
