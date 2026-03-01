import { useState } from "react"
import type { HeroDataRaw, HeroEntry } from "./types"
import {
  type PickStrategy,
  flattenHeroes,
  getRecommendations,
} from "./lib/hero"
import { getHeroIconUrl } from "./lib/hero-icons"
import { getHeroDisplayName } from "./lib/hero-names"
import { useI18n } from "./i18n/context"
import heroData from "@/data/hero.json"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { HeroSelect } from "@/components/hero-select"
import { Badge } from "@/components/ui/badge"

const DEFAULT_TOP_N = 3
const MAX_TOP_N = 10

function getSlotRoles(
  myRole: HeroEntry["role"] | null,
): HeroEntry["role"][] | null {
  if (myRole === null) return null
  switch (myRole) {
    case "TANK":
      return ["DPS", "DPS", "SUPPORT", "SUPPORT"]
    case "DPS":
      return ["TANK", "DPS", "SUPPORT", "SUPPORT"]
    case "SUPPORT":
      return ["TANK", "DPS", "DPS", "SUPPORT"]
    default:
      return null
  }
}

const initialEntries = flattenHeroes(heroData as HeroDataRaw)

const PICK_STRATEGY_VALUES: PickStrategy[] = [
  "strength",
  "weakness",
  "balance",
]

