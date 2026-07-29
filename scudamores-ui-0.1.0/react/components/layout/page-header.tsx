import * as React from 'react';
import { cn } from '../ui/utils';

// Page-header composite (docs/design-system/layout.md "page-header pattern" /
// shell-002). Pages compose this at the top of their content, optionally
// inside PageContainer for the standard app-wide width. Structural primitive
// only — no page has been retrofitted to use it yet (that's each page
// module's job); this just makes the pattern adoptable.

export interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('flex min-w-0 items-start justify-between gap-4 max-md:flex-col', className)}>
      <div className="min-w-0">
        <h1 className="text-2xl font-medium text-foreground truncate">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

// Standard app content container (layout.md §4 / tokens.md): centers content
// at a max width with responsive gutters. Wrap page content in this to get
// the shared width; PageHeader itself stays width-agnostic so it also works
// inside narrower contexts (e.g. a settings sub-layout column).
export interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn('mx-auto w-full max-w-7xl px-6 py-6 lg:px-8 lg:py-8', className)}>
      {children}
    </div>
  );
}
