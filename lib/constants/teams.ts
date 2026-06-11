/**
 * Teams & Groups Structure - FIFA World Cup 2026
 * Mapeo oficial de 48 equipos distribuidos en 12 grupos (A-L)
 * Tipado y listo para usar en toda la aplicación
 */

export interface Team {
  id: string;           // Código FIFA 3 letras (PK)
  name: string;         // Nombre en español
  code: string;         // Código ISO
  flag: string;         // Emoji de bandera
  group: string;        // Grupo A-L
  fifa_ranking: number; // Ranking FIFA actual
  off_strength: number; // Fortaleza ofensiva (Poisson λ)
  def_strength: number; // Fortaleza defensiva (Poisson λ)
}

export interface Group {
  letter: string;
  teams: Team[];
}

/**
 * Array tipado de 48 equipos ordenados por grupo
 * Usado para seeding, validación y consultas rápidas
 */
export const WORLD_CUP_2026_TEAMS: Team[] = [
  // GRUPO A
  {
    id: "MEX",
    name: "México",
    code: "MEX",
    flag: "🇲🇽",
    group: "A",
    fifa_ranking: 15,
    off_strength: 1.4,
    def_strength: 1.0,
  },
  {
    id: "RSA",
    name: "Sudáfrica",
    code: "RSA",
    flag: "🇿🇦",
    group: "A",
    fifa_ranking: 62,
    off_strength: 1.1,
    def_strength: 1.2,
  },
  {
    id: "KOR",
    name: "República de Corea",
    code: "KOR",
    flag: "🇰🇷",
    group: "A",
    fifa_ranking: 22,
    off_strength: 1.4,
    def_strength: 1.0,
  },
  {
    id: "CZE",
    name: "Chequia",
    code: "CZE",
    flag: "🇨🇿",
    group: "A",
    fifa_ranking: 44,
    off_strength: 1.2,
    def_strength: 1.1,
  },

  // GRUPO B
  {
    id: "CAN",
    name: "Canadá",
    code: "CAN",
    flag: "🇨🇦",
    group: "B",
    fifa_ranking: 40,
    off_strength: 1.3,
    def_strength: 1.1,
  },
  {
    id: "BIH",
    name: "Bosnia y Herzegovina",
    code: "BIH",
    flag: "🇧🇦",
    group: "B",
    fifa_ranking: 48,
    off_strength: 1.1,
    def_strength: 1.1,
  },
  {
    id: "QAT",
    name: "Catar",
    code: "QAT",
    flag: "🇶🇦",
    group: "B",
    fifa_ranking: 54,
    off_strength: 1.0,
    def_strength: 1.2,
  },
  {
    id: "SUI",
    name: "Suiza",
    code: "SUI",
    flag: "🇨🇭",
    group: "B",
    fifa_ranking: 19,
    off_strength: 1.4,
    def_strength: 0.8,
  },

  // GRUPO C
  {
    id: "BRA",
    name: "Brasil",
    code: "BRA",
    flag: "🇧🇷",
    group: "C",
    fifa_ranking: 5,
    off_strength: 2.3,
    def_strength: 0.6,
  },
  {
    id: "MAR",
    name: "Marruecos",
    code: "MAR",
    flag: "🇲🇦",
    group: "C",
    fifa_ranking: 13,
    off_strength: 1.5,
    def_strength: 0.8,
  },
  {
    id: "HAI",
    name: "Haití",
    code: "HAI",
    flag: "🇭🇹",
    group: "C",
    fifa_ranking: 67,
    off_strength: 0.9,
    def_strength: 1.3,
  },
  {
    id: "SCO",
    name: "Escocia",
    code: "SCO",
    flag: "🇬🇧",
    group: "C",
    fifa_ranking: 37,
    off_strength: 1.2,
    def_strength: 1.0,
  },

  // GRUPO D
  {
    id: "USA",
    name: "Estados Unidos",
    code: "USA",
    flag: "🇺🇸",
    group: "D",
    fifa_ranking: 11,
    off_strength: 1.6,
    def_strength: 0.9,
  },
  {
    id: "PAR",
    name: "Paraguay",
    code: "PAR",
    flag: "🇵🇾",
    group: "D",
    fifa_ranking: 39,
    off_strength: 1.2,
    def_strength: 1.1,
  },
  {
    id: "AUS",
    name: "Australia",
    code: "AUS",
    flag: "🇦🇺",
    group: "D",
    fifa_ranking: 24,
    off_strength: 1.2,
    def_strength: 1.1,
  },
  {
    id: "TUR",
    name: "Turquía",
    code: "TUR",
    flag: "🇹🇷",
    group: "D",
    fifa_ranking: 26,
    off_strength: 1.5,
    def_strength: 1.0,
  },

  // GRUPO E
  {
    id: "GER",
    name: "Alemania",
    code: "GER",
    flag: "🇩🇪",
    group: "E",
    fifa_ranking: 16,
    off_strength: 2.1,
    def_strength: 0.9,
  },
  {
    id: "CUW",
    name: "Curazao",
    code: "CUW",
    flag: "🇨🇼",
    group: "E",
    fifa_ranking: 80,
    off_strength: 0.8,
    def_strength: 1.4,
  },
  {
    id: "CIV",
    name: "Costa de Marfil",
    code: "CIV",
    flag: "🇨🇮",
    group: "E",
    fifa_ranking: 35,
    off_strength: 1.3,
    def_strength: 1.0,
  },
  {
    id: "ECU",
    name: "Ecuador",
    code: "ECU",
    flag: "🇪🇨",
    group: "E",
    fifa_ranking: 27,
    off_strength: 1.4,
    def_strength: 0.8,
  },

  // GRUPO F
  {
    id: "NED",
    name: "Países Bajos",
    code: "NED",
    flag: "🇳🇱",
    group: "F",
    fifa_ranking: 7,
    off_strength: 2.0,
    def_strength: 0.7,
  },
  {
    id: "JPN",
    name: "Japón",
    code: "JPN",
    flag: "🇯🇵",
    group: "F",
    fifa_ranking: 17,
    off_strength: 1.7,
    def_strength: 0.8,
  },
  {
    id: "SWE",
    name: "Suecia",
    code: "SWE",
    flag: "🇸🇪",
    group: "F",
    fifa_ranking: 31,
    off_strength: 1.3,
    def_strength: 1.0,
  },
  {
    id: "TUN",
    name: "Túnez",
    code: "TUN",
    flag: "🇹🇳",
    group: "F",
    fifa_ranking: 47,
    off_strength: 1.0,
    def_strength: 1.1,
  },

  // GRUPO G
  {
    id: "BEL",
    name: "Bélgica",
    code: "BEL",
    flag: "🇧🇪",
    group: "G",
    fifa_ranking: 6,
    off_strength: 1.9,
    def_strength: 0.8,
  },
  {
    id: "EGY",
    name: "Egipto",
    code: "EGY",
    flag: "🇪🇬",
    group: "G",
    fifa_ranking: 36,
    off_strength: 1.2,
    def_strength: 1.0,
  },
  {
    id: "IRN",
    name: "República Islámica de Irán",
    code: "IRN",
    flag: "🇮🇷",
    group: "G",
    fifa_ranking: 20,
    off_strength: 1.3,
    def_strength: 1.0,
  },
  {
    id: "NZL",
    name: "Nueva Zelanda",
    code: "NZL",
    flag: "🇳🇿",
    group: "G",
    fifa_ranking: 74,
    off_strength: 0.9,
    def_strength: 1.4,
  },

  // GRUPO H
  {
    id: "ESP",
    name: "España",
    code: "ESP",
    flag: "🇪🇸",
    group: "H",
    fifa_ranking: 3,
    off_strength: 2.4,
    def_strength: 0.6,
  },
  {
    id: "CPV",
    name: "Islas de Cabo Verde",
    code: "CPV",
    flag: "🇨🇻",
    group: "H",
    fifa_ranking: 75,
    off_strength: 0.8,
    def_strength: 1.4,
  },
  {
    id: "KSA",
    name: "Arabia Saudí",
    code: "KSA",
    flag: "🇸🇦",
    group: "H",
    fifa_ranking: 56,
    off_strength: 1.0,
    def_strength: 1.3,
  },
  {
    id: "URU",
    name: "Uruguay",
    code: "URU",
    flag: "🇺🇾",
    group: "H",
    fifa_ranking: 14,
    off_strength: 1.8,
    def_strength: 0.8,
  },

  // GRUPO I
  {
    id: "FRA",
    name: "Francia",
    code: "FRA",
    flag: "🇫🇷",
    group: "I",
    fifa_ranking: 2,
    off_strength: 2.5,
    def_strength: 0.6,
  },
  {
    id: "SEN",
    name: "Senegal",
    code: "SEN",
    flag: "🇸🇳",
    group: "I",
    fifa_ranking: 18,
    off_strength: 1.4,
    def_strength: 0.9,
  },
  {
    id: "IRQ",
    name: "Irak",
    code: "IRQ",
    flag: "🇮🇶",
    group: "I",
    fifa_ranking: 58,
    off_strength: 1.0,
    def_strength: 1.3,
  },
  {
    id: "NOR",
    name: "Noruega",
    code: "NOR",
    flag: "🇳🇴",
    group: "I",
    fifa_ranking: 34,
    off_strength: 1.3,
    def_strength: 0.9,
  },

  // GRUPO J
  {
    id: "ARG",
    name: "Argentina",
    code: "ARG",
    flag: "🇦🇷",
    group: "J",
    fifa_ranking: 1,
    off_strength: 2.4,
    def_strength: 0.5,
  },
  {
    id: "ALG",
    name: "Argelia",
    code: "ALG",
    flag: "🇩🇿",
    group: "J",
    fifa_ranking: 43,
    off_strength: 1.2,
    def_strength: 1.1,
  },
  {
    id: "AUT",
    name: "Austria",
    code: "AUT",
    flag: "🇦🇹",
    group: "J",
    fifa_ranking: 23,
    off_strength: 1.5,
    def_strength: 0.9,
  },
  {
    id: "JOR",
    name: "Jordania",
    code: "JOR",
    flag: "🇯🇴",
    group: "J",
    fifa_ranking: 64,
    off_strength: 0.9,
    def_strength: 1.3,
  },

  // GRUPO K
  {
    id: "POR",
    name: "Portugal",
    code: "POR",
    flag: "🇵🇹",
    group: "K",
    fifa_ranking: 8,
    off_strength: 2.2,
    def_strength: 0.7,
  },
  {
    id: "COD",
    name: "República Democrática del Congo",
    code: "COD",
    flag: "🇨🇩",
    group: "K",
    fifa_ranking: 70,
    off_strength: 0.9,
    def_strength: 1.3,
  },
  {
    id: "UZB",
    name: "Uzbekistán",
    code: "UZB",
    flag: "🇺🇿",
    group: "K",
    fifa_ranking: 66,
    off_strength: 1.0,
    def_strength: 1.2,
  },
  {
    id: "COL",
    name: "Colombia",
    code: "COL",
    flag: "🇨🇴",
    group: "K",
    fifa_ranking: 12,
    off_strength: 1.7,
    def_strength: 0.8,
  },

  // GRUPO L
  {
    id: "ENG",
    name: "Inglaterra",
    code: "ENG",
    flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    group: "L",
    fifa_ranking: 4,
    off_strength: 2.3,
    def_strength: 0.7,
  },
  {
    id: "CRO",
    name: "Croacia",
    code: "CRO",
    flag: "🇭🇷",
    group: "L",
    fifa_ranking: 10,
    off_strength: 1.7,
    def_strength: 0.8,
  },
  {
    id: "GHA",
    name: "Ghana",
    code: "GHA",
    flag: "🇬🇭",
    group: "L",
    fifa_ranking: 50,
    off_strength: 1.2,
    def_strength: 1.1,
  },
  {
    id: "PAN",
    name: "Panamá",
    code: "PAN",
    flag: "🇵🇦",
    group: "L",
    fifa_ranking: 41,
    off_strength: 1.1,
    def_strength: 1.2,
  },
];

