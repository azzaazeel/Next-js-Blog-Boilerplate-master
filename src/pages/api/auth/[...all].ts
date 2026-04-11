import { toNodeHandler } from 'better-auth/node';

import { auth } from '../../../lib/auth';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: any, res: any) {
  // eslint-disable-next-line no-console
  console.log(`[Auth API] ${req.method} ${req.url}`);

  if (req.url) {
    let cleanUrl = req.url;
    if (cleanUrl.endsWith('/') && cleanUrl.length > 1) {
      cleanUrl = cleanUrl.slice(0, -1);
    }
    req.url = cleanUrl;
  }

  // Intercept sign-in request for ReCAPTCHA Enterprise validation
  if (req.url?.includes('/sign-in/email') && req.method === 'POST') {
    const token = req.headers['x-recaptcha-token'];
    
    if (!token) {
      return res.status(400).json({ error: 'ReCAPTCHA token missing' });
    }

    const projectId = process.env.RECAPTCHA_PROJECT_ID;
    const apiKey = process.env.RECAPTCHA_API_KEY;
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    
    const verifyUrl = `https://recaptchaenterprise.googleapis.com/v1/projects/${projectId}/assessments?key=${apiKey}`;
    
    return fetch(verifyUrl, { 
      method: 'POST',
      body: JSON.stringify({
        event: {
          token,
          siteKey,
          expectedAction: 'login'
        }
      })
    })
      .then(r => r.json())
      .then(data => {
        // In Enterprise v3/Score, we check if the assessment is valid and score is sufficient
        // Usually, a score >= 0.5 is considered safe.
        if (!data.tokenProperties?.valid) {
          return res.status(400).json({ error: `ReCAPTCHA invalid: ${data.tokenProperties?.invalidReason || 'Unknown error'}` });
        }
        
        // If it's a score-based key, we check the score. 
        // If it's a checkbox key, riskAnalysis might not have a score or it might be 1.0.
        if (data.riskAnalysis && data.riskAnalysis.score < 0.5) {
          return res.status(400).json({ error: 'ReCAPTCHA risk score too low' });
        }

        return toNodeHandler(auth.handler)(req, res);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('ReCAPTCHA Enterprise Error:', err);
        return res.status(500).json({ error: 'Internal server error during verification' });
      });
  }

  return toNodeHandler(auth.handler)(req, res);
}
