import type { StrapiFile } from "../global";

export type ContestPhase = {
  id: number;
  documentId: string;
  title: string;
  description: string;
  cover: StrapiFile;
};