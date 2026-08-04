import { cn } from '@/lib/utils'
import type {
  AccessibilityViewModel,
  DeveloperFramework,
  DeveloperMaturity,
  DeveloperStatus,
  ParityViewModel,
} from './types'

interface BadgeBaseProps {
  className?: string
}

const badgeBase =
  'inline-flex min-h-6 items-center rounded-full border px-2.5 py-0.5 font-sans text-xs font-semibold leading-5'

const maturityStyles: Record<DeveloperMaturity, string> = {
  stable: 'border-emerald-600/25 bg-emerald-600/10 text-emerald-800 dark:text-emerald-300',
  beta: 'border-amber-600/25 bg-amber-500/10 text-amber-800 dark:text-amber-300',
  infrastructure: 'border-sky-600/25 bg-sky-500/10 text-sky-800 dark:text-sky-300',
}

const statusStyles: Record<DeveloperStatus, string> = {
  supported: 'border-emerald-600/25 bg-emerald-600/10 text-emerald-800 dark:text-emerald-300',
  deferred: 'border-amber-600/25 bg-amber-500/10 text-amber-800 dark:text-amber-300',
  reference: 'border-sky-600/25 bg-sky-500/10 text-sky-800 dark:text-sky-300',
  deprecated: 'border-destructive/25 bg-destructive/10 text-destructive',
}

export function MaturityBadge({
  maturity,
  className,
}: BadgeBaseProps & { maturity: DeveloperMaturity }) {
  return (
    <span className={cn(badgeBase, maturityStyles[maturity], className)}>
      {maturity === 'infrastructure' ? 'Infrastructure' : maturity === 'stable' ? 'Stable' : 'Beta'}
    </span>
  )
}

export function FrameworkBadge({
  framework,
  className,
}: BadgeBaseProps & { framework: DeveloperFramework }) {
  return (
    <span
      className={cn(
        badgeBase,
        'border-border bg-muted text-foreground',
        className,
      )}
    >
      {framework === 'react' ? 'React' : 'Blade'}
    </span>
  )
}

export function StatusBadge({
  status,
  className,
}: BadgeBaseProps & { status: DeveloperStatus }) {
  return (
    <span className={cn(badgeBase, statusStyles[status], className)}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

const auditLabels: Record<AccessibilityViewModel['auditStatus'], string> = {
  pending: 'Audit pending',
  passed: 'Audit passed',
  'passed-with-findings': 'Passed with findings',
  failed: 'Audit failed',
}

const auditStyles: Record<AccessibilityViewModel['auditStatus'], string> = {
  pending: 'border-amber-600/25 bg-amber-500/10 text-amber-800 dark:text-amber-300',
  passed: 'border-emerald-600/25 bg-emerald-600/10 text-emerald-800 dark:text-emerald-300',
  'passed-with-findings': 'border-amber-600/25 bg-amber-500/10 text-amber-800 dark:text-amber-300',
  failed: 'border-destructive/25 bg-destructive/10 text-destructive',
}

export function AccessibilityBadge({
  status,
  className,
}: BadgeBaseProps & { status: AccessibilityViewModel['auditStatus'] }) {
  return (
    <span className={cn(badgeBase, auditStyles[status], className)}>
      {auditLabels[status]}
    </span>
  )
}

const parityLabels: Record<ParityViewModel['classification'], string> = {
  exact: 'Exact parity',
  'framework-equivalent': 'Framework equivalent',
  'documented-exception': 'Documented exception',
}

export function ParityBadge({
  classification,
  className,
}: BadgeBaseProps & { classification: ParityViewModel['classification'] }) {
  return (
    <span
      className={cn(
        badgeBase,
        'border-border bg-muted text-foreground',
        className,
      )}
    >
      {parityLabels[classification]}
    </span>
  )
}
