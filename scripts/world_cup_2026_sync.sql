-- ============================================================================
-- WORLD CUP 2026 DATABASE SYNC SCRIPT
-- Sincronización de 12 grupos y partidos de fase de grupos
-- ============================================================================
-- ⚠️  ADVERTENCIA: Este script limpiará las tablas actuales y regenerará los datos
-- Ejecutar en: SQLite o adaptar para Postgres/Supabase

-- Step 1: Limpiar tablas existentes (BACKUP RECOMENDADO)
DELETE FROM predictions;
DELETE FROM fixtures;
DELETE FROM players;
DELETE FROM tournament_sims;
DELETE FROM teams;

-- Step 2: Insertar 48 equipos con grupos CORRECTOS
INSERT INTO teams (id, name, code, flag, group_letter, fifa_ranking, off_strength, def_strength) VALUES
-- GRUPO A: México, Sudáfrica, República de Corea, Chequia
('MEX', 'México', 'MEX', '🇲🇽', 'A', 15, 1.4, 1.0),
('RSA', 'Sudáfrica', 'RSA', '🇿🇦', 'A', 62, 1.1, 1.2),
('KOR', 'República de Corea', 'KOR', '🇰🇷', 'A', 22, 1.4, 1.0),
('CZE', 'Chequia', 'CZE', '🇨🇿', 'A', 44, 1.2, 1.1),

-- GRUPO B: Canadá, Bosnia y Herzegovina, Catar, Suiza
('CAN', 'Canadá', 'CAN', '🇨🇦', 'B', 40, 1.3, 1.1),
('BIH', 'Bosnia y Herzegovina', 'BIH', '🇧🇦', 'B', 48, 1.1, 1.1),
('QAT', 'Catar', 'QAT', '🇶🇦', 'B', 54, 1.0, 1.2),
('SUI', 'Suiza', 'SUI', '🇨🇭', 'B', 19, 1.4, 0.8),

-- GRUPO C: Brasil, Marruecos, Haití, Escocia
('BRA', 'Brasil', 'BRA', '🇧🇷', 'C', 5, 2.3, 0.6),
('MAR', 'Marruecos', 'MAR', '🇲🇦', 'C', 13, 1.5, 0.8),
('HAI', 'Haití', 'HAI', '🇭🇹', 'C', 67, 0.9, 1.3),
('SCO', 'Escocia', 'SCO', '🇬🇧', 'C', 37, 1.2, 1.0),

-- GRUPO D: EE.UU., Paraguay, Australia, Turquía
('USA', 'Estados Unidos', 'USA', '🇺🇸', 'D', 11, 1.6, 0.9),
('PAR', 'Paraguay', 'PAR', '🇵🇾', 'D', 39, 1.2, 1.1),
('AUS', 'Australia', 'AUS', '🇦🇺', 'D', 24, 1.2, 1.1),
('TUR', 'Turquía', 'TUR', '🇹🇷', 'D', 26, 1.5, 1.0),

-- GRUPO E: Alemania, Curazao, Costa de Marfil, Ecuador
('GER', 'Alemania', 'GER', '🇩🇪', 'E', 16, 2.1, 0.9),
('CUW', 'Curazao', 'CUW', '🇨🇼', 'E', 80, 0.8, 1.4),
('CIV', 'Costa de Marfil', 'CIV', '🇨🇮', 'E', 35, 1.3, 1.0),
('ECU', 'Ecuador', 'ECU', '🇪🇨', 'E', 27, 1.4, 0.8),

-- GRUPO F: Países Bajos, Japón, Suecia, Túnez
('NED', 'Países Bajos', 'NED', '🇳🇱', 'F', 7, 2.0, 0.7),
('JPN', 'Japón', 'JPN', '🇯🇵', 'F', 17, 1.7, 0.8),
('SWE', 'Suecia', 'SWE', '🇸🇪', 'F', 31, 1.3, 1.0),
('TUN', 'Túnez', 'TUN', '🇹🇳', 'F', 47, 1.0, 1.1),

