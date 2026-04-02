// api/items.js — GET (llista items) i POST (crear item)
import { getDb, cors } from './_db.js';

export default async function handler(req, res) {
  if (cors(req, res)) return;

  const sql = getDb();

  // GET /api/items?project_id=xxx — llista tots els items del projecte
  if (req.method === 'GET') {
    const { project_id } = req.query;
    if (!project_id) return res.status(400).json({ error: 'project_id és obligatori' });

    try {
      const rows = await sql`
        SELECT id, project_id, type, is_budget, concept, description, amount, month,
               created_at, updated_at
        FROM budget_items
        WHERE project_id = ${project_id}
        ORDER BY month ASC, created_at ASC
      `;
      res.status(200).json(rows);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
    return;
  }

  // POST /api/items — crea un nou item
  if (req.method === 'POST') {
    const { project_id, type, is_budget, concept, description, amount, month } = req.body;
    if (!project_id || !type || month === undefined) {
      return res.status(400).json({ error: 'Falten camps obligatoris: project_id, type, month' });
    }

    try {
      const rows = await sql`
        INSERT INTO budget_items (project_id, type, is_budget, concept, description, amount, month)
        VALUES (${project_id}, ${type}, ${is_budget ?? true}, ${concept || ''}, ${description || ''}, ${amount || 0}, ${month})
        RETURNING *
      `;
      res.status(201).json(rows[0]);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
    return;
  }

  res.status(405).json({ error: 'Mètode no permès' });
}
