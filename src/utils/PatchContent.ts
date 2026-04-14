import fs from 'fs';
import { join } from 'path';

export type PatchItem = {
  date: string;
  day: string;
  time: string;
  title: string;
  buildId: string;
  slug: string;
  content: string;
  description: string;
};

const patchesIndexFile = join(/* turbopackIgnore: true */ process.cwd(), 'reportings', 'Steamdb-730.md');
const patchesDirectory = join(/* turbopackIgnore: true */ process.cwd(), 'reportings', 'steamdb');

// Pre-build a map of all files in the steamdb directory to avoid recursive searching
const buildFileMap = (dir: string, map: Map<string, string> = new Map()) => {
  if (!fs.existsSync(dir)) return map;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      buildFileMap(fullPath, map);
    } else {
      map.set(file, fullPath);
    }
  }
  return map;
};

export function getAllPatches(includeContent: boolean = true): PatchItem[] {
  if (!fs.existsSync(patchesIndexFile)) return [];

  const indexContent = fs.readFileSync(patchesIndexFile, 'utf8');
  const lines = indexContent.split('\n');
  
  const patches: PatchItem[] = [];
  const fileMap = buildFileMap(patchesDirectory);

  // Skip header line
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Use | separation for Markdown table format
    const parts = line.split('|').map(p => p.trim()).filter(p => p !== '');
    
    if (parts.length < 4) continue; 
    if (parts[0].includes('---')) continue; // Skip separator line

    const date = parts[0];
    const day = parts[1];
    const time = parts[2];
    const title = parts[3] === 'No title' || !parts[3] ? `Update ${parts[parts.length - 1]}` : parts[3];
    const buildId = parts[parts.length - 1];
    
    // Find content file from pre-built map
    const contentPath = fileMap.get(`${buildId}.md`);
    
    if (contentPath) {
      const content = includeContent ? fs.readFileSync(contentPath, 'utf8') : '';
      
      const description = includeContent 
        ? content
          .replace(/#+\s+.*?\n/g, '') // Remove headings
          .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Simplify links
          .replace(/\n\s*\n/g, ' ') // Consolidate paragraphs
          .trim()
          .substring(0, 160) + '...'
        : fs.readFileSync(contentPath, 'utf8')
          .replace(/#+\s+.*?\n/g, '')
          .replace(/\[(.*?)\]\(.*?\)/g, '$1')
          .replace(/\n\s*\n/g, ' ')
          .trim()
          .substring(0, 160) + '...';

      patches.push({
        date: date || '',
        day: day || '',
        time: time || '',
        title: title || '',
        buildId: buildId || '',
        slug: buildId || '',
        content: content || '',
        description: description || ''
      });
    }
  }

  return patches;
}

export function getPatchBySlug(slug: string): PatchItem | null {
  if (!fs.existsSync(patchesIndexFile)) return null;

  const indexContent = fs.readFileSync(patchesIndexFile, 'utf8');
  const lines = indexContent.split('\n');
  
  const fileMap = buildFileMap(patchesDirectory);

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const parts = line.split('|').map(p => p.trim()).filter(p => p !== '');
    if (parts.length < 4) continue;
    if (parts[0].includes('---')) continue;

    const buildId = parts[parts.length - 1];
    
    if (buildId === slug) {
      const date = parts[0];
      const day = parts[1];
      const time = parts[2];
      const title = parts[3] === 'No title' || !parts[3] ? `Update ${buildId}` : parts[3];
      
      const contentPath = fileMap.get(`${buildId}.md`);
      
      if (contentPath) {
        const content = fs.readFileSync(contentPath, 'utf8');
        const description = content
          .replace(/#+\s+.*?\n/g, '')
          .replace(/\[(.*?)\]\(.*?\)/g, '$1')
          .replace(/\n\s*\n/g, ' ')
          .trim()
          .substring(0, 160) + '...';

        return {
          date: date || '',
          day: day || '',
          time: time || '',
          title: title || '',
          buildId: buildId || '',
          slug: buildId || '',
          content: content || '',
          description: description || ''
        };
      }
    }
  }

  return null;
}