-- GRUPO G: Bélgica, Egipto, RI de Irán, Nueva Zelanda
('BEL', 'Bélgica', 'BEL', '🇧🇪', 'G', 6, 1.9, 0.8),
('EGY', 'Egipto', 'EGY', '🇪🇬', 'G', 36, 1.2, 1.0),
('IRN', 'República Islámica de Irán', 'IRN', '🇮🇷', 'G', 20, 1.3, 1.0),
('NZL', 'Nueva Zelanda', 'NZL', '🇳🇿', 'G', 74, 0.9, 1.4),

-- GRUPO H: España, Islas de Cabo Verde, Arabia Saudí, Uruguay
('ESP', 'España', 'ESP', '🇪🇸', 'H', 3, 2.4, 0.6),
('CPV', 'Islas de Cabo Verde', 'CPV', '🇨🇻', 'H', 75, 0.8, 1.4),
('KSA', 'Arabia Saudí', 'KSA', '🇸🇦', 'H', 56, 1.0, 1.3),
('URU', 'Uruguay', 'URU', '🇺🇾', 'H', 14, 1.8, 0.8),

-- GRUPO I: Francia, Senegal, Irak, Noruega
('FRA', 'Francia', 'FRA', '🇫🇷', 'I', 2, 2.5, 0.6),
('SEN', 'Senegal', 'SEN', '🇸🇳', 'I', 18, 1.4, 0.9),
('IRQ', 'Irak', 'IRQ', '🇮🇶', 'I', 58, 1.0, 1.3),
('NOR', 'Noruega', 'NOR', '🇳🇴', 'I', 34, 1.3, 0.9),

-- GRUPO J: Argentina, Argelia, Austria, Jordania
('ARG', 'Argentina', 'ARG', '🇦🇷', 'J', 1, 2.4, 0.5),
('ALG', 'Argelia', 'ALG', '🇩🇿', 'J', 43, 1.2, 1.1),
('AUT', 'Austria', 'AUT', '🇦🇹', 'J', 23, 1.5, 0.9),
('JOR', 'Jordania', 'JOR', '🇯🇴', 'J', 64, 0.9, 1.3),

-- GRUPO K: Portugal, RD Congo, Uzbekistán, Colombia
('POR', 'Portugal', 'POR', '🇵🇹', 'K', 8, 2.2, 0.7),
('COD', 'República Democrática del Congo', 'COD', '🇨🇩', 'K', 70, 0.9, 1.3),
('UZB', 'Uzbekistán', 'UZB', '🇺🇿', 'K', 66, 1.0, 1.2),
('COL', 'Colombia', 'COL', '🇨🇴', 'K', 12, 1.7, 0.8),

-- GRUPO L: Inglaterra, Croacia, Ghana, Panamá
('ENG', 'Inglaterra', 'ENG', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'L', 4, 2.3, 0.7),
('CRO', 'Croacia', 'CRO', '🇭🇷', 'L', 10, 1.7, 0.8),
('GHA', 'Ghana', 'GHA', '🇬🇭', 'L', 50, 1.2, 1.1),
('PAN', 'Panamá', 'PAN', '🇵🇦', 'L', 41, 1.1, 1.2);

-- Step 3: Insertar FIXTURES (Fase de Grupos - 48 partidos, 6 por grupo)
-- Cada grupo tiene 6 partidos: 4C2 = 6 combinaciones
-- Estructura: id autoincrement empezará en 1

-- GRUPO A (Match IDs: 1-6)
INSERT INTO fixtures (home_team_id, away_team_id, date, status, group_letter, round) VALUES
('MEX', 'RSA', '2026-06-09', 'scheduled', 'A', 'Group'),
('KOR', 'CZE', '2026-06-10', 'scheduled', 'A', 'Group'),
('MEX', 'KOR', '2026-06-13', 'scheduled', 'A', 'Group'),
('RSA', 'CZE', '2026-06-14', 'scheduled', 'A', 'Group'),
('CZE', 'MEX', '2026-06-18', 'scheduled', 'A', 'Group'),
('RSA', 'KOR', '2026-06-19', 'scheduled', 'A', 'Group'),

