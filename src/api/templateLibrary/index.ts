import { TemplateLibraryServer } from '@/api/java';

interface TemplateLibrary {
  id: number;
  boxId: string;
  name: string;
}

export const getTemplates = async () => {
  try {
    const { data } = await TemplateLibraryServer.get<TemplateLibrary[]>('templates');
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`${error.message}. Error getting templates`);
    }
  }

  return null;
};
