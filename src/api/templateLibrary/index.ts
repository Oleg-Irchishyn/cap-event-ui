import { TemplateLibraryServer } from '@/api/java';

export interface TemplateLibrary {
  id: string;
  boxId: string;
  name: string;
}

export const getTemplates = async (sponsorId: string, eventTypeId: string) => {
  try {
    const { data } = await TemplateLibraryServer.get<TemplateLibrary[]>('templates/metadata', {
      params: { sponsorId, eventTypeId },
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`${error.message}. Error getting templates`);
    }
  }

  return null;
};