-- GRUPO B (Match IDs: 7-12)
INSERT INTO fixtures (home_team_id, away_team_id, date, status, group_letter, round) VALUES
('CAN', 'BIH', '2026-06-10', 'scheduled', 'B', 'Group'),
('QAT', 'SUI', '2026-06-11', 'scheduled', 'B', 'Group'),
('CAN', 'QAT', '2026-06-14', 'scheduled', 'B', 'Group'),
('BIH', 'SUI', '2026-06-15', 'scheduled', 'B', 'Group'),
('SUI', 'CAN', '2026-06-19', 'scheduled', 'B', 'Group'),
('BIH', 'QAT', '2026-06-20', 'scheduled', 'B', 'Group'),

-- GRUPO C (Match IDs: 13-18)
INSERT INTO fixtures (home_team_id, away_team_id, date, status, group_letter, round) VALUES
('BRA', 'MAR', '2026-06-09', 'scheduled', 'C', 'Group'),
('HAI', 'SCO', '2026-06-10', 'scheduled', 'C', 'Group'),
('BRA', 'HAI', '2026-06-14', 'scheduled', 'C', 'Group'),
('MAR', 'SCO', '2026-06-14', 'scheduled', 'C', 'Group'),
('SCO', 'BRA', '2026-06-18', 'scheduled', 'C', 'Group'),
('MAR', 'HAI', '2026-06-19', 'scheduled', 'C', 'Group'),

-- GRUPO D (Match IDs: 19-24)
INSERT INTO fixtures (home_team_id, away_team_id, date, status, group_letter, round) VALUES
('USA', 'PAR', '2026-06-11', 'scheduled', 'D', 'Group'),
('AUS', 'TUR', '2026-06-12', 'scheduled', 'D', 'Group'),
('USA', 'AUS', '2026-06-16', 'scheduled', 'D', 'Group'),
('PAR', 'TUR', '2026-06-16', 'scheduled', 'D', 'Group'),
('TUR', 'USA', '2026-06-20', 'scheduled', 'D', 'Group'),
('PAR', 'AUS', '2026-06-20', 'scheduled', 'D', 'Group'),

-- GRUPO E (Match IDs: 25-30)
INSERT INTO fixtures (home_team_id, away_team_id, date, status, group_letter, round) VALUES
('GER', 'CUW', '2026-06-12', 'scheduled', 'E', 'Group'),
('CIV', 'ECU', '2026-06-12', 'scheduled', 'E', 'Group'),
('GER', 'CIV', '2026-06-16', 'scheduled', 'E', 'Group'),
('CUW', 'ECU', '2026-06-16', 'scheduled', 'E', 'Group'),
('ECU', 'GER', '2026-06-20', 'scheduled', 'E', 'Group'),
('CUW', 'CIV', '2026-06-20', 'scheduled', 'E', 'Group'),

-- GRUPO F (Match IDs: 31-36)
INSERT INTO fixtures (home_team_id, away_team_id, date, status, group_letter, round) VALUES
('NED', 'JPN', '2026-06-13', 'scheduled', 'F', 'Group'),
('SWE', 'TUN', '2026-06-13', 'scheduled', 'F', 'Group'),
('NED', 'SWE', '2026-06-17', 'scheduled', 'F', 'Group'),
('JPN', 'TUN', '2026-06-17', 'scheduled', 'F', 'Group'),
('TUN', 'NED', '2026-06-21', 'scheduled', 'F', 'Group'),
('JPN', 'SWE', '2026-06-21', 'scheduled', 'F', 'Group'),

-- GRUPO G (Match IDs: 37-42)
INSERT INTO fixtures (home_team_id, away_team_id, date, status, group_letter, round) VALUES
('BEL', 'EGY', '2026-06-13', 'scheduled', 'G', 'Group'),
('IRN', 'NZL', '2026-06-13', 'scheduled', 'G', 'Group'),
('BEL', 'IRN', '2026-06-17', 'scheduled', 'G', 'Group'),
('EGY', 'NZL', '2026-06-17', 'scheduled', 'G', 'Group'),
('NZL', 'BEL', '2026-06-21', 'scheduled', 'G', 'Group'),
('EGY', 'IRN', '2026-06-21', 'scheduled', 'G', 'Group'),

