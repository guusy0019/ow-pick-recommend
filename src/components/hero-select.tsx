import { useRef, useState, useEffect } from "react"
import { getHeroIconUrl } from "@/lib/hero-icons"
import { getHeroDisplayName } from "@/lib/hero-names"

const triggerClass =
  "flex h-9 w-full items-center gap-2 rounded-md border border-(--color-input) bg-(--color-background) text-(--color-foreground) px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-background) disabled:cursor-not-allowed disabled:opacity-50 text-left"

interface HeroSelectProps {
  id?: string
  value: string | null
  options: string[]
  onChange: (value: string | null) => void
  placeholder: string
  "aria-label": string
  locale: "ja" | "en"
}

export function HeroSelect({
  id,
  value,
  options,
  onChange,
  placeholder,
  "aria-label": ariaLabel,
  locale,
}: HeroSelectProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      if (containerRef.current?.contains(e.target as Node)) return
      setOpen(false)
    }
    document.addEventListener("click", onDocClick)
    return () => document.removeEventListener("click", onDocClick)
  }, [open])

  const displayValue = value ? getHeroDisplayName(value, locale) : ""
  const iconUrl = value ? getHeroIconUrl(value) : null

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        id={id}
        className={triggerClass}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
      >
        {iconUrl ? (
          <img
            src={iconUrl}
            alt=""
            className="h-5 w-5 shrink-0 rounded object-cover"
            width={20}
            height={20}
          />
        ) : null}
        <span className={value ? "" : "text-(--color-muted-foreground)"}>
          {displayValue || placeholder}
        </span>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-(--color-input) bg-(--color-background) py-1 shadow-lg"
        >
          <li
            role="option"
            aria-selected={!value}
            className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-(--color-accent) hover:text-(--color-accent-foreground)"
            onClick={() => {
              onChange(null)
              setOpen(false)
            }}
          >
            <span className="w-5 shrink-0" aria-hidden />
            {placeholder}
          </li>
          {options.map((name) => {
            const url = getHeroIconUrl(name)
            const selected = value === name
            return (
              <li
                key={name}
                role="option"
                aria-selected={selected}
                className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-(--color-accent) hover:text-(--color-accent-foreground)"
                onClick={() => {
                  onChange(name)
                  setOpen(false)
                }}
              >
                {url ? (
                  <img
                    src={url}
                    alt=""
                    className="h-5 w-5 shrink-0 rounded object-cover"
                    width={20}
                    height={20}
                  />
                ) : (
                  <span className="w-5 shrink-0" aria-hidden />
                )}
                {getHeroDisplayName(name, locale)}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
