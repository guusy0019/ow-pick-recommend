export type Role = 'TANK' | 'DPS' | 'SUPPORT'

export interface HeroRow {
  row_index: number
  hero: string
  ratings: [number, number, number, number]
}

export interface RoleBlock {
  role: Role
  archetype: string
  rows: HeroRow[]
}

export interface HeroDataRaw {
  columns: [string, string, string, string]
  data: RoleBlock[]
}

/** Flattened hero entry with role for lookup */
export interface HeroEntry {
  hero: string
  role: Role
  ratings: [number, number, number, number]
}

/** Composition type key (index 0–3). Labels are provided by i18n (compDive, compRush, compPoke, compAnchor). */
export type CompIndex = 0 | 1 | 2 | 3
