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

  const uploadDir = path.join(process.cwd(), 'public', 'media');
  
  if (!fs.existsSync(uploadDir)) {
    return res.status(200).json({ files: [] });
  }

  try {
    const files = fs.readdirSync(uploadDir)
      .filter(f => !f.startsWith('.'))
      .map(f => {
        const stats = fs.statSync(path.join(uploadDir, f));
        return {
          name: f,
          url: `/media/${f}`,
          size: stats.size,
          mtime: stats.mtime
        };
      })
      .sort((a, b) => b.mtime.getTime() - a.mtime.getTime()); // Newest first

    return res.status(200).json({ files: files.slice(0, 50) });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to list media' });
  }
}
