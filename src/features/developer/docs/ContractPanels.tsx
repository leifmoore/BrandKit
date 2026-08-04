import { CheckCircle2, CircleAlert, ExternalLink } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { AccessibilityBadge, ParityBadge } from './StatusBadges'
import type {
  AccessibilityFindingViewModel,
  AccessibilityViewModel,
  DependencyViewModel,
  FrameworkContractViewModel,
  NamedOptionViewModel,
  ParityViewModel,
  PropViewModel,
} from './types'

function displayDefault(value: unknown) {
  if (value === undefined) return '—'
  if (typeof value === 'string') return `"${value}"`
  if (typeof value === 'function' || typeof value === 'symbol') return String(value)
  const serialized = JSON.stringify(value)
  return serialized ?? String(value)
}

export function PropsTable({ props }: { props: readonly PropViewModel[] }) {
  if (props.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-5 font-sans text-sm text-muted-foreground">
        This contract does not declare any public props.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border" tabIndex={0}>
      <table className="w-full min-w-[48rem] border-collapse text-left font-sans text-sm">
        <thead className="bg-muted/70">
          <tr>
            <th scope="col" className="border-b border-border px-4 py-3 font-semibold text-foreground">Prop</th>
            <th scope="col" className="border-b border-border px-4 py-3 font-semibold text-foreground">Type</th>
            <th scope="col" className="border-b border-border px-4 py-3 font-semibold text-foreground">Required</th>
            <th scope="col" className="border-b border-border px-4 py-3 font-semibold text-foreground">Default</th>
            <th scope="col" className="border-b border-border px-4 py-3 font-semibold text-foreground">Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop) => (
            <tr key={prop.name} className="border-b border-border last:border-b-0">
              <th scope="row" className="px-4 py-3 align-top font-mono text-xs font-semibold text-foreground">
                {prop.name}
              </th>
              <td className="px-4 py-3 align-top">
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">{prop.type}</code>
              </td>
              <td className="px-4 py-3 align-top text-muted-foreground">{prop.required ? 'Yes' : 'No'}</td>
              <td className="px-4 py-3 align-top font-mono text-xs text-muted-foreground">{displayDefault(prop.defaultValue)}</td>
              <td className="max-w-md px-4 py-3 align-top text-muted-foreground">{prop.description ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ContractMetadata({ contract }: { contract: FrameworkContractViewModel }) {
  const groups = [
    contract.exports?.length ? { label: 'Exports', values: contract.exports } : null,
    contract.canonicalTag ? { label: 'Canonical tag', values: [contract.canonicalTag] } : null,
    contract.compatibilityTags?.length
      ? { label: 'Compatibility tags', values: contract.compatibilityTags }
      : null,
    contract.slots?.length ? { label: 'Slots', values: contract.slots } : null,
    contract.events?.length ? { label: 'Events', values: contract.events } : null,
    contract.installTargets?.length
      ? { label: 'Install targets', values: contract.installTargets }
      : null,
  ].filter((group): group is { label: string; values: readonly string[] } => group !== null)

  if (groups.length === 0) return null

  return (
    <dl className="mb-6 grid gap-4 rounded-lg border border-border bg-muted/25 p-4 sm:grid-cols-2">
      {groups.map((group) => (
        <div key={group.label} className="min-w-0">
          <dt className="font-sans text-xs font-semibold uppercase tracking-caps text-muted-foreground">
            {group.label}
          </dt>
          <dd className="mt-2 flex flex-wrap gap-1.5">
            {group.values.map((value) => (
              <code key={value} className="max-w-full break-all rounded bg-background px-2 py-1 font-mono text-xs text-foreground">
                {value}
              </code>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  )
}

export function FrameworkContracts({ contracts }: { contracts: readonly FrameworkContractViewModel[] }) {
  const first = contracts[0]
  if (!first) {
    return (
      <p className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-5 font-sans text-sm text-muted-foreground">
        No public API contract is available for this entry.
      </p>
    )
  }

  if (contracts.length === 1) {
    return (
      <div>
        <ContractMetadata contract={first} />
        <PropsTable props={first.props} />
      </div>
    )
  }

  return (
    <Tabs defaultValue={first.framework} className="w-full gap-0">
      <TabsList className="mb-5 h-auto bg-muted p-1" aria-label="API framework">
        {contracts.map((contract) => (
          <TabsTrigger
            key={contract.framework}
            value={contract.framework}
            className="min-w-24 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {contract.framework === 'react' ? 'React' : 'Blade'}
          </TabsTrigger>
        ))}
      </TabsList>
      {contracts.map((contract) => (
        <TabsContent key={contract.framework} value={contract.framework} className="mt-0">
          <ContractMetadata contract={contract} />
          <PropsTable props={contract.props} />
        </TabsContent>
      ))}
    </Tabs>
  )
}

export function OptionsPanel({
  groups,
}: {
  groups: readonly { label: string; values: readonly (NamedOptionViewModel | string)[] }[]
}) {
  const visibleGroups = groups.filter((group) => group.values.length > 0)
  if (visibleGroups.length === 0) return null

  return (
    <dl className="grid gap-4 md:grid-cols-2">
      {visibleGroups.map((group) => (
        <div key={group.label} className="rounded-lg border border-border bg-card p-4">
          <dt className="font-sans text-xs font-semibold uppercase tracking-caps text-muted-foreground">
            {group.label}
          </dt>
          <dd className="mt-3 flex flex-wrap gap-2">
            {group.values.map((value) => {
              const option = typeof value === 'string' ? { name: value } : value
              return (
                <span
                  key={option.name}
                  title={option.description}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/50 px-2.5 py-1 font-mono text-xs text-foreground',
                    option.default && 'border-primary/30 bg-primary/10',
                  )}
                >
                  {option.name}
                  {option.default ? <span className="font-sans text-[0.625rem] font-semibold uppercase text-muted-foreground">default</span> : null}
                </span>
              )
            })}
          </dd>
        </div>
      ))}
    </dl>
  )
}

export function DependenciesPanel({ dependencies }: { dependencies: readonly DependencyViewModel[] }) {
  if (dependencies.length === 0) {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-emerald-600/20 bg-emerald-600/5 p-4">
        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-700 dark:text-emerald-300" aria-hidden="true" />
        <div>
          <p className="font-sans text-sm font-semibold text-foreground">No additional dependencies</p>
          <p className="mt-1 font-sans text-sm text-muted-foreground">This entry does not declare package or runtime dependencies.</p>
        </div>
      </div>
    )
  }

  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {dependencies.map((dependency, index) => (
        <li key={`${dependency.framework ?? 'shared'}-${dependency.name}-${index}`} className="rounded-lg border border-border bg-card p-4">
          <div className="flex flex-wrap items-baseline gap-2">
            <code className="break-all font-mono text-sm font-semibold text-foreground">{dependency.name}</code>
            {dependency.version ? <span className="font-mono text-xs text-muted-foreground">@{dependency.version}</span> : null}
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {dependency.framework ? (
              <span className="rounded bg-muted px-2 py-0.5 font-sans text-xs text-muted-foreground">
                {dependency.framework === 'react' ? 'React' : 'Blade'}
              </span>
            ) : null}
            {dependency.scope ? (
              <span className="rounded bg-muted px-2 py-0.5 font-sans text-xs text-muted-foreground">{dependency.scope}</span>
            ) : null}
          </div>
          {dependency.purpose ? <p className="mt-3 font-sans text-sm text-muted-foreground">{dependency.purpose}</p> : null}
        </li>
      ))}
    </ul>
  )
}

const findingStyles: Record<NonNullable<AccessibilityFindingViewModel['severity']>, string> = {
  minor: 'border-sky-600/20 bg-sky-600/5',
  moderate: 'border-amber-600/20 bg-amber-500/5',
  serious: 'border-orange-600/20 bg-orange-500/5',
  critical: 'border-destructive/25 bg-destructive/5',
}

export function AccessibilityPanel({ accessibility }: { accessibility: AccessibilityViewModel }) {
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <AccessibilityBadge status={accessibility.auditStatus} />
        <span className="font-sans text-sm text-muted-foreground">Target: {accessibility.target}</span>
      </div>
      {accessibility.findings.length === 0 ? (
        <div className="flex items-start gap-3 rounded-lg border border-emerald-600/20 bg-emerald-600/5 p-4">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-700 dark:text-emerald-300" aria-hidden="true" />
          <div>
            <p className="font-sans text-sm font-semibold text-foreground">No recorded findings</p>
            <p className="mt-1 font-sans text-sm text-muted-foreground">Review the audit status above before treating this as a release gate.</p>
          </div>
        </div>
      ) : (
        <ul className="space-y-3">
          {accessibility.findings.map((finding) => (
            <li key={finding.id} className={cn('rounded-lg border p-4', finding.severity ? findingStyles[finding.severity] : 'border-amber-600/20 bg-amber-500/5')}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <CircleAlert className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <div>
                    <p className="font-sans text-sm font-semibold text-foreground">{finding.summary}</p>
                    {finding.detail ? <p className="mt-1 font-sans text-sm leading-6 text-muted-foreground">{finding.detail}</p> : null}
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap gap-1.5 pl-8 sm:pl-0">
                  {finding.severity ? (
                    <span className="rounded bg-background/75 px-2 py-0.5 font-sans text-xs font-semibold capitalize text-muted-foreground">
                      {finding.severity}
                    </span>
                  ) : null}
                  {finding.status ? (
                    <span className="rounded bg-background/75 px-2 py-0.5 font-sans text-xs font-semibold capitalize text-muted-foreground">
                      {finding.status}
                    </span>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function ParityPanel({ parity }: { parity: ParityViewModel }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex flex-wrap items-center gap-3">
        <ParityBadge classification={parity.classification} />
        <p className="font-sans text-sm text-muted-foreground">React is the visual target; documented framework differences are explicit.</p>
      </div>
      {parity.intentionalDifferences.length > 0 ? (
        <ul className="mt-4 space-y-2 border-t border-border pt-4">
          {parity.intentionalDifferences.map((difference) => (
            <li key={difference} className="flex items-start gap-2 font-sans text-sm leading-6 text-muted-foreground">
              <ExternalLink className="mt-1 size-4 shrink-0" aria-hidden="true" />
              {difference}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 border-t border-border pt-4 font-sans text-sm text-muted-foreground">
          No intentional visual or behavioural differences are recorded.
        </p>
      )}
    </div>
  )
}
