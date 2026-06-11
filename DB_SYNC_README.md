# 🌍 World Cup 2026 Database Sync

Solución completa para sincronizar tu base de datos con los **12 grupos oficiales** y **87 fixtures** del Mundial 2026.

---

## 📋 Archivos de Sincronización

| Archivo | Formato | Descripción |
|---------|---------|-------------|
| `scripts/world_cup_2026_sync.sql` | SQL (SQLite) | Script SQL directo para ejecutar en tu BD |
| `lib/db/world_cup_2026_seed.ts` | TypeScript | Función Node.js para ejecutar en desarrollo |

---

## 🚀 Opción 1: SQL Directo (Recomendado para Prod)

### Paso 1: Hacer backup
```bash
cp data.db data.db.backup
```

### Paso 2: Ejecutar el script SQL
#### Si usas SQLite directamente:
```bash
sqlite3 data.db < scripts/world_cup_2026_sync.sql
```

#### Si usas Supabase/Postgres:
1. Abre tu SQL Editor en Supabase
2. Copia el contenido de `scripts/world_cup_2026_sync.sql`
3. Pega en el editor
4. Ejecuta

---

## 🔧 Opción 2: TypeScript (Recomendado para Dev)

### Paso 1: Integrar en `lib/db/schema.ts`

Abre [lib/db/schema.ts](lib/db/schema.ts) y modifica la función `initDb()`:

```typescript
import { syncWorldCup2026Data } from "./world_cup_2026_seed";

export function initDb() {
  // ... (crear tablas)
  
  // Reemplazar seedData existente con sync
  const count = db.prepare("SELECT COUNT(*) as cnt FROM teams").get() as { cnt: number };
  if (count.cnt === 0) {
    console.log("[DB] Base de datos vacía, sincronizando datos del Mundial 2026...");
    syncWorldCup2026Data();
  }
}
```

### Paso 2: Ejecutar el seeding
```bash
# Opción A: Eliminar BD existente (recrea con seed)
rm data.db
pnpm dev

# Opción B: Script manual
npx ts-node lib/db/world_cup_2026_seed.ts
```

---

## 📊 Datos Sincronizados

### 48 Equipos en 12 Grupos Oficiales
- **GRUPO A**: México, Sudáfrica, República de Corea, Chequia
- **GRUPO B**: Canadá, Bosnia y Herzegovina, Catar, Suiza
- **GRUPO C**: Brasil, Marruecos, Haití, Escocia
- **GRUPO D**: EE.UU., Paraguay, Australia, Turquía
- **GRUPO E**: Alemania, Curazao, Costa de Marfil, Ecuador
- **GRUPO F**: Países Bajos, Japón, Suecia, Túnez
- **GRUPO G**: Bélgica, Egipto, RI de Irán, Nueva Zelanda
- **GRUPO H**: España, Islas de Cabo Verde, Arabia Saudí, Uruguay
- **GRUPO I**: Francia, Senegal, Irak, Noruega
- **GRUPO J**: Argentina, Argelia, Austria, Jordania
- **GRUPO K**: Portugal, RD Congo, Uzbekistán, Colombia
- **GRUPO L**: Inglaterra, Croacia, Ghana, Panamá

### 87 Fixtures
- **72 partidos**: Fase de Grupos (6 por grupo, IDs 1-72)
- **15 partidos**: Knockouts
  - 8 Octavos (IDs 73-80)
  - 4 Cuartos (IDs 81-84)
  - 2 Semis (IDs 85-86)
  - 1 Final (ID 87)

### 21 Jugadores Clave
Predicción de goleadores para top scorers por equipo

---

## ✅ Verificación Post-Sync

Después de ejecutar cualquier opción, verifica en tu BD:

```sql
-- Contar equipos por grupo
SELECT group_letter, COUNT(*) FROM teams GROUP BY group_letter;
-- Debe retornar 12 filas, cada una con count = 4

-- Contar fixtures
SELECT COUNT(*) FROM fixtures;
-- Debe retornar 87

-- Ver fixture con ID 87 (Final)
SELECT * FROM fixtures WHERE id = 87;
-- home_team_id = 'F1', away_team_id = 'F2', round = 'Final'
```

---

## 🐛 Si Algo Sale Mal

### Error: "Table already exists"
Limpia manualmente:
```sql
DELETE FROM predictions;
DELETE FROM fixtures;
DELETE FROM players;
DELETE FROM tournament_sims;
DELETE FROM teams;
```

### Error: Foreign key constraint
Desactiva temporalmente en SQLite:
```sql
PRAGMA foreign_keys = OFF;
-- (ejecuta el script)
PRAGMA foreign_keys = ON;
```

### Verificar IDs de fixtures
```sql
SELECT id, home_team_id, away_team_id, round FROM fixtures ORDER BY id;
```

---

## 📝 Próximos Pasos

1. ✅ Ejecuta uno de los métodos de sincronización
2. ✅ Verifica los datos
3. 🔄 Recalcula predicciones:
   ```bash
   pnpm cron:run
   ```
4. 🧪 Prueba rutas dinámicas:
   ```
   http://localhost:3000/match/1    # Grupo A: MEX vs RSA
   http://localhost:3000/match/87   # Final
   ```

---

## 📞 Soporte

Si `/match/[id]` sigue retornando `null`:
1. Verifica que `lib/actions.ts` tenga `getFixtureDetail(id)` actualizado
2. Revisa console logs para ver qué fixture_id se está solicitando
3. Confirma que existe en BD con el ID correcto

---

**Última actualización**: 2026 DB Sync v1.0
