import handoffCatalog from '@comp-lib/catalog/catalog.json'
import patternHandoffCatalog from '@scudamores/patterns/catalog/catalog.json'

export type WorkspaceId = 'brand' | 'design-system'

export interface WorkspaceNavItem {
  readonly label: string
  readonly href: string
  readonly icon: string
  readonly description: string
  readonly matchPrefix?: string
  readonly subsections?: readonly {
    readonly label: string
    readonly anchor: string
  }[]
}

export interface WorkspaceNavGroup {
  readonly label: string
  readonly items: readonly WorkspaceNavItem[]
}

export interface WorkspaceDefinition {
  readonly id: WorkspaceId
  readonly label: string
  readonly shortLabel: string
  readonly home: string
  readonly navigation: readonly WorkspaceNavGroup[]
}

const brandNavigation: readonly WorkspaceNavGroup[] = [
  {
    label: 'Start',
    items: [
      {
        label: 'Overview',
        href: '/brand',
        icon: 'LayoutDashboard',
        description: 'Brand story, principles, and key resources',
      },
      {
        label: 'Quick Reference',
        href: '/brand/quick-reference',
        icon: 'BookOpenCheck',
        description: 'Locked identity anchors and the current working expression draft',
        subsections: [
          { label: 'Current Draft', anchor: 'current-draft' },
          { label: 'Typography', anchor: 'quick-type' },
          { label: 'Essentials', anchor: 'essentials' },
        ],
      },
    ],
  },
  {
    label: 'Identity',
    items: [
      {
        label: 'Logo',
        href: '/brand/identity/logo',
        icon: 'Stamp',
        description: 'Logo variants, usage rules, and downloads',
        subsections: [
          { label: 'Variants', anchor: 'variants' },
          { label: 'Clear Space', anchor: 'clear-space' },
          { label: 'Do’s & Don’ts', anchor: 'dos-donts' },
          { label: 'Downloads', anchor: 'downloads' },
        ],
      },
      {
        label: 'Colour',
        href: '/brand/identity/colour',
        icon: 'Palette',
        description: 'Identity colours and expressive colour guidance',
        subsections: [
          { label: 'Primary', anchor: 'primary' },
          { label: 'Expression Palette', anchor: 'accent-colours' },
          { label: 'Water Powder Ramp', anchor: 'navy-ramp' },
          { label: 'Faded Butter Ramp', anchor: 'cream-ramp' },
          { label: 'WCAG Pairs', anchor: 'wcag-pairs' },
          { label: 'WCAG Checker', anchor: 'wcag-checker' },
          { label: 'Mood Explorer', anchor: 'mood-explorer' },
        ],
      },
      {
        label: 'Typography',
        href: '/brand/identity/typography',
        icon: 'Type',
        description: 'Identity typefaces and expressive hierarchy',
        subsections: [
          { label: 'Fonts', anchor: 'fonts' },
          { label: 'Type Scale', anchor: 'type-scale' },
          { label: 'Live Preview', anchor: 'live-preview' },
          { label: 'Rules', anchor: 'rules' },
        ],
      },
    ],
  },
  {
    label: 'Expression',
    items: [
      {
        label: 'Voice & Tone',
        href: '/brand/expression/voice',
        icon: 'MessageSquare',
        description: 'Voice traits and writing guidance',
        subsections: [
          { label: 'Traits', anchor: 'traits' },
          { label: 'Channel Tones', anchor: 'channels' },
          { label: 'Do’s & Don’ts', anchor: 'dos-donts' },
          { label: 'Scudamore’s-isms', anchor: 'isms' },
          { label: 'AI Brand Checker', anchor: 'ai-checker' },
        ],
      },
      {
        label: 'Photography',
        href: '/brand/expression/photography',
        icon: 'Camera',
        description: 'Subjects, composition, and editing approach',
        subsections: [
          { label: 'Editing', anchor: 'editing' },
          { label: 'Composition', anchor: 'composition' },
          { label: 'Subjects', anchor: 'subjects' },
          { label: 'Aspect Ratios', anchor: 'aspect-ratios' },
          { label: 'Product Heroes', anchor: 'product-heroes' },
          { label: 'Consent', anchor: 'consent' },
        ],
      },
      {
        label: 'Graphics',
        href: '/brand/expression/graphics',
        icon: 'Shapes',
        description: 'Graphic expression, decoration, and illustration',
        subsections: [
          { label: 'Icon Libraries', anchor: 'icon-libraries' },
          { label: 'Decorative Elements', anchor: 'decorative-elements' },
          { label: 'Illustration', anchor: 'illustration' },
        ],
      },
      {
        label: 'Brand Playground',
        href: '/brand/expression/playground',
        icon: 'FlaskConical',
        description: 'Workshop palette, gradients, glass, and future website expression',
        subsections: [
          { label: 'Workbench', anchor: 'workbench' },
          { label: 'Saved Candidates', anchor: 'saved-candidates' },
          { label: 'Export', anchor: 'playground-export' },
        ],
      },
    ],
  },
  {
    label: 'Activation',
    items: [
      {
        label: 'Applications',
        href: '/brand/applications',
        icon: 'PanelsTopLeft',
        description: 'Digital, print, and social applications',
        subsections: [
          { label: 'Digital', anchor: 'digital' },
          { label: 'Print', anchor: 'print' },
          { label: 'Social Specs', anchor: 'social-specs' },
        ],
      },
      {
        label: 'Resources',
        href: '/brand/resources',
        icon: 'Download',
        description: 'Brand assets and identity downloads',
        subsections: [
          { label: 'Logos', anchor: 'resource-logos' },
          { label: 'Colour Tokens', anchor: 'resource-colour-tokens' },
          { label: 'Typography', anchor: 'resource-typography' },
        ],
      },
    ],
  },
]

