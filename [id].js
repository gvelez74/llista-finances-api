// api/items/[id].js — PATCH (editar) i DELETE (eliminar) un item
import { getDb, cors } from '../_db.js';

export default async function handler(req, res) {
  if (cors(req, res)) return;

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'id és obligatori' });

  const sql = getDb();

  // PATCH /api/items/[id] — actualitza un item
  if (req.method === 'PATCH') {
    const { type, is_budget, concept, description, amount, month } = req.body;
    try {
      const rows = await sql`
        UPDATE budget_items
        SET
          type        = COALESCE(${type}, type),
          is_budget   = COALESCE(${is_budget}, is_budget),
          concept     = COALESCE(${concept}, concept),
          description = COALESCE(${description}, description),
          amount      = COALESCE(${amount}, amount),
          month       = COALESCE(${month}, month),
          updated_at  = NOW()
        WHERE id = ${id}
        RETURNING *
      `;
      if (rows.length === 0) return res.status(404).json({ error: 'Item no trobat' });
      res.status(200).json(rows[0]);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
    return;
  }

  // DELETE /api/items/[id] — elimina un item
  if (req.method === 'DELETE') {
    try {
      await sql`DELETE FROM budget_items WHERE id = ${id}`;
      res.status(200).json({ deleted: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
    return;
  }

  res.status(405).json({ error: 'Mètode no permès' });
}
