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

export interface ExtensionComboItem {
  id: string;
  title: string;
  description?: string;
  youtubeUrl: string;
  /** External URL (e.g. Chrome Web Store, Drive, GitHub release) OR direct link */
  downloadUrl?: string;
  /** Optional exact filename uploaded inside src/extensions/ (e.g. "MyTool.exe") */
  fileName?: string;
  badge?: string;
  buttonLabel?: string;
  isLocalDraft?: boolean;
}
