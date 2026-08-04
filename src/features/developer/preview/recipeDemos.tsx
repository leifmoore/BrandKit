import * as React from "react";

type UnknownRecipe = React.ComponentType<Record<string, unknown>>;

interface RecipeDemoProps {
  id: string;
  component: UnknownRecipe;
  fixture: unknown;
}

interface AvailabilityItem {
  id: string;
  label: string;
  sublabel?: string;
  available: boolean;
  lockedReason?: string;
}

interface AvailabilityFixture {
  defaultId: string | null;
  items: AvailabilityItem[];
}

function AvailabilityToggleListDemo({
  component: Component,
  fixture,
}: Omit<RecipeDemoProps, "id">) {
  const source = fixture as AvailabilityFixture;
  const [items, setItems] = React.useState(() =>
    source.items.map((item) => ({ ...item })),
  );
  const [defaultId, setDefaultId] = React.useState(source.defaultId);

  return (
    <Component
      items={items}
      defaultId={defaultId}
      onToggle={(id: string, available: boolean) => {
        setItems((current) =>
          current.map((item) =>
            item.id === id ? { ...item, available } : item,
          ),
        );
      }}
      onSetDefault={(id: string) => setDefaultId(id)}
    />
  );
}

interface BookingCardFixture {
  id: string;
  customerName: string;
  customerEmail: string;
  status: "Active" | "Cancelled" | "Rescheduled";
}

function BookingCardDemo({
  component: Component,
  fixture,
}: Omit<RecipeDemoProps, "id">) {
  const booking = fixture as BookingCardFixture;
  const [viewedId, setViewedId] = React.useState<string | null>(null);

  return (
    <div className="space-y-3">
      <Component booking={booking} onView={() => setViewedId(booking.id)} />
      <p className="min-h-5 text-xs text-muted-foreground" aria-live="polite">
        {viewedId ? `Opened booking ${viewedId}.` : ""}
      </p>
    </div>
  );
}

interface BookingDetailsFixture extends BookingCardFixture {
  date: string;
  time: string;
  items: string;
  total: string;
}

function BookingDetailsDialogDemo({
  component: Component,
  fixture,
}: Omit<RecipeDemoProps, "id">) {
  const booking = fixture as BookingDetailsFixture;
  const [open, setOpen] = React.useState(false);
  const [action, setAction] = React.useState<string | null>(null);

  return (
    <div className="flex flex-col items-start gap-3">
      <button
        type="button"
        className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-xs outline-none hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring"
        onClick={() => setOpen(true)}
      >
        Open booking details
      </button>
      <Component
        booking={booking}
        open={open}
        onOpenChange={setOpen}
        onReschedule={() => setAction("Reschedule selected")}
        onCancel={() => setAction("Cancel selected")}
      />
      <p className="min-h-5 text-xs text-muted-foreground" aria-live="polite">
        {action ?? ""}
      </p>
    </div>
  );
}

interface LogoOption {
  id: string;
  label: string;
  imageUrl?: string;
}

interface ChannelLogoFixture {
  showLogo: boolean;
  selectedLogoId: string | null;
  logos: LogoOption[];
}

function ChannelLogoPickerDemo({
  component: Component,
  fixture,
}: Omit<RecipeDemoProps, "id">) {
  const source = fixture as ChannelLogoFixture;
  const [showLogo, setShowLogo] = React.useState(source.showLogo);
  const [selectedLogoId, setSelectedLogoId] = React.useState(
    source.selectedLogoId,
  );

  return (
    <Component
      showLogo={showLogo}
      onShowLogoChange={setShowLogo}
      logos={source.logos}
      selectedLogoId={selectedLogoId}
      onSelectedLogoChange={setSelectedLogoId}
    />
  );
}

interface PeopleFixture {
  adults: number;
  children: number;
  infants: number;
  pets: number;
  accessibilityAccess: boolean;
}

function PeoplePopoverContentDemo({
  component: Component,
  fixture,
}: Omit<RecipeDemoProps, "id">) {
  const source = fixture as PeopleFixture;
  const [people, setPeople] = React.useState(() => ({
    adults: source.adults,
    children: source.children,
    infants: source.infants,
    pets: source.pets,
  }));
  const [accessibilityAccess, setAccessibilityAccess] = React.useState(
    source.accessibilityAccess,
  );

  return (
    <Component
      people={people}
      onPeopleChange={setPeople}
      accessibilityAccess={accessibilityAccess}
      onAccessibilityChange={setAccessibilityAccess}
    />
  );
}

interface QuickLaunchItem {
  id: string;
  name: string;
  subtitle: string;
}

interface QuickLaunchFixture {
  items: QuickLaunchItem[];
}

function QuickLaunchDemo({
  component: Component,
  fixture,
}: Omit<RecipeDemoProps, "id">) {
  const source = fixture as QuickLaunchFixture;
  const [launched, setLaunched] = React.useState<string | null>(null);

  return (
    <div className="space-y-3">
      <Component
        items={source.items}
        onLaunch={(item: QuickLaunchItem) => setLaunched(item.name)}
      />
      <p className="min-h-5 text-xs text-muted-foreground" aria-live="polite">
        {launched ? `Launched ${launched}.` : ""}
      </p>
    </div>
  );
}

const recipeDemos: Record<
  string,
  React.ComponentType<Omit<RecipeDemoProps, "id">>
> = {
  "availability-toggle-list": AvailabilityToggleListDemo,
  "booking-card": BookingCardDemo,
  "booking-details-dialog": BookingDetailsDialogDemo,
  "channel-logo-picker": ChannelLogoPickerDemo,
  "people-popover-content": PeoplePopoverContentDemo,
  "quick-launch": QuickLaunchDemo,
};

export function RecipeDemo({ id, component, fixture }: RecipeDemoProps) {
  const Demo = recipeDemos[id];

  if (!Demo) {
    throw new Error(`No deterministic demo wrapper is registered for "${id}".`);
  }

  return <Demo component={component} fixture={fixture} />;
}