-- GRUPO H (Match IDs: 43-48)
INSERT INTO fixtures (home_team_id, away_team_id, date, status, group_letter, round) VALUES
('ESP', 'CPV', '2026-06-13', 'scheduled', 'H', 'Group'),
('KSA', 'URU', '2026-06-13', 'scheduled', 'H', 'Group'),
('ESP', 'KSA', '2026-06-17', 'scheduled', 'H', 'Group'),
('CPV', 'URU', '2026-06-18', 'scheduled', 'H', 'Group'),
('URU', 'ESP', '2026-06-22', 'scheduled', 'H', 'Group'),
('CPV', 'KSA', '2026-06-22', 'scheduled', 'H', 'Group'),

-- GRUPO I (Match IDs: 49-54)
INSERT INTO fixtures (home_team_id, away_team_id, date, status, group_letter, round) VALUES
('FRA', 'SEN', '2026-06-09', 'scheduled', 'I', 'Group'),
('IRQ', 'NOR', '2026-06-09', 'scheduled', 'I', 'Group'),
('FRA', 'IRQ', '2026-06-14', 'scheduled', 'I', 'Group'),
('SEN', 'NOR', '2026-06-14', 'scheduled', 'I', 'Group'),
('NOR', 'FRA', '2026-06-18', 'scheduled', 'I', 'Group'),
('SEN', 'IRQ', '2026-06-18', 'scheduled', 'I', 'Group'),

-- GRUPO J (Match IDs: 55-60)
INSERT INTO fixtures (home_team_id, away_team_id, date, status, group_letter, round) VALUES
('ARG', 'ALG', '2026-06-09', 'scheduled', 'J', 'Group'),
('AUT', 'JOR', '2026-06-10', 'scheduled', 'J', 'Group'),
('ARG', 'AUT', '2026-06-15', 'scheduled', 'J', 'Group'),
('ALG', 'JOR', '2026-06-15', 'scheduled', 'J', 'Group'),
('JOR', 'ARG', '2026-06-19', 'scheduled', 'J', 'Group'),
('ALG', 'AUT', '2026-06-19', 'scheduled', 'J', 'Group'),

-- GRUPO K (Match IDs: 61-66)
INSERT INTO fixtures (home_team_id, away_team_id, date, status, group_letter, round) VALUES
('POR', 'COD', '2026-06-11', 'scheduled', 'K', 'Group'),
('UZB', 'COL', '2026-06-12', 'scheduled', 'K', 'Group'),
('POR', 'UZB', '2026-06-16', 'scheduled', 'K', 'Group'),
('COD', 'COL', '2026-06-16', 'scheduled', 'K', 'Group'),
('COL', 'POR', '2026-06-20', 'scheduled', 'K', 'Group'),
('COD', 'UZB', '2026-06-20', 'scheduled', 'K', 'Group'),

-- GRUPO L (Match IDs: 67-72)
INSERT INTO fixtures (home_team_id, away_team_id, date, status, group_letter, round) VALUES
('ENG', 'CRO', '2026-06-08', 'scheduled', 'L', 'Group'),
('GHA', 'PAN', '2026-06-08', 'scheduled', 'L', 'Group'),
('ENG', 'GHA', '2026-06-13', 'scheduled', 'L', 'Group'),
('CRO', 'PAN', '2026-06-13', 'scheduled', 'L', 'Group'),
('PAN', 'ENG', '2026-06-17', 'scheduled', 'L', 'Group'),
('CRO', 'GHA', '2026-06-17', 'scheduled', 'L', 'Group');