const designSystemNavigation: readonly WorkspaceNavGroup[] = [
  {
    label: 'Start',
    items: [
      {
        label: 'Overview',
        href: '/design-system',
        icon: 'LayoutDashboard',
        description: 'Design System guidance, status, and entry points',
      },
    ],
  },
  {
    label: 'Foundations',
    items: [
      {
        label: 'Tokens',
        href: '/design-system/foundations/tokens',
        icon: 'SwatchBook',
        description: 'Canonical semantic interface tokens',
      },
      {
        label: 'Themes',
        href: '/design-system/foundations/themes',
        icon: 'Paintbrush',
        description: 'Theme modes and interaction presets',
      },
      {
        label: 'Typography',
        href: '/design-system/foundations/typography',
        icon: 'Type',
        description: 'Interface type scale and implementation',
      },
      {
        label: 'Layout',
        href: '/design-system/foundations/layout',
        icon: 'PanelTop',
        description: 'Spacing, responsive layout, and page structure',
      },
      {
        label: 'Icons',
        href: '/design-system/foundations/icons',
        icon: 'CircleDot',
        description: 'Interface iconography and accessible labels',
      },
      {
        label: 'Data visualisation',
        href: '/design-system/foundations/data-visualisation',
        icon: 'ChartNoAxesCombined',
        description: 'Charts, data colour, and visualisation guidance',
      },
      {
        label: 'Accessibility',
        href: '/design-system/foundations/accessibility',
        icon: 'Accessibility',
        description: 'Inclusive interaction and implementation requirements',
      },
      {
        label: 'Exceptions',
        href: '/design-system/foundations/exceptions',
        icon: 'ShieldAlert',
        description: 'Documented host adapters and compatibility boundaries',
      },
    ],
  },
  {
    label: 'Library',
    items: [
      {
        label: 'Components',
        href: '/design-system/components',
        matchPrefix: '/design-system/components',
        icon: 'Boxes',
        description: 'Interactive primitives with React and Blade source',
      },
      {
        label: 'Patterns',
        href: '/design-system/patterns',
        matchPrefix: '/design-system/patterns',
        icon: 'Blocks',
        description: 'Reusable compositions and product recipes',
      },
      {
        label: 'Roadmap',
        href: '/design-system/roadmap',
        matchPrefix: '/design-system/roadmap',
        icon: 'Map',
        description: 'Deferred components and promotion evidence',
      },
    ],
  },
  {
    label: 'Ship',
    items: [
      {
        label: 'Resources',
        href: '/design-system/resources',
        icon: 'PackageOpen',
        description: 'Source, tokens, and implementation resources',
      },
      {
        label: 'Preview review',
        href: '/design-system/review/previews',
        icon: 'ListChecks',
        description: 'Manual validation queue for component previews',
      },
    ],
  },
]

export const WORKSPACES: Readonly<Record<WorkspaceId, WorkspaceDefinition>> = {
  brand: {
    id: 'brand',
    label: 'Brand',
    shortLabel: 'Brand',
    home: '/brand',
    navigation: brandNavigation,
  },
  'design-system': {
    id: 'design-system',
    label: 'Design System',
    shortLabel: 'System',
    home: '/design-system',
    navigation: designSystemNavigation,
  },
}

export const WORKSPACE_ORDER: readonly WorkspaceId[] = ['brand', 'design-system']

export const BRAND_CANONICAL_PATHS = Object.freeze(
  brandNavigation.flatMap((group) => group.items.map((item) => item.href)),
)

export const DESIGN_SYSTEM_STATIC_PATHS = Object.freeze(
  designSystemNavigation.flatMap((group) => group.items.map((item) => item.href)),
)

const DESIGN_SYSTEM_DETAIL_PATHS = new Set([
  ...handoffCatalog.components.map(({ id }) => `/design-system/components/${id}`),
  ...handoffCatalog.recipes.map(({ id }) => `/design-system/patterns/${id}`),
  ...patternHandoffCatalog.patterns.map(({ id }) => `/design-system/patterns/${id}`),
  ...handoffCatalog.deferredComponents.map(({ id }) => `/design-system/roadmap/${id}`),
])

export function getWorkspaceForPath(pathname: string): WorkspaceId | undefined {
  if (pathname === '/brand' || pathname.startsWith('/brand/')) return 'brand'
  if (pathname === '/design-system' || pathname.startsWith('/design-system/')) return 'design-system'
  return undefined
}

export function isValidWorkspacePath(pathname: string): boolean {
  const normalizedPath = pathname.replace(/\/+$/, '') || '/'
  return BRAND_CANONICAL_PATHS.includes(normalizedPath)
    || DESIGN_SYSTEM_STATIC_PATHS.includes(normalizedPath)
    || DESIGN_SYSTEM_DETAIL_PATHS.has(normalizedPath)
}

export function isWorkspaceNavItemActive(pathname: string, item: WorkspaceNavItem): boolean {
  if (item.matchPrefix) {
    return pathname === item.href || pathname.startsWith(`${item.matchPrefix}/`)
  }
  return pathname === item.href
}

export function canonicalizeDeveloperPath(pathname: string): string {
  if (pathname === '/developer') return '/design-system'
  if (
    pathname === '/developer/foundations/brands'
    || pathname === '/design-system/foundations/brands'
  ) {
    return '/design-system/foundations/themes'
  }
  if (pathname.startsWith('/developer/')) {
    return `/design-system/${pathname.slice('/developer/'.length)}`
  }
  return pathname
}
