import { forwardRef, type HTMLAttributes } from 'react'

type BadgeVariant = 'default' | 'tank' | 'dps' | 'support'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = '', variant = 'default', ...props }, ref) => {
    const base = 'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold'
    const v =
      variant === 'tank'
        ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300'
        : variant === 'dps'
          ? 'bg-orange-500/20 text-orange-700 dark:text-orange-300'
          : variant === 'support'
            ? 'bg-green-500/20 text-green-700 dark:text-green-300'
            : 'bg-(--color-primary) text-(--color-primary-foreground)'
    return (
      <span
        ref={ref}
        className={`${base} ${v} ${className}`}
        {...props}
      />
    )
  }
)
Badge.displayName = 'Badge'

export { Badge }
