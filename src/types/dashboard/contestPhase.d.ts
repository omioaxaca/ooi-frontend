import type { StrapiFile } from "../common";

export type ContestPhase = {
  id: number;
  documentId: string;
  title: string;
  description: string;
  cover: StrapiFile;
};