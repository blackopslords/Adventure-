import type { ExtensionComboItem } from '../types/extensions';

/**
 * Add your YouTube Video + Download Link / File combos here so every public
 * visitor sees them automatically after you push to GitHub.
 *
 * You can link EITHER:
 *  - `downloadUrl`: Any external link (Chrome Web Store, Google Drive, MediaFire, GitHub Releases, etc.)
 *  - `fileName`: Any file uploaded inside `src/extensions/` (e.g. "MyTool.exe", "Pack.zip", "Clip.mp4")
 */
export const EXTENSION_COMBOS: ExtensionComboItem[] = [
  {
    id: 'demo-chrome-extension-01',
    title: 'Featured Browser Extension',
    description:
      'Watch the full setup & showcase video above, then install or download directly using the link below.',
    youtubeUrl: 'https://www.youtube.com/watch?v=LlzMvG1v_xQ',
    downloadUrl:
      'https://chromewebstore.google.com/detail/diiopbiepmlejbbibggfhhdmnaeiehjf?utm_source=item-share-cb',
    badge: 'Chrome Web Store',
    buttonLabel: 'Download Extension',
  },
];
