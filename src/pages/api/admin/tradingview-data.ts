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

  const { filename, url } = req.query;
  const target = url || filename;

  if (!target) {
    return res.status(400).json({ message: 'Filename or url is required' });
  }

  // Prevent directory traversal
  const safeFilename = path.basename(target as string);
  const filePath = path.join(process.cwd(), 'data', 'tradingview', safeFilename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'File not found' });
  }

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    let data = JSON.parse(fileContent);
    
    if (Array.isArray(data)) {
      // Chuyển đổi VND sang USD (tỉ giá 27000)
      data.forEach((item: any) => {
        if (item.price) {
          item.price = item.price / 27000;
        }
      });
    }
    
    // Range filtering
    const { range, limit, year } = req.query;
    
    if (Array.isArray(data)) {
        // Year filter has priority over range
        if (year && year !== 'All') {
            const years = (year as string).split(',');
            data = data.filter((item: any) => {
                if (item.date) {
                    return years.some(y => item.date.includes(y));
                }
                return false;
            });
        } else if (range && range !== 'All') {
            const now = Date.now();
            let days = 365; // Default 1Y
            
            if (range === '6M') days = 180;
            else if (range === '1Y') days = 365;
            else if (range === '3Y') days = 1095;
            
            const cutoff = now - (days * 24 * 60 * 60 * 1000);
            data = data.filter((item: any) => item.timestamp >= cutoff);
        }

        if (limit) {
            const n = parseInt(limit as string, 10);
            data = data.slice(-n);
        }
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error reading file:', error);
    return res.status(500).json({ message: 'Error reading file' });
  }
}