export default function App() {
  const { t, compLabel, roleLabel, locale, setLocale } = useI18n()
  const [entries] = useState<HeroEntry[]>(initialEntries)
  const [myRole, setMyRole] = useState<HeroEntry["role"] | null>(null)
  const [picks, setPicks] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
  ])
  const [topN, setTopN] = useState(DEFAULT_TOP_N)
  const [pickStrategy, setPickStrategy] = useState<PickStrategy>("strength")

  const slotRoles = getSlotRoles(myRole)

  const onMyRoleChange = (role: HeroEntry["role"] | null) => {
    setMyRole(role)
    setPicks([null, null, null, null])
  }

  const heroesByRole = (() => {
    const map: Record<HeroEntry["role"], string[]> = {
      TANK: [],
      DPS: [],
      SUPPORT: [],
    }
    for (const e of entries) {
      map[e.role].push(e.hero)
    }
    map.TANK.sort((a, b) => a.localeCompare(b))
    map.DPS.sort((a, b) => a.localeCompare(b))
    map.SUPPORT.sort((a, b) => a.localeCompare(b))
    return map
  })()

  const selected = picks.filter((p): p is string => p != null)
  const recommendations = getRecommendations(
    entries,
    selected,
    topN,
    pickStrategy,
    (i) => compLabel(i as 0 | 1 | 2 | 3),
    (compName, strategy) =>
      strategy === "strength"
        ? t("reasonStrength", { comp: compName })
        : strategy === "weakness"
          ? t("reasonWeakness", { comp: compName })
          : t("reasonBalance"),
  )

  const setPick = (slot: number, value: string | null) => {
    setPicks((prev) => {
      const next = [...prev]
      next[slot] = value || null
      return next
    })
  }

  const selectedSet = new Set(selected)
  const availableForSlot = (slot: number) => {
    if (!slotRoles) return []
    const role = slotRoles[slot]
    const current = picks[slot]
    const roleHeroes = heroesByRole[role] ?? []
    return roleHeroes.filter(
      (name) => name === current || !selectedSet.has(name),
    )
  }

  const slotLabel = (slot: number) => {
    if (!slotRoles) return ""
    const role = slotRoles[slot]
    if (role === "DPS") {
      const dpsIndex = slotRoles
        .slice(0, slot + 1)
        .filter((r) => r === "DPS").length
      return t("slotDpsNth", { n: dpsIndex })
    }
    if (role === "SUPPORT") {
      const supIndex = slotRoles
        .slice(0, slot + 1)
        .filter((r) => r === "SUPPORT").length
      return supIndex === 1 ? t("slotSupport") : t("slotSupportNth", { n: supIndex })
    }
    return roleLabel(role)
  }

  const roleLabelDisplay = (role: string) =>
    roleLabel(role as HeroEntry["role"]) ?? role
  const roleBadgeVariant = (role: string): "tank" | "dps" | "support" =>
    role === "TANK" ? "tank" : role === "DPS" ? "dps" : "support"

  return (
    <div className="min-h-screen max-w-3xl mx-auto px-5 py-8">
      <header className="mb-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {t("appTitle")}
            </h1>
            <p className="mt-1.5 text-sm text-(--color-muted-foreground)">
              {t("appSubtitle")}
            </p>
          </div>
          <div className="flex flex-col gap-2 min-w-32">
            <Label htmlFor="locale" className="text-xs text-(--color-muted-foreground)">
              {t("languageLabel")}
            </Label>
            <Select
              id="locale"
              value={locale}
              onChange={(e) =>
                setLocale((e.target.value || "ja") as "ja" | "en")
              }
              aria-label={t("languageLabel")}
            >
              <option value="ja">{t("localeJa")}</option>
              <option value="en">{t("localeEn")}</option>
            </Select>
          </div>
        </div>
      </header>

      <main className="flex flex-col gap-8">
        <Card>
          <CardHeader>
            <CardTitle>{t("myRoleTitle")}</CardTitle>
            <CardDescription>{t("myRoleDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2 max-w-48">
              <Label htmlFor="my-role">{t("roleLabel")}</Label>
              <Select
                id="my-role"
                value={myRole ?? ""}
                onChange={(e) =>
                  onMyRoleChange(
                    (e.target.value || null) as HeroEntry["role"] | null,
                  )
                }
                aria-label={t("ariaMyRole")}
              >
                <option value="">{t("selectPlaceholder")}</option>
                <option value="TANK">{roleLabel("TANK")}</option>
                <option value="DPS">{roleLabel("DPS")}</option>
                <option value="SUPPORT">{roleLabel("SUPPORT")}</option>
              </Select>
            </div>
          </CardContent>
        </Card>

        {slotRoles && (
          <Card>
            <CardHeader>
              <CardTitle>{t("teammatesTitle")}</CardTitle>
              <CardDescription>
                {t("teammatesDescription", { role: roleLabel(myRole!) })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[0, 1, 2, 3].map((slot) => (
                  <div key={slot} className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`pick-${slot}`}>{slotLabel(slot)}</Label>
                      <Badge
                        variant={roleBadgeVariant(slotRoles[slot])}
                        className="text-[10px] px-1.5 py-0"
                      >
                        {roleLabel(slotRoles[slot])}
                      </Badge>
                    </div>
                    <HeroSelect
                      id={`pick-${slot}`}
                      value={picks[slot]}
                      options={availableForSlot(slot)}
                      onChange={(v) => setPick(slot, v)}
                      placeholder={t("selectPlaceholder")}
                      aria-label={slotLabel(slot)}
                      locale={locale}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>{t("settingsTitle")}</CardTitle>
            <CardDescription>{t("settingsDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2 max-w-md">
                <Label htmlFor="pick-strategy">{t("strategyLabel")}</Label>
                <Select
                  id="pick-strategy"
                  value={pickStrategy}
                  onChange={(e) =>
                    setPickStrategy((e.target.value || "strength") as PickStrategy)
                  }
                  aria-label={t("ariaStrategy")}
                >
                  {PICK_STRATEGY_VALUES.map((value) => (
                    <option key={value} value={value}>
                      {t(
                        value === "strength"
                          ? "strategyStrength"
                          : value === "weakness"
                            ? "strategyWeakness"
                            : "strategyBalance",
                      )}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="flex flex-col gap-2 max-w-48">
                <Label htmlFor="top-n">{t("topNLabel")}</Label>
                <Select
                  id="top-n"
                  value={topN}
                  onChange={(e) => setTopN(Number(e.target.value))}
                  aria-label={t("ariaTopN")}
                >
                  {Array.from({ length: MAX_TOP_N }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n}
                      {t("topNUnit")}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card aria-live="polite">
          <CardHeader>
            <CardTitle>{t("recommendationsTitle")}</CardTitle>
            <CardDescription>
              {myRole === null
                ? t("recommendationsPromptSelectRole")
                : selected.length < 4
                  ? t("recommendationsPromptSelectFour")
                  : recommendations.length === 0
                    ? t("recommendationsPromptInvalid")
                    : t("recommendationsCount", {
                        role: roleLabel(myRole),
                        count: recommendations.length,
                      })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selected.length < 4 || recommendations.length === 0 ? null : (
              <ul className="flex flex-col gap-3 list-none m-0 p-0">
                {recommendations.map((r, index) => {
                  const iconUrl = getHeroIconUrl(r.hero)
                  return (
                    <li
                      key={r.hero}
                      className="flex flex-wrap items-center gap-2 sm:gap-4 rounded-lg border border-(--color-border) bg-(--color-background) p-4"
                    >
                      <span className="flex h-7 min-w-7 shrink-0 items-center justify-center rounded-full bg-(--color-muted) text-xs font-bold text-(--color-muted-foreground)">
                        {index + 1}
                      </span>
                      {iconUrl ? (
                        <img
                          src={iconUrl}
                          alt=""
                          className="h-8 w-8 shrink-0 rounded object-cover"
                          width={32}
                          height={32}
                        />
                      ) : null}
                      <span className="font-semibold">
                        {getHeroDisplayName(r.hero, locale)}
                      </span>
                      <Badge variant={roleBadgeVariant(r.role)}>
                        {roleLabelDisplay(r.role)}
                      </Badge>
                      <span className="w-full sm:w-auto text-sm text-(--color-muted-foreground)">
                        {r.reason}
                      </span>
                    </li>
                  )
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
