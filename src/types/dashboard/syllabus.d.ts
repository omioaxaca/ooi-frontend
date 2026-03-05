// Syllabus category (Strapi relationship)
export type SyllabusCategory = {
  id: number;
  documentId: string;
  name: string;
  description: string;
  color: string;
};

// Syllabus level
export type SyllabusLevel = "Principiante" | "Intermedio" | "Avanzado";

// Backend of a syllabus
export type Syllabus = {
  id: number;
  documentId: string;
  title: string;
  description: string;
  externalReferences: string;
  level: SyllabusLevel;
  category: SyllabusCategory;
  youtubeLinks: Array<{
    id: number;
    documentId: string;
    value: string;
  }>;
  pdfLinks: Array<{
    id: number;
    documentId: string;
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
  level: SyllabusLevel;
  category: SyllabusCategory;
  youtubeLinks: Array<string>;
  pdfLinks: Array<string>;
};

// Syllabi grouped by category for display
export type SyllabusByCategory = {
  category: SyllabusCategory;
  syllabi: Syllabus[];
};
