import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {defineConfig, Plugin} from 'vite';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const EXTENSIONS_VIRTUAL_ID = 'virtual:download-extensions';
const RESOLVED_EXTENSIONS_VIRTUAL_ID = '\0' + EXTENSIONS_VIRTUAL_ID;

const IGNORED_EXTENSION_FILES = new Set([
  'drop-extensions-here.txt',
  '.gitkeep',
  '.ds_store',
  'thumbs.db',
  'readme.md',
]);

function categorizeExtension(ext: string) {
  const e = ext.toLowerCase();
  if (['exe', 'msi', 'apk', 'dmg', 'pkg', 'appimage', 'deb', 'bat', 'cmd', 'ps1', 'sh', 'crx', 'xpi', 'dll'].includes(e)) {
    return 'software';
  }
  if (['mp4', 'mov', 'webm', 'mkv', 'avi', 'm4v'].includes(e)) {
    return 'video';
  }
  if (['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac'].includes(e)) {
    return 'audio';
  }
  if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'bmp', 'ico'].includes(e)) {
    return 'image';
  }
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(e)) {
    return 'archive';
  }
  if (['pdf', 'txt', 'md', 'json', 'csv', 'doc', 'docx'].includes(e)) {
    return 'document';
  }
  return 'other';
}

function formatExtensionTitle(fileName: string): string {
  const withoutExt = fileName.replace(/\.[^/.]+$/, '');
  const cleaned = withoutExt.replace(/[-_]+/g, ' ').trim();
  return cleaned || fileName;
}

function scanExtensionFiles() {
  const extensionsDir = path.resolve(rootDir, 'src/extensions');
  if (!fs.existsSync(extensionsDir)) {
    return [];
  }

  const results: Array<{
    id: string;
    fileName: string;
    relativePath: string;
    title: string;
    extension: string;
    category: string;
    sizeBytes: number;
    updatedAt: string;
    downloadUrl: string;
  }> = [];

  function walk(currentDir: string, prefix = '') {
    const entries = fs.readdirSync(currentDir, {withFileTypes: true});
    entries.sort((a, b) => a.name.localeCompare(b.name));

    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue;
      const absPath = path.join(currentDir, entry.name);
      const relPath = prefix ? `${prefix}/${entry.name}` : entry.name;

      if (entry.isDirectory()) {
        walk(absPath, relPath);
        continue;
      }

      if (!entry.isFile()) continue;
      if (IGNORED_EXTENSION_FILES.has(entry.name.toLowerCase())) continue;

      const stat = fs.statSync(absPath);
      const extMatch = entry.name.match(/\.([^.]+)$/);
      const rawExt = extMatch ? extMatch[1] : 'FILE';
      const encodedRel = relPath
        .split('/')
        .map((segment) => encodeURIComponent(segment))
        .join('/');

      results.push({
        id: `ext-${relPath.toLowerCase()}`,
        fileName: entry.name,
        relativePath: relPath,
        title: formatExtensionTitle(entry.name),
        extension: rawExt.toUpperCase(),
        category: categorizeExtension(rawExt),
        sizeBytes: stat.size,
        updatedAt: stat.mtime.toISOString(),
        downloadUrl: `./extensions/${encodedRel}`,
      });
    }
  }

  walk(extensionsDir);
  return results;
}

function downloadExtensionsPlugin(): Plugin {
  const extensionsDir = path.resolve(rootDir, 'src/extensions');

  return {
    name: 'download-extensions-plugin',
    resolveId(id) {
      if (id === EXTENSIONS_VIRTUAL_ID) {
        return RESOLVED_EXTENSIONS_VIRTUAL_ID;
      }
      return null;
    },
    load(id) {
      if (id === RESOLVED_EXTENSIONS_VIRTUAL_ID) {
        const files = scanExtensionFiles();
        return `export default ${JSON.stringify(files)};`;
      }
      return null;
    },
    configureServer(server) {
      server.middlewares.use('/extensions', (req, res, next) => {
        if (!req.url) return next();
        const urlPath = decodeURIComponent(req.url.split('?')[0] || '');
        const cleanRel = urlPath.replace(/^\/+/, '');
        if (!cleanRel) return next();

        const targetPath = path.resolve(extensionsDir, cleanRel);
        if (
          !targetPath.startsWith(extensionsDir + path.sep) ||
          !fs.existsSync(targetPath) ||
          !fs.statSync(targetPath).isFile()
        ) {
          return next();
        }

        const stat = fs.statSync(targetPath);
        const fileName = path.basename(targetPath);
        const ext = path.extname(fileName).slice(1).toLowerCase();
        const inlineMimeMap: Record<string, string> = {
          jpg: 'image/jpeg',
          jpeg: 'image/jpeg',
          png: 'image/png',
          webp: 'image/webp',
          gif: 'image/gif',
          svg: 'image/svg+xml',
          mp4: 'video/mp4',
          webm: 'video/webm',
          mp3: 'audio/mpeg',
          wav: 'audio/wav',
          ogg: 'audio/ogg',
        };
        const fetchDest = String(req.headers['sec-fetch-dest'] || '');
        const isInlineMedia =
          (fetchDest === 'image' || fetchDest === 'video' || fetchDest === 'audio') &&
          Boolean(inlineMimeMap[ext]);

        res.setHeader('Content-Length', stat.size);
        if (isInlineMedia) {
          res.setHeader('Content-Type', inlineMimeMap[ext]);
        } else {
          res.setHeader('Content-Type', 'application/octet-stream');
          res.setHeader(
            'Content-Disposition',
            `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`
          );
        }
        fs.createReadStream(targetPath).pipe(res);
      });
    },
    closeBundle(error?: Error) {
      if (error) return;
      const distDir = path.resolve(rootDir, 'dist');
      const distExtensions = path.resolve(distDir, 'extensions');
      const files = scanExtensionFiles();
      if (!fs.existsSync(distDir) || files.length === 0) return;

      for (const file of files) {
        const srcFile = path.resolve(extensionsDir, file.relativePath);
        const destFile = path.resolve(distExtensions, file.relativePath);
        fs.mkdirSync(path.dirname(destFile), {recursive: true});
        fs.copyFileSync(srcFile, destFile);
      }
    },
  };
}

export default defineConfig(() => {
  return {
    base: './',
    plugins: [
      react(),
      tailwindcss(),
      downloadExtensionsPlugin(),
      // Copies src/assets into dist/ so root-relative URLs like
      // "/src/assets/images/..." (e.g. generate_image output) still resolve
      // in production builds. Do not remove.
      {
        name: 'copy-unbundled-src-assets',
        apply: 'build',
        closeBundle(error?: Error): void {
          if (error) {
            return;
          }
          const distDir = path.resolve(rootDir, 'dist');
          const srcAssets = path.resolve(rootDir, 'src/assets');
          const distAssets = path.resolve(distDir, 'src/assets');
          if (fs.existsSync(distDir) && fs.existsSync(srcAssets)) {
            fs.cpSync(srcAssets, distAssets, {recursive: true, force: true});
          }
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(rootDir, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
