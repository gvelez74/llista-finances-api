-- ═══════════════════════════════════════════════════════════
-- SCRIPT SQL — Llista.cat Finances (Neon PostgreSQL)
-- Executa'l a: Neon Console > SQL Editor
-- ═══════════════════════════════════════════════════════════

-- Taula d'usuaris
CREATE TABLE IF NOT EXISTS app_users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  email         TEXT UNIQUE,
  role          TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('admin','editor','lector')),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Taula de projectes
CREATE TABLE IF NOT EXISTS projects (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  year            INTEGER DEFAULT EXTRACT(YEAR FROM NOW()),
  responsible_id  UUID REFERENCES app_users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Taula d'items de pressupost
CREATE TABLE IF NOT EXISTS budget_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type        TEXT NOT NULL CHECK (type IN ('income','expense')),
  is_budget   BOOLEAN NOT NULL DEFAULT TRUE,
  concept     TEXT NOT NULL DEFAULT '',
  description TEXT DEFAULT '',
  amount      NUMERIC(12,2) NOT NULL DEFAULT 0,
  month       INTEGER NOT NULL CHECK (month >= 0 AND month <= 11),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Índexs per rendiment
CREATE INDEX IF NOT EXISTS idx_budget_items_project ON budget_items(project_id);
CREATE INDEX IF NOT EXISTS idx_budget_items_month   ON budget_items(month);

-- ── Dades inicials ──
-- Insereix l'usuari admin
INSERT INTO app_users (name, email, role)
VALUES ('Admin Llista.cat', 'admin@llista.cat', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insereix el projecte Llista.cat (any actual)
INSERT INTO projects (name, year, responsible_id)
SELECT 'Llista.cat', EXTRACT(YEAR FROM NOW())::INTEGER, id
FROM app_users WHERE email = 'admin@llista.cat'
ON CONFLICT DO NOTHING;

-- ── Verificació ──
SELECT 'projects' as taula, COUNT(*) as registres FROM projects
UNION ALL
SELECT 'budget_items', COUNT(*) FROM budget_items
UNION ALL
SELECT 'app_users', COUNT(*) FROM app_users;
