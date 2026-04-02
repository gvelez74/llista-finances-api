// api/project.js — Retorna el projecte "Llista.cat"
import { getDb, cors } from './_db.js';

export default async function handler(req, res) {
  if (cors(req, res)) return;

  try {
    const sql = getDb();
    // Cerca el projecte pel nom (insensible a majúscules)
    const rows = await sql`
      SELECT id, name, year, responsible_id
      FROM projects
      WHERE LOWER(name) = LOWER('Llista.cat')
      LIMIT 1
    `;

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Projecte Llista.cat no trobat' });
    }

    res.status(200).json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
