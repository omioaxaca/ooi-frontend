// Backend of a syllabus
export type SyllabusCategory = 'BLUE' | 'GREEN';

// Backend of a syllabus
export type Syllabus = {
  id: number;
  documentId: string;
  title: string;
  description: string;
  externalReferences: string;
  category: SyllabusCategory;
  youtubeLinks: Array<{
    id: number;
    dociumentId: string;
    value: string;
  }>;
  pdfLinks: Array<{
    id: number;
    dociumentId: string;
    value: string;
  }>;
};

// Frontend view of a syllabus
export type SyllabusView = {
  id: number;
  documentId: string;
  title: string;
  description: string;
  externalReferences: string;
  youtubeLinks: Array<string>;
  pdfLinks: Array<string>;
};