-- Step 4: Insertar FIXTURES de Knockouts (Octavos de Final, Cuartos, Semis, Final)
-- IDs começando en 73 (después de los 72 de grupos)
-- Octavos: 8 partidos (IDs 73-80)
INSERT INTO fixtures (home_team_id, away_team_id, date, status, group_letter, round) VALUES
('A1', 'B2', '2026-06-22', 'scheduled', '', 'Round of 16'),  -- 73
('A2', 'B1', '2026-06-23', 'scheduled', '', 'Round of 16'),  -- 74
('C1', 'D2', '2026-06-23', 'scheduled', '', 'Round of 16'),  -- 75
('C2', 'D1', '2026-06-24', 'scheduled', '', 'Round of 16'),  -- 76
('E1', 'F2', '2026-06-24', 'scheduled', '', 'Round of 16'),  -- 77
('E2', 'F1', '2026-06-25', 'scheduled', '', 'Round of 16'),  -- 78
('G1', 'H2', '2026-06-25', 'scheduled', '', 'Round of 16'),  -- 79
('G2', 'H1', '2026-06-26', 'scheduled', '', 'Round of 16');  -- 80

-- Cuartos: 4 partidos (IDs 81-84)
INSERT INTO fixtures (home_team_id, away_team_id, date, status, group_letter, round) VALUES
('W73', 'W74', '2026-06-27', 'scheduled', '', 'Quarter-final'),  -- 81
('W75', 'W76', '2026-06-27', 'scheduled', '', 'Quarter-final'),  -- 82
('W77', 'W78', '2026-06-28', 'scheduled', '', 'Quarter-final'),  -- 83
('W79', 'W80', '2026-06-28', 'scheduled', '', 'Quarter-final');  -- 84

-- Semis: 2 partidos (IDs 85-86)
INSERT INTO fixtures (home_team_id, away_team_id, date, status, group_letter, round) VALUES
('W81', 'W82', '2026-07-01', 'scheduled', '', 'Semi-final'),  -- 85
('W83', 'W84', '2026-07-01', 'scheduled', '', 'Semi-final');  -- 86

-- Final: 1 partido (ID 87)
INSERT INTO fixtures (home_team_id, away_team_id, date, status, group_letter, round) VALUES
('W85', 'W86', '2026-07-09', 'scheduled', '', 'Final');  -- 87

-- Step 5: Insertar jugadores clave para predicción de goleadores
INSERT INTO players (team_id, name, position, goal_ratio) VALUES
('ARG', 'Lionel Messi', 'FW', 0.012),
('ARG', 'Lautaro Martínez', 'FW', 0.009),
('ARG', 'Julián Álvarez', 'FW', 0.008),
('FRA', 'Kylian Mbappé', 'FW', 0.013),
('FRA', 'Antoine Griezmann', 'MF', 0.006),
('FRA', 'Olivier Giroud', 'FW', 0.008),
('BRA', 'Vinícius Júnior', 'FW', 0.009),
('BRA', 'Rodrygo', 'FW', 0.007),
('BRA', 'Raphinha', 'FW', 0.006),
('ENG', 'Harry Kane', 'FW', 0.012),
('ENG', 'Bukayo Saka', 'FW', 0.008),
('ENG', 'Jude Bellingham', 'MF', 0.007),
('POR', 'Cristiano Ronaldo', 'FW', 0.011),
('POR', 'Bruno Fernandes', 'MF', 0.007),
('ESP', 'Lamine Yamal', 'FW', 0.006),
('ESP', 'Álvaro Morata', 'FW', 0.008),
('ESP', 'Nico Williams', 'FW', 0.007),
('COL', 'Luis Díaz', 'FW', 0.007),
('COL', 'James Rodríguez', 'MF', 0.005),
('USA', 'Christian Pulisic', 'FW', 0.007),
('URU', 'Darwin Núñez', 'FW', 0.009),
('GER', 'Jamal Musiala', 'MF', 0.007),
('GER', 'Kai Havertz', 'FW', 0.008),
('NED', 'Memphis Depay', 'FW', 0.008),
('MEX', 'Raúl Jiménez', 'FW', 0.007),
('AUT', 'Christoph Baumgartner', 'MF', 0.006),
('NOR', 'Erling Haaland', 'FW', 0.014),
('SEN', 'Sadio Mané', 'FW', 0.009);

-- ============================================================================
-- FIN DEL SCRIPT
-- ============================================================================
-- Si ejecutas en Supabase/Postgres, reemplaza AUTOINCREMENT con GENERATED ALWAYS AS IDENTITY
-- Verifica que los fixtures se generen con IDs 1-87 correctamente
-- ============================================================================
