export type ExtensionFileCategory =
  | 'software'
  | 'video'
  | 'audio'
  | 'image'
  | 'archive'
  | 'document'
  | 'other';

export interface ExtensionFileItem {
  id: string;
  fileName: string;
  relativePath: string;
  title: string;
  extension: string;
  category: ExtensionFileCategory;
  sizeBytes: number;
  updatedAt: string;
  downloadUrl: string;
  isLocalPreview?: boolean;
}
