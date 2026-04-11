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
    const casesFile = path.join(process.cwd(), 'data', 'skins', 'CS2-Cases.md');
    
    if (!fs.existsSync(casesFile)) {
      return res.status(200).json({ cases: [] });
    }

    const content = fs.readFileSync(casesFile, 'utf8');
    const lines = content.split('\n');
    const cases = [];

    const monthMap: Record<string, string> = {
      'January': 'Jan', 'February': 'Feb', 'March': 'Mar', 'April': 'Apr',
      'May': 'May', 'June': 'Jun', 'July': 'Jul', 'August': 'Aug',
      'September': 'Sep', 'October': 'Oct', 'November': 'Nov', 'December': 'Dec'
    };

    const normalizeDate = (dateStr: string) => {
      if (!dateStr || dateStr === 'TBD') return '';
      
      if (dateStr.includes('-')) {
        const [y, m, d] = dateStr.split('-');
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${monthNames[parseInt(m) - 1]} ${d.padStart(2, '0')} ${y}`;
      }

      const match = dateStr.match(/(\w+)\s+(\d+)(?:st|nd|rd|th)?,?\s+(\d{4})/);
      if (match) {
        const [_, month, day, year] = match;
        const shortMonth = monthMap[month as keyof typeof monthMap] || month.slice(0, 3);
        return `${shortMonth} ${day.padStart(2, '0')} ${year}`;
      }
      return dateStr;
    };

    const skinsDir = path.join(process.cwd(), 'public', 'skins', 'weapon-cases');

    // Skip header and separator
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line.includes(':---')) continue;

        const parts = line.split('|').map(p => p.trim()).filter(p => p !== '');
        if (parts.length < 3 || parts[0] === 'Name') continue;

        const name = parts[0];
        const releasedDate = parts[1];
        const discontinuedDate = parts[2];
        const imageName = parts[3] !== 'NA' ? parts[3] : '';

        let image = '';
        if (imageName) {
          const imagePath = path.join(skinsDir, imageName);
          if (fs.existsSync(imagePath)) {
            image = `/skins/weapon-cases/${imageName}`;
          }
        }

        const startDateStr = normalizeDate(releasedDate);
        let endDateStr = '';
        
        if (discontinuedDate === 'TBD') {
          const now = new Date();
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          endDateStr = `${monthNames[now.getMonth()]} ${String(now.getDate()).padStart(2, '0')} ${now.getFullYear()}`;
        } else {
          endDateStr = normalizeDate(discontinuedDate);
        }

        cases.push({
            name,
            releasedDate,
            discontinuedDate,
            startDateStr,
            endDateStr,
            image
        });
    }
    
    return res.status(200).json({ cases });
  } catch (error) {
    console.error('Error fetching cases:', error);
    return res.status(500).json({ message: 'Error fetching cases' });
  }
}
