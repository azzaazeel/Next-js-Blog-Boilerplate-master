import fs from 'fs';
import path from 'path';
import formidable from 'formidable';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const uploadDir = path.join(process.cwd(), 'public', 'media');
  
  // Ensure directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    filename: (name, ext, part, form) => {
        // Clean filename: remove spaces and special characters
        const originalName = part.originalFilename || 'upload';
        const cleanName = originalName.replace(/[^a-zA-Z0-9.]/g, '_').toLowerCase();
        return `${Date.now()}_${cleanName}`;
    }
  });

  try {
    const [fields, files] = await form.parse(req);
    const file = files.file ? files.file[0] : null;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filename = path.basename(file.filepath);
    const publicUrl = `/media/${filename}`;

    return res.status(200).json({ url: publicUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ message: 'Upload failed', error: (error as Error).message });
  }
}
