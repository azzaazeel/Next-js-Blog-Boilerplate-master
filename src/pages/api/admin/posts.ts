import fs from 'fs';
import path from 'path';

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { filename } = req.query;
    if (filename) {
      const fullPath = path.join(process.cwd(), filename as string);
      if (fs.existsSync(fullPath)) {
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        return res.status(200).json({ content: fileContents });
      }
      return res.status(404).json({ message: 'File not found' });
    }
    let allFiles: string[] = [];
    const folders = ['_articles', '_tweets', '_insights'];
    folders.forEach((dir) => {
      const dirPath = path.join(process.cwd(), dir);
      if (fs.existsSync(dirPath)) {
        const files = fs
          .readdirSync(dirPath)
          .filter((f) => f.endsWith('.md'))
          .map((f) => `${dir}/${f}`);
        allFiles = [...allFiles, ...files];
      }
    });
    allFiles.sort().reverse();
    return res.status(200).json({ files: allFiles });
  }

  if (req.method === 'POST') {
    const { filename, content } = req.body;
    if (!filename || !content) {
      return res.status(400).json({ message: 'Missing filename or content' });
    }
    const fullPath = path.join(process.cwd(), filename);
    fs.writeFileSync(fullPath, content, 'utf8');

    // Attempt to revalidate cache after saving
    try {
      // 1. Revalidate homepage
      await res.revalidate('/');

      // 2. Revalidate specific category and post
      const [category, filenameWithExt] = filename.split('/');
      const slug = filenameWithExt.replace('.md', '');
      const folderToRoute: Record<string, string> = {
        _articles: 'articles',
        _tweets: 'tweets',
        _insights: 'insights',
      };

      if (folderToRoute[category]) {
        if (folderToRoute[category]) {
          await res.revalidate(`/${folderToRoute[category]}`);
        }
        await res.revalidate(`/${folderToRoute[category]}/${slug}`);
      }
    } catch (err) {
      console.error('Revalidation error:', err);
    }

    return res.status(200).json({ message: 'Saved and cache invalidated' });
  }

  if (req.method === 'DELETE') {
    const { filename } = req.body;
    if (!filename) {
      return res.status(400).json({ message: 'Missing filename' });
    }
    const fullPath = path.join(process.cwd(), filename);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);

      // Revalidate homepage and category index after delete
      try {
        await res.revalidate('/');
        const [category] = filename.split('/');
        const folderToRoute: Record<string, string> = {
          _articles: 'articles',
          _tweets: 'tweets',
          _insights: 'insights',
        };
        if (folderToRoute[category]) {
          await res.revalidate(`/${folderToRoute[category]}`);
        }
      } catch (err) {
        console.error('Revalidation error:', err);
      }

      return res.status(200).json({ message: 'Deleted successfully' });
    }
    return res.status(404).json({ message: 'File not found' });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
