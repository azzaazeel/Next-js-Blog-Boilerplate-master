import fs from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '../../../lib/auth'; // Giả định path auth

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Kiểm tra session (nếu cần bảo mật trang admin)
  // const session = await auth.api.getSession({ headers: req.headers });
  // if (!session) return res.status(401).json({ error: 'Unauthorized' });

  const { url } = req.query;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  // Tên file performance tương ứng
  const performanceFilename = url.replace('.json', '_performance.json');
  const filePath = path.join(process.cwd(), 'data', 'tradingview-other', performanceFilename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Performance data not found' });
  }

  try {
    const data = fs.readFileSync(filePath, 'utf8');
    res.status(200).json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Failed to read performance data' });
  }
}
