import { NextApiRequest, NextApiResponse } from 'next';

import { auth } from '../../../lib/auth';

// One-time setup endpoint - delete after use
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, password, name } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'email and password required' });

  try {
    const result = await auth.api.signUpEmail({
      body: { email, password, name: name || 'Admin' },
    });
    return res.status(200).json({ success: true, user: result?.user });
  } catch (e: any) {
    return res.status(400).json({ error: e.message });
  }
}
