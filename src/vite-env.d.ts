/// <reference types="vite/client" />

declare module 'virtual:download-extensions' {
  const files: import('./types/extensions').ExtensionFileItem[];
  export default files;
}
