import fs from 'fs';
import path from 'path';

import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { symbol, url } = req.query;
  const rawTarget = url || symbol || '';
  const target = Array.isArray(rawTarget) ? rawTarget[0] : rawTarget;

  if (!target) {
    return res.status(400).json({ error: 'Data identifier (url or symbol) is required' });
  }

  // Prevent directory traversal attacks
  const safeSymbol = path.basename(target as string);
  const filePath = path.join(process.cwd(), 'data', 'json', safeSymbol);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Data not found' });
  }

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    let data = JSON.parse(fileContent);

    if (Array.isArray(data)) {
      if (req.query.year) {
        const yearStr = String(req.query.year);
        data = data.filter((d: any) => d.date.includes(yearStr));
      } else {
        // Return the last 365 records for history analysis
        data = data.slice(-365);
      }
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
