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

  const dirPath = path.join(process.cwd(), 'data', 'tradingview');
  
  if (!fs.existsSync(dirPath)) {
    return res.status(200).json({ items: [] });
  }

  try {
    const files = fs
      .readdirSync(dirPath)
      .filter((f) => f.endsWith('.json'));

    // Group files by Item Name
    // Format: "Item Name_Resolution.json"
    const itemsMap: Record<string, string[]> = {};

    files.forEach(file => {
      const nameWithoutExt = file.replace('.json', '');
      const lastUnderscoreIndex = nameWithoutExt.lastIndexOf('_');
      
      if (lastUnderscoreIndex !== -1) {
        const itemName = nameWithoutExt.substring(0, lastUnderscoreIndex);
        const resolution = nameWithoutExt.substring(lastUnderscoreIndex + 1); // e.g. "1D", "1W"
        
        if (!itemsMap[itemName]) {
          itemsMap[itemName] = [];
        }
        itemsMap[itemName].push(resolution);
      } else {
        // Fallback for files without underscore
        if (!itemsMap[nameWithoutExt]) {
          itemsMap[nameWithoutExt] = ['1D']; // Assume 1D
        }
      }
    });

    const items = Object.keys(itemsMap).map(name => {
      // Get record count for the primary resolution (prefer 1D)
      const primaryRes = itemsMap[name].includes('1D') ? '1D' : itemsMap[name][0];
      const filePath = path.join(dirPath, `${name}_${primaryRes}.json`);
      let recordCount = 0;
      
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);
        recordCount = Array.isArray(data) ? data.length : 0;
      } catch (e) {
        // Fallback to 0 if error reading file
      }

      return {
        name,
        resolutions: itemsMap[name].sort(),
        recordCount
      };
    }).sort((a, b) => a.recordCount - b.recordCount);

    return res.status(200).json({ items });
  } catch (error) {
    console.error('Error reading tradingview directory:', error);
    return res.status(500).json({ message: 'Error reading directory' });
  }
}
