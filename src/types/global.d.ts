interface Window {
  dataLayer: Array<{
    event?: string;
    [key: string]: unknown;
  }>;
}

export type StrapiFile = {
  id: number;
  documentId: string;
  url: string;
}