/**
 * Función helper: Obtener todos los equipos de un grupo específico
 */
export function getTeamsByGroup(groupLetter: string): Team[] {
  return WORLD_CUP_2026_TEAMS.filter((team) => team.group === groupLetter);
}

/**
 * Función helper: Obtener equipo por ID (código FIFA)
 */
export function getTeamById(teamId: string): Team | undefined {
  return WORLD_CUP_2026_TEAMS.find((team) => team.id === teamId);
}

/**
 * Función helper: Validar si un ID pertenece a un equipo oficial
 */
export function isValidTeamId(teamId: string): boolean {
  return WORLD_CUP_2026_TEAMS.some((team) => team.id === teamId);
}

/**
 * Mapa de grupos para acceso O(1)
 */
export const GROUPS_MAP: Record<string, Team[]> = {
  A: getTeamsByGroup("A"),
  B: getTeamsByGroup("B"),
  C: getTeamsByGroup("C"),
  D: getTeamsByGroup("D"),
  E: getTeamsByGroup("E"),
  F: getTeamsByGroup("F"),
  G: getTeamsByGroup("G"),
  H: getTeamsByGroup("H"),
  I: getTeamsByGroup("I"),
  J: getTeamsByGroup("J"),
  K: getTeamsByGroup("K"),
  L: getTeamsByGroup("L"),
};
