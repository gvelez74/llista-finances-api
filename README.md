# llista-finances-api

API de pressupostos per al panell de Llista.cat (Accent Obert).
Connecta Neon PostgreSQL amb el panell HTML via Vercel serverless functions.

## Desplegament (5 passos)

### 1. Crea les taules a Neon
- Ves a [console.neon.tech](https://console.neon.tech)
- Selecciona el teu projecte → **SQL Editor**
- Copia i executa tot el contingut de `schema.sql`
- Verifica que surten 3 files al final (projects, budget_items, app_users)

### 2. Puja el codi a GitHub
```bash
git init
git add .
git commit -m "Llista.cat finances API"
git remote add origin https://github.com/EL-TEU-USUARI/llista-finances-api.git
git push -u origin main
```

### 3. Despliega a Vercel
- Ves a [vercel.com](https://vercel.com) → **New Project**
- Importa el repositori de GitHub
- Vercel detectarà automàticament el framework (Node.js)

### 4. Configura la variable d'entorn
A Vercel → Settings → **Environment Variables**, afegeix:
```
DATABASE_URL = postgres://user:password@ep-xxx.neon.tech/neondb?sslmode=require
```
La trobes a: Neon Console → el teu projecte → **Dashboard** → Connection string

### 5. Configura el panell
Al panell de Llista.cat → Finances → ⚙ Configuració:
- **URL de l'API**: `https://llista-finances-api.vercel.app` (la URL que et dona Vercel)
- Clica **Connectar**

## Endpoints

| Mètode | Endpoint | Descripció |
|--------|----------|------------|
| GET | `/api/project` | Retorna el projecte Llista.cat |
| GET | `/api/items?project_id=xxx` | Llista tots els items |
| POST | `/api/items` | Crea un nou item |
| PATCH | `/api/items/[id]` | Actualitza un item |
| DELETE | `/api/items/[id]` | Elimina un item |
