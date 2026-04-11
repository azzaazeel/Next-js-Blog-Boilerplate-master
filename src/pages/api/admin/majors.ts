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
    const majorsFile = path.join(process.cwd(), 'reportings', 'CS2-Majors.md');
    
    if (!fs.existsSync(majorsFile)) {
      return res.status(200).json({ majors: [] });
    }

    const content = fs.readFileSync(majorsFile, 'utf8');
    const lines = content.split('\n');
    const majors = [];

    // Skip header and separator
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.includes(':---')) continue;

      const parts = line.split('|').map(p => p.trim()).filter(p => p !== '');
      if (parts.length < 7) continue;

      const name = parts[0];
      const dateRange = parts[1];
      const prize = parts[2];
      const location = parts[3];
      const teams = parts[4];
      const winner = parts[5];
      const runnerUp = parts[6];

      // Parse dateRange into start and end
      // Formats: 
      // "May 31 – Jun 20, 2027"
      // "May 09–22, 2022"
      // "Oct 31 – Nov 13, 2022"
      
      let startDateStr = '';
      let endDateStr = '';
      
      const yearMatch = dateRange.match(/,?\s+(\d{4})$/);
      const year = yearMatch ? yearMatch[1] : '';
      const datesOnly = dateRange.replace(/,?\s+\d{4}$/, '').trim();
      
      const separators = [' – ', '–', ' - '];
      let sep = separators.find(s => datesOnly.includes(s));
      
      if (sep) {
        const [startPart, endPart] = datesOnly.split(sep).map(s => s.trim());
        
        // Case: "May 09–22"
        if (!isNaN(parseInt(endPart)) && endPart.length <= 2) {
            const month = startPart.split(' ')[0];
            startDateStr = `${startPart} ${year}`;
            endDateStr = `${month} ${endPart} ${year}`;
        } else {
            // Case: "Oct 31 – Nov 13"
            startDateStr = `${startPart} ${year}`;
            endDateStr = `${endPart} ${year}`;
        }
      } else {
        startDateStr = `${datesOnly} ${year}`;
        endDateStr = `${datesOnly} ${year}`;
      }

      majors.push({
        name,
        dateRange,
        startDateStr,
        endDateStr,
        prize,
        location,
        teams,
        winner,
        runnerUp
      });
    }
    
    return res.status(200).json({ majors });
  } catch (error) {
    console.error('Error fetching majors:', error);
    return res.status(500).json({ message: 'Error fetching majors' });
  }
}
