import type { HeroDataRaw, HeroEntry, CompIndex, Role } from '../types'

const COMP_COUNT = 4

/** Flatten hero data into a list with role */
export function flattenHeroes(raw: HeroDataRaw): HeroEntry[] {
  const entries: HeroEntry[] = []
  for (const block of raw.data) {
    for (const row of block.rows) {
      entries.push({
        hero: row.hero,
        role: block.role,
        ratings: row.ratings,
      })
    }
  }
  return entries
}

export type PickStrategy = 'strength' | 'weakness' | 'balance'

/** Get composition sums for the 4 selected heroes (for strength/weakness/balance) */
function getCompositionSums(
  entries: HeroEntry[],
  heroNames: string[]
): [number, number, number, number] | null {
  const byName = new Map(entries.map((e) => [e.hero, e]))
  const selected = heroNames.map((n) => byName.get(n)).filter(Boolean) as HeroEntry[]
  if (selected.length !== 4) return null

  const sums: [number, number, number, number] = [0, 0, 0, 0]
  for (const e of selected) {
    for (let i = 0; i < COMP_COUNT; i++) sums[i] += e.ratings[i]
  }
  return sums
}

/** Get team composition index: strength = max sum, weakness = min sum */
export function getTeamCompositionIndex(
  entries: HeroEntry[],
  heroNames: string[],
  strategy: PickStrategy = 'strength'
): CompIndex | null {
  const sums = getCompositionSums(entries, heroNames)
  if (sums === null) return null

  if (strategy === 'strength') {
    let maxI = 0
    for (let i = 1; i < COMP_COUNT; i++) {
      if (sums[i] > sums[maxI]) maxI = i
    }
    return maxI as CompIndex
  }
  if (strategy === 'weakness') {
    let minI = 0
    for (let i = 1; i < COMP_COUNT; i++) {
      if (sums[i] < sums[minI]) minI = i
    }
    return minI as CompIndex
  }
  if (strategy === 'balance') {
    const indices: CompIndex[] = [0, 1, 2, 3]
    indices.sort((a, b) => sums[b] - sums[a])
    return indices[1]
  }
  return null
}

/** Required counts: 1 TANK, 2 DPS, 2 SUPPORT */
const REQUIRED: Record<HeroEntry['role'], number> = {
  TANK: 1,
  DPS: 2,
  SUPPORT: 2,
}

/** Infer the missing role from 4 picks. Returns null if selection is invalid. */
export function getMissingRole(
  entries: HeroEntry[],
  heroNames: string[]
): HeroEntry['role'] | null {
  const byName = new Map(entries.map((e) => [e.hero, e]))
  const selected = heroNames.map((n) => byName.get(n)).filter(Boolean) as HeroEntry[]
  if (selected.length !== 4) return null

  const counts = { TANK: 0, DPS: 0, SUPPORT: 0 }
  for (const e of selected) counts[e.role]++
  for (const [role, count] of Object.entries(REQUIRED)) {
    if (counts[role as Role] === count - 1) return role as HeroEntry['role']
  }
  return null
}

export interface Recommendation {
  hero: string
  role: HeroEntry['role']
  reason: string
}

/** Get recommended heroes for the missing slot (strength/weakness/balance). */
export function getRecommendations(
  entries: HeroEntry[],
  selectedNames: string[],
  topN: number,
  strategy: PickStrategy,
  compLabel: (i: CompIndex) => string,
  reasonTemplate: (compName: string, strategy: PickStrategy) => string
): Recommendation[] {
  const missingRole = getMissingRole(entries, selectedNames)
  if (missingRole === null) return []

  const compIndex = getTeamCompositionIndex(entries, selectedNames, strategy)
  if (compIndex === null) return []

  const selectedSet = new Set(selectedNames)
  const candidates = entries.filter(
    (e) => e.role === missingRole && !selectedSet.has(e.hero)
  )
  const compName = compLabel(compIndex)
  const reason = reasonTemplate(compName, strategy)

  candidates.sort((a, b) => b.ratings[compIndex] - a.ratings[compIndex])

  return candidates.slice(0, topN).map((e) => ({
    hero: e.hero,
    role: e.role,
    reason,
  }))
}
