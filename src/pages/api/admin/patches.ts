import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const patchesIndexFile = path.join(process.cwd(), 'reportings', 'Steamdb-730.md');
    
    if (!fs.existsSync(patchesIndexFile)) {
      return res.status(200).json({ patches: [] });
    }

    const indexContent = fs.readFileSync(patchesIndexFile, 'utf8');
    const lines = indexContent.split('\n');
    const filteredPatches = [];

    // Skip header and separator
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.includes(':---')) continue;

      const parts = line.split('|').map(p => p.trim()).filter(p => p !== '');
      if (parts.length < 4) continue;

      const date = parts[0];
      const title = parts[3];
      const buildId = parts[parts.length - 1];

      // SKIP "No title" events as requested
      if (title === 'No title' || !title) continue;

      filteredPatches.push({
        date,
        title,
        buildId,
        filename: `${buildId}.md`
      });
    }
    
    return res.status(200).json({ patches: filteredPatches });
  } catch (error) {
    console.error('Error fetching patches:', error);
    return res.status(500).json({ message: 'Error fetching patches' });
  }
}
