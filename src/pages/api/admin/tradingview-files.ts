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

  const baseDir = path.join(process.cwd(), 'data', 'tradingview');
  
  if (!fs.existsSync(baseDir)) {
    return res.status(200).json({ items: [], categories: [] });
  }

  try {
    // Get all subdirectories as categories
    const categories = fs.readdirSync(baseDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    const selectedCategory = (req.query.category as string) || (categories.includes('Weapon-Cases') ? 'Weapon-Cases' : categories[0] || '');
    
    const dirPath = path.join(baseDir, selectedCategory);
    
    if (!fs.existsSync(dirPath) || !selectedCategory) {
      return res.status(200).json({ items: [], categories, selectedCategory });
    }

    const files = fs
      .readdirSync(dirPath)
      .filter((f) => f.endsWith('.json'));

    // Group files by Item Name
    const itemsMap: Record<string, string[]> = {};

    files.forEach(file => {
      const nameWithoutExt = file.replace('.json', '');
      const lastUnderscoreIndex = nameWithoutExt.lastIndexOf('_');
      
      if (lastUnderscoreIndex !== -1) {
        const itemName = nameWithoutExt.substring(0, lastUnderscoreIndex);
        const resolution = nameWithoutExt.substring(lastUnderscoreIndex + 1);
        
        if (!itemsMap[itemName]) {
          itemsMap[itemName] = [];
        }
        itemsMap[itemName].push(resolution);
      } else {
        if (!itemsMap[nameWithoutExt]) {
          itemsMap[nameWithoutExt] = ['1D'];
        }
      }
    });

    const items = Object.keys(itemsMap).map(name => {
      const primaryRes = itemsMap[name].includes('1D') ? '1D' : itemsMap[name][0];
      const filePath = path.join(dirPath, `${name}_${primaryRes}.json`);
      let recordCount = 0;
      
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);
        recordCount = Array.isArray(data) ? data.length : 0;
      } catch (e) {}

      return {
        name,
        resolutions: itemsMap[name].sort(),
        recordCount
      };
    }).sort((a, b) => a.recordCount - b.recordCount);

    return res.status(200).json({ items, categories, selectedCategory });
  } catch (error) {
    console.error('Error reading tradingview directory:', error);
    return res.status(500).json({ message: 'Error reading directory' });
  }
}
