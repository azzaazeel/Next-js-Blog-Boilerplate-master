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

  const safeSymbol = path.basename(target as string);
  const filePath = path.join(process.cwd(), 'data', 'json', safeSymbol);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Data not found' });
  }

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    let data = JSON.parse(fileContent);

    if (Array.isArray(data)) {
      // Chuyển đổi VND sang USD (tỉ giá 26500)
      data.forEach((item: any) => {
        if (item.price) {
          item.price = item.price / 26500;
        }
      });
      // 3 years = 1095 days approximately
      const dailyData = data.slice(-1095);
      // Filter to get weekly data points (every 7th day)
      // We count backwards from the most recent point to ensure it's included
      data = dailyData.filter((_, index) => (dailyData.length - 1 - index) % 7 === 0);
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
