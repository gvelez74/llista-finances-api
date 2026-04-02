// api/_db.js — Helper compartit per a Neon i CORS
import { neon } from '@neondatabase/serverless';

export function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL no configurada a les variables d\'entorn de Vercel');
  }
  return neon(process.env.DATABASE_URL);
}

// Afegeix headers CORS a la resposta i gestiona preflight OPTIONS
export function cors(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true; // indica que ja hem respòs
  }
  return false;
}
