import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const sourceCommit = "d1511e224305585680723101a0b76be93eb9f2f0";
const verifiedAt = "2026-07-28";

const rows = [
  ["accordion", "Accordion", "disclosure", "beta", "Expandable sections with optional single or multiple open items.", ["Accordion", "AccordionItem", "AccordionTrigger", "AccordionContent"], ["accordion", "disclosure", "expand"]],
  ["alert", "Alert", "feedback", "stable", "Persistent contextual feedback with semantic variants.", ["Alert", "AlertTitle", "AlertDescription"], ["alert", "message", "feedback"]],
  ["alert-dialog", "Alert Dialog", "overlays", "stable", "A modal confirmation surface for consequential actions.", ["AlertDialog", "AlertDialogTrigger", "AlertDialogContent", "AlertDialogHeader", "AlertDialogFooter", "AlertDialogTitle", "AlertDialogDescription", "AlertDialogAction", "AlertDialogCancel"], ["alert dialog", "confirm", "modal"]],
  ["aspect-ratio", "Aspect Ratio", "layout", "beta", "Constrains media or content to a stable aspect ratio.", ["AspectRatio"], ["aspect ratio", "media", "responsive"]],
  ["avatar", "Avatar", "data-display", "beta", "An image with a resilient initials or text fallback.", ["Avatar", "AvatarImage", "AvatarFallback"], ["avatar", "profile", "initials"]],
  ["badge", "Badge", "data-display", "stable", "Compact semantic status or metadata label.", ["Badge", "badgeVariants"], ["badge", "status", "pill"]],
  ["breadcrumb", "Breadcrumb", "navigation", "beta", "Hierarchical page location and navigation.", ["Breadcrumb", "BreadcrumbList", "BreadcrumbItem", "BreadcrumbLink", "BreadcrumbPage", "BreadcrumbSeparator", "BreadcrumbEllipsis"], ["breadcrumb", "navigation", "hierarchy"]],
  ["button", "Button", "actions", "stable", "Primary action primitive with semantic variants and sizes.", ["Button", "buttonVariants"], ["button", "action", "link"]],
  ["calendar", "Calendar", "forms", "stable", "Single-date and date-range calendar selection.", ["Calendar"], ["calendar", "date", "range"]],
  ["card", "Card", "data-display", "stable", "Composable bordered content surface.", ["Card", "CardHeader", "CardFooter", "CardTitle", "CardAction", "CardDescription", "CardContent"], ["card", "surface", "panel"]],
  ["checkbox", "Checkbox", "forms", "stable", "Checked, unchecked and indeterminate form control.", ["Checkbox"], ["checkbox", "checked", "indeterminate"]],
  ["collapsible", "Collapsible", "disclosure", "stable", "A single expandable content region.", ["Collapsible", "CollapsibleTrigger", "CollapsibleContent"], ["collapsible", "disclosure", "expand"]],
  ["dialog", "Dialog", "overlays", "stable", "Modal content with focus management and composable regions.", ["Dialog", "DialogTrigger", "DialogClose", "DialogContent", "DialogHeader", "DialogFooter", "DialogTitle", "DialogDescription"], ["dialog", "modal", "overlay"]],
  ["dropdown-menu", "Dropdown Menu", "overlays", "stable", "Keyboard-navigable action and selection menu.", ["DropdownMenu", "DropdownMenuTrigger", "DropdownMenuContent", "DropdownMenuItem", "DropdownMenuCheckboxItem", "DropdownMenuRadioGroup", "DropdownMenuRadioItem", "DropdownMenuLabel", "DropdownMenuSeparator", "DropdownMenuShortcut", "DropdownMenuGroup", "DropdownMenuSub", "DropdownMenuSubTrigger", "DropdownMenuSubContent"], ["dropdown", "menu", "actions"]],
  ["form", "Form", "forms", "beta", "Framework-native form composition and validation messaging.", ["Form", "FormField", "FormItem", "FormLabel", "FormControl", "FormDescription", "FormMessage", "useFormField"], ["form", "validation", "field"]],
  ["input", "Input", "forms", "stable", "Text and native input types with semantic invalid states.", ["Input"], ["input", "field", "text"]],
  ["input-otp", "Input OTP", "forms", "stable", "Grouped one-time-code entry slots.", ["InputOTP", "InputOTPGroup", "InputOTPSlot", "InputOTPSeparator"], ["otp", "verification", "code"]],
  ["label", "Label", "forms", "stable", "Accessible label for a form control.", ["Label"], ["label", "form", "caption"]],
  ["page-container", "Page Container", "layout", "stable", "Canonical responsive page width and gutters.", ["PageContainer"], ["page container", "layout", "gutter"]],
  ["page-header", "Page Header", "layout", "stable", "Page title, subtitle and responsive action region.", ["PageHeader"], ["page header", "title", "actions"]],
  ["pagination", "Pagination", "navigation", "beta", "Composable page navigation links and ellipsis.", ["Pagination", "PaginationContent", "PaginationItem", "PaginationLink", "PaginationPrevious", "PaginationNext", "PaginationEllipsis"], ["pagination", "pages", "navigation"]],
  ["popover", "Popover", "overlays", "stable", "Anchored non-modal floating content.", ["Popover", "PopoverTrigger", "PopoverContent", "PopoverAnchor"], ["popover", "floating", "overlay"]],
  ["progress", "Progress", "feedback", "beta", "Determinate progress indicator.", ["Progress"], ["progress", "completion", "loading"]],
  ["radio-group", "Radio Group", "forms", "stable", "Mutually exclusive options with keyboard navigation.", ["RadioGroup", "RadioGroupItem"], ["radio", "choice", "group"]],
  ["scroll-area", "Scroll Area", "layout", "stable", "Styled overflow region with optional scrollbars.", ["ScrollArea", "ScrollBar"], ["scroll area", "overflow", "viewport"]],
  ["select", "Select", "forms", "stable", "Single-option selection with reliable framework-native form semantics.", ["Select", "SelectTrigger", "SelectValue", "SelectContent", "SelectGroup", "SelectLabel", "SelectItem", "SelectSeparator", "SelectScrollUpButton", "SelectScrollDownButton"], ["select", "option", "dropdown"]],
  ["separator", "Separator", "layout", "stable", "Horizontal or vertical visual separator.", ["Separator"], ["separator", "divider", "rule"]],
  ["sheet", "Sheet", "overlays", "stable", "Modal panel entering from any viewport edge.", ["Sheet", "SheetTrigger", "SheetClose", "SheetContent", "SheetHeader", "SheetFooter", "SheetTitle", "SheetDescription"], ["sheet", "panel", "drawer"]],
  ["skeleton", "Skeleton", "feedback", "beta", "Placeholder surface for loading content.", ["Skeleton"], ["skeleton", "loading", "placeholder"]],
  ["slider", "Slider", "forms", "beta", "Single or ranged numeric input.", ["Slider"], ["slider", "range", "value"]],
  ["toast", "Toast / Sonner", "feedback", "stable", "Host-neutral toast viewport and notification surface.", ["Toaster"], ["toast", "sonner", "notification"]],
  ["stepper", "Stepper", "navigation", "stable", "Bounded numeric increment and decrement control.", ["Stepper"], ["stepper", "steps", "number"]],
  ["switch", "Switch", "forms", "stable", "Binary setting control.", ["Switch"], ["switch", "toggle", "boolean"]],
  ["table", "Table", "data-display", "stable", "Composable semantic table primitives.", ["Table", "TableHeader", "TableBody", "TableFooter", "TableHead", "TableRow", "TableCell", "TableCaption"], ["table", "data", "rows"]],
  ["tabs", "Tabs", "navigation", "stable", "Segmented content navigation with keyboard support.", ["Tabs", "TabsList", "TabsTrigger", "TabsContent"], ["tabs", "navigation", "panel"]],
  ["textarea", "Textarea", "forms", "stable", "Multi-line text input.", ["Textarea"], ["textarea", "multiline", "form"]],
  ["toggle", "Toggle", "actions", "stable", "Single pressed or unpressed action.", ["Toggle", "toggleVariants"], ["toggle", "pressed", "button"]],
  ["toggle-group", "Toggle Group", "actions", "stable", "Single- or multiple-selection group of pressed actions.", ["ToggleGroup", "ToggleGroupItem"], ["toggle group", "segmented", "selection"]],
  ["tooltip", "Tooltip", "overlays", "stable", "Short non-essential help shown on hover or focus.", ["Tooltip", "TooltipTrigger", "TooltipContent", "TooltipProvider"], ["tooltip", "hint", "hover"]],
];

const p = (name, type, required = false, defaultValue, description) => ({ name, type, required, ...(defaultValue === undefined ? {} : { default: defaultValue }), ...(description ? { description } : {}) });
const named = (name, isDefault = false, description) => ({ name, ...(description ? { description } : {}), ...(isDefault ? { default: true } : {}) });

const variants = {
  alert: ["default", "destructive"],
  badge: ["default", "secondary", "destructive", "outline", "success", "warning", "tint"],
  button: ["default", "destructive", "outline", "secondary", "ghost", "link"],
  sheet: ["top", "right", "bottom", "left"],
  toggle: ["default", "outline"],
  "toggle-group": ["default", "outline"],
};
const sizes = {
  button: ["default", "sm", "lg", "icon"],
  toggle: ["default", "sm", "lg"], "toggle-group": ["default", "sm", "lg"],
};

const reactProps = {
  accordion: [p("type", '"single" | "multiple"', true), p("collapsible", "boolean", false, false), p("defaultValue", "string | string[]")],
  alert: [p("variant", '"default" | "destructive"', false, "default")],
  "alert-dialog": [p("open", "boolean"), p("defaultOpen", "boolean", false, false), p("onOpenChange", "(open: boolean) => void")],
  "aspect-ratio": [p("ratio", "number", false, 1)],
  avatar: [],
  badge: [p("variant", "BadgeVariant", false, "default"), p("asChild", "boolean", false, false), p("dot", "boolean", false, false)],
  breadcrumb: [],
  button: [p("variant", "ButtonVariant", false, "default"), p("size", "ButtonSize", false, "default"), p("asChild", "boolean", false, false), p("type", "ButtonHTMLType", false, "button")],
  calendar: [p("mode", '"single" | "range"'), p("selected", "Date | DateRange"), p("onSelect", "selection callback"), p("showOutsideDays", "boolean", false, true), p("showYearMonthDropdowns", "boolean", false, false)],
  card: [],
  checkbox: [p("checked", "boolean | 'indeterminate'"), p("defaultChecked", "boolean"), p("onCheckedChange", "(checked) => void"), p("disabled", "boolean", false, false)],
  collapsible: [p("open", "boolean"), p("defaultOpen", "boolean", false, false), p("onOpenChange", "(open: boolean) => void")],
  dialog: [p("open", "boolean"), p("defaultOpen", "boolean", false, false), p("onOpenChange", "(open: boolean) => void")],
  "dropdown-menu": [p("open", "boolean"), p("defaultOpen", "boolean", false, false), p("onOpenChange", "(open: boolean) => void")],
  form: [p("control", "react-hook-form Control", true), p("name", "FieldPath", true)],
  input: [p("type", "HTMLInputTypeAttribute", false, "text"), p("aria-invalid", "boolean | 'true' | 'false'", false, false)],
  "input-otp": [p("maxLength", "number", true), p("value", "string"), p("onChange", "(value: string) => void")],
  label: [p("htmlFor", "string")],
  "page-container": [p("children", "ReactNode", true)],
  "page-header": [p("title", "ReactNode", true), p("subtitle", "ReactNode"), p("actions", "ReactNode")],
  pagination: [p("aria-label", "string", false, "pagination")],
  popover: [p("open", "boolean"), p("defaultOpen", "boolean", false, false), p("onOpenChange", "(open: boolean) => void")],
  progress: [p("value", "number | null", false, null), p("max", "number", false, 100)],
  "radio-group": [p("value", "string"), p("defaultValue", "string"), p("onValueChange", "(value: string) => void")],
  "scroll-area": [p("type", '"auto" | "always" | "scroll" | "hover"', false, "hover")],
  select: [p("value", "string"), p("defaultValue", "string"), p("onValueChange", "(value: string) => void"), p("disabled", "boolean", false, false)],
  separator: [p("orientation", '"horizontal" | "vertical"', false, "horizontal"), p("decorative", "boolean", false, true)],
  sheet: [p("open", "boolean"), p("defaultOpen", "boolean", false, false), p("onOpenChange", "(open: boolean) => void"), p("side", '"top" | "right" | "bottom" | "left"', false, "right")],
  skeleton: [],
  slider: [p("value", "number[]"), p("defaultValue", "number[]"), p("min", "number", false, 0), p("max", "number", false, 100), p("step", "number", false, 1)],
  toast: [p("theme", '"light" | "dark" | "system"', false, "system"), p("position", "ToasterPosition", false, "bottom-right")],
  stepper: [p("value", "number", true), p("onChange", "(value: number) => void", true), p("min", "number", false, 0), p("max", "number | null", false, null), p("disabled", "boolean", false, false)],
  switch: [p("checked", "boolean"), p("defaultChecked", "boolean"), p("onCheckedChange", "(checked: boolean) => void"), p("disabled", "boolean", false, false)],
  table: [],
  tabs: [p("value", "string"), p("defaultValue", "string"), p("onValueChange", "(value: string) => void"), p("orientation", '"horizontal" | "vertical"', false, "horizontal")],
  textarea: [p("aria-invalid", "boolean | 'true' | 'false'", false, false), p("rows", "number")],
  toggle: [p("variant", "ToggleVariant", false, "default"), p("size", "ToggleSize", false, "default"), p("pressed", "boolean"), p("onPressedChange", "(pressed: boolean) => void")],
  "toggle-group": [p("type", '"single" | "multiple"', true), p("variant", "ToggleVariant", false, "default"), p("size", "ToggleSize", false, "default"), p("value", "string | string[]")],
  tooltip: [p("delayDuration", "number", false, 0), p("open", "boolean"), p("onOpenChange", "(open: boolean) => void")],
};

const bladeProps = {
  accordion: [p("type", '"single" | "multiple"', false, "single"), p("collapsible", "bool", false, true), p("defaultValue", "string | array | null", false, null)],
  alert: [p("variant", "string", false, "default")],
  "alert-dialog": [p("open", "bool", false, false)],
  "aspect-ratio": [p("ratio", "string | float", false, "16 / 9")],
  avatar: [],
  badge: [p("variant", "string", false, "default"), p("dot", "bool", false, false), p("href", "string | null", false, null)],
  breadcrumb: [],
  button: [p("variant", "string", false, "default"), p("size", "string", false, "default"), p("type", "string", false, "button"), p("href", "string | null", false, null), p("disabled", "bool", false, false)],
  calendar: [p("name", "string", false, "date"), p("value", "string", false, ""), p("min", "string | null", false, null), p("max", "string | null", false, null), p("label", "string", false, "Choose date")],
  card: [],
  checkbox: [p("name", "string", true), p("id", "string | null", false, null), p("value", "mixed", false, "1"), p("label", "string", false, ""), p("bag", "string", false, "default"), p("checked", "bool", false, false)],
  collapsible: [p("open", "bool", false, false)],
  dialog: [p("open", "bool", false, false)],
  "dropdown-menu": [p("open", "bool", false, false), p("placement", "string", false, "bottom-start")],
  form: [p("action", "string", false, ""), p("method", "string", false, "get"), p("upload", "bool", false, false)],
  input: [p("name", "string", true), p("id", "string | null", false, null), p("type", "string", false, "text"), p("value", "mixed", false, ""), p("label", "string", false, ""), p("bag", "string", false, "default"), p("size", '"default" | "sm" | "xs"', false, "default")],
  "input-otp": [p("name", "string", true), p("length", "int", false, 6), p("value", "string", false, ""), p("label", "string", false, "One-time password")],
  label: [p("for", "string | null", false, null), p("value", "string | null", false, null)],
  "page-container": [],
  "page-header": [p("title", "string | null", false, null), p("subtitle", "string | null", false, null)],
  pagination: [],
  popover: [p("open", "bool", false, false), p("placement", "string", false, "bottom-start")],
  progress: [p("value", "float", false, 0), p("max", "float", false, 100), p("label", "string | null", false, null)],
  "radio-group": [p("label", "string | null", false, null), p("name", "string", true, undefined, "Required on each <x-ui.radio-group.item>."), p("value", "mixed", false, "", "Item value."), p("bag", "string", false, "default", "Item validation error bag."), p("checked", "bool", false, false, "Item fallback checked state.")],
  "scroll-area": [p("orientation", '"vertical" | "horizontal" | "both"', false, "vertical")],
  select: [p("name", "string", true), p("id", "string | null", false, null), p("options", "array | enum class", false, []), p("value", "mixed", false, ""), p("label", "string", false, ""), p("bag", "string", false, "default"), p("multiple", "bool", false, false), p("placeholder", "string", false, "")],
  separator: [p("orientation", '"horizontal" | "vertical"', false, "horizontal"), p("decorative", "bool", false, true)],
  sheet: [p("side", '"top" | "right" | "bottom" | "left"', false, "right"), p("open", "bool", false, false)],
  skeleton: [],
  slider: [p("name", "string", true), p("value", "float", false, 0), p("min", "float", false, 0), p("max", "float", false, 100), p("step", "float", false, 1), p("label", "string", false, "Value")],
  toast: [p("variant", '"default" | "destructive"', false, "default"), p("duration", "int", false, 5000), p("title", "string | null", false, null)],
  stepper: [p("name", "string", true), p("value", "float", false, 0), p("min", "float", false, 0), p("max", "float | null", false, null), p("step", "float", false, 1), p("label", "string", false, "Quantity"), p("disabled", "bool", false, false)],
  switch: [p("name", "string", true), p("checked", "bool", false, false), p("value", "string", false, "1"), p("label", "string | null", false, null), p("disabled", "bool", false, false)],
  table: [],
  tabs: [p("defaultValue", "string", true)],
  textarea: [p("name", "string", true), p("id", "string | null", false, null), p("value", "mixed", false, ""), p("label", "string", false, ""), p("bag", "string", false, "default"), p("rows", "int", false, 3)],
  toggle: [p("pressed", "bool", false, false), p("variant", "string", false, "default"), p("size", "string", false, "default")],
  "toggle-group": [p("type", '"single" | "multiple"', false, "single"), p("value", "string | array"), p("variant", "string", false, "default"), p("size", "string", false, "default")],
  tooltip: [p("open", "bool", false, false), p("placement", "string", false, "top"), p("delay", "int", false, 0)],
};

const slots = {
  alert: ["default", "title", "description"], "alert-dialog": ["default", "trigger", "header", "title", "description", "footer"],
  avatar: ["default", "image", "fallback"], breadcrumb: ["default"], card: ["default", "header", "title", "description", "action", "content", "footer"],
  dialog: ["default", "trigger", "header", "title", "description", "content", "footer"],
  "dropdown-menu": ["default", "trigger"], form: ["default"], "page-header": ["default", "actions"], popover: ["default", "trigger"],
  sheet: ["default", "trigger", "header", "title", "description", "content", "footer"], tabs: ["default", "list", "content"], tooltip: ["default", "trigger", "content"],
};

const eventMap = {
  accordion: ["ui:accordion:change"], "alert-dialog": ["ui:alert-dialog:change", "ui:alert-dialog:confirm"], calendar: ["ui:calendar:change"],
  collapsible: ["ui:collapsible:change"], dialog: ["ui:dialog:change"], "dropdown-menu": ["ui:dropdown-menu:change"], "input-otp": ["ui:input-otp:change"],
  popover: ["ui:popover:change"], sheet: ["ui:sheet:change"],
  slider: ["ui:slider:change"], stepper: ["ui:stepper:change"], switch: ["ui:switch:change"], tabs: ["ui:tabs:change"],
  toggle: ["ui:toggle:change"], "toggle-group": ["ui:toggle-group:change"], toast: ["ui:toast:change"], tooltip: ["ui:tooltip:change"],
};

const legacyTags = {
  alert: ["<x-action-message>", "<x-auth-session-status>", "<x-session-status>"],
  badge: ["<x-badge>", "<x-ref-badge>", "<x-source-badge>", "<x-users.status-badge>"],
  button: ["<x-button>", "<x-button.action>", "<x-button.link>"],
  collapsible: ["<x-toggle-button>"], dialog: ["<x-modal>"],
  "dropdown-menu": ["<x-popover>", "<x-popover.item>", "<x-popover.separator>"],
  input: ["<x-input>"], label: ["<x-label>"], select: ["<x-select>"], textarea: ["<x-textarea>"], checkbox: ["<x-checkbox>"],
  "page-container": ["<x-container>"], "page-header": ["<x-layouts.app.page>", "<x-layouts.admin.page>"], "radio-group": ["<x-radio>"],
  separator: ["<x-separator>"], sheet: ["<x-sidebar>", "<x-sidebar.toggle>"],
  table: ["<x-table.wrapper>", "<x-table.org-th>", "<x-table.org-td>", "<x-table.dash-th>", "<x-table.dash-td>", "<x-table.responsive.table>", "<x-table.responsive.tr>", "<x-table.responsive.td>"],
  tabs: ["<x-tabs>", "<x-tab-panel>"], "toggle-group": ["<x-button.group>"],
};

const iconMappings = {
  accordion: [["expand", "ChevronDown", "caret-down", "16px", "regular"]],
  breadcrumb: [["more", "MoreHorizontal", "dots-three", "16px", "regular"], ["separator", "ChevronRight", "caret-right", "14px", "regular"]],
  calendar: [["previous month", "ChevronLeft", "caret-left", "16px", "bold"], ["next month", "ChevronRight", "caret-right", "16px", "bold"]],
  checkbox: [["checked", "Check", "check", "14px", "bold"]], dialog: [["close", "X", "x", "16px", "regular"]],
  "dropdown-menu": [["checked", "Check", "check", "14px", "bold"], ["submenu", "ChevronRight", "caret-right", "14px", "regular"]],
  "input-otp": [["separator", "Minus", "minus", "16px", "regular"]], pagination: [["previous", "ChevronLeft", "caret-left", "16px", "regular"], ["next", "ChevronRight", "caret-right", "16px", "regular"]],
  "radio-group": [["selected", "Circle", "circle", "8px", "fill"]], select: [["open", "ChevronDown", "caret-down", "16px", "regular"]], sheet: [["close", "X", "x", "16px", "regular"]],
};

const differences = {
  "aspect-ratio": ["React follows Radix's 1:1 default ratio; Blade defaults to 16:9. Pass an explicit ratio when cross-framework output must match."],
  calendar: ["React uses React DayPicker; Blade uses the library-owned Alpine date-grid controller while preserving the same visible calendar contract."],
  form: ["React validation is client-controlled through react-hook-form; Blade preserves CSRF, method spoofing, old values, named error bags and server validation."],
  "input-otp": ["The Blade edition uses a library-owned Alpine controller instead of the React input-otp package."],
  "scroll-area": ["Blade retains native overflow and scrollbar semantics; React delegates the viewport and scrollbar parts to Radix."],
  select: ["Blade intentionally uses a native select for form reliability. Its operating-system popup and multiple-selection mode do not visually match the React popup."],
  toast: ["React uses Sonner; Blade uses the library-owned Alpine toast store and event lifecycle."],
};

const stateful = new Set(["accordion", "alert-dialog", "calendar", "checkbox", "collapsible", "dialog", "dropdown-menu", "input-otp", "popover", "radio-group", "select", "sheet", "slider", "stepper", "switch", "tabs", "toggle", "toggle-group", "tooltip"]);
const visualStates = (id) => {
  const values = ["default", "disabled", "focus-visible"];
  if (stateful.has(id)) values.push("controlled", "uncontrolled");
  if (["checkbox", "radio-group", "switch", "toggle", "toggle-group"].includes(id)) values.push("checked");
  if (["input", "textarea", "select", "checkbox", "radio-group", "form", "input-otp"].includes(id)) values.push("invalid");
  if (["accordion", "alert-dialog", "collapsible", "dialog", "dropdown-menu", "popover", "sheet", "tooltip"].includes(id)) values.push("open", "closed");
  return values;
};

const runtimeFor = (id, bladeDeps) => {
  const names = [];
  if (new Set(["accordion", "alert-dialog", "calendar", "collapsible", "dialog", "dropdown-menu", "input-otp", "popover", "sheet", "slider", "stepper", "switch", "tabs", "toast", "toggle", "toggle-group", "tooltip"]).has(id)) names.push("alpinejs");
  if (["accordion", "collapsible"].includes(id)) names.push("@alpinejs/collapse");
  if (["alert-dialog", "dialog", "sheet"].includes(id)) names.push("@alpinejs/focus");
  if (["dropdown-menu", "popover", "tooltip"].includes(id)) names.push("@floating-ui/dom");
  const packageMap = bladeDeps.npm ?? bladeDeps.dependencies ?? bladeDeps.runtimeDependencies ?? {};
  return names.map((name) => ({ name, version: packageMap[name] ?? (name === "alpinejs" ? "3.15.8" : "latest-compatible"), purpose: "Blade interaction runtime" }));
};

const phpFor = (id) => ({ input: ["App\\View\\Components\\Ui\\Input"], checkbox: ["App\\View\\Components\\Ui\\Checkbox"], "radio-group": ["App\\View\\Components\\Ui\\Radio"], select: ["App\\View\\Components\\Ui\\Select"], textarea: ["App\\View\\Components\\Ui\\Textarea"], form: ["App\\View\\Components\\Ui\\FormControl"], alert: [] }[id] ?? []);

async function walkFiles(directory) {
  try {
    const result = [];
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) result.push(...await walkFiles(path));
      else if (entry.isFile()) result.push(relative(root, path).split(sep).join("/"));
    }
    return result;
  } catch { return []; }
}

async function readJsonIfPresent(path) {
  try {
    return JSON.parse(await readFile(join(root, path), "utf8"));
  } catch (error) {
    if (error?.code === "ENOENT") return null;
    throw error;
  }
}

const reactFileFor = (id) => ["page-header", "page-container"].includes(id) ? "react/components/layout/page-header.tsx" : id === "toast" ? "react/components/ui/sonner.tsx" : `react/components/ui/${id}.tsx`;
const bladeFilesFor = async (id) => {
  const base = "blade/library/resources/views/components/ui";
  const files = [];
  const rootFile = `${base}/${id}.blade.php`;
  try { if ((await stat(join(root, rootFile))).isFile()) files.push(rootFile); } catch {}
  files.push(...await walkFiles(join(root, base, id)));
  if (id === "toast") {
    const sonnerRoot = `${base}/sonner.blade.php`;
    try { if ((await stat(join(root, sonnerRoot))).isFile()) files.push(sonnerRoot); } catch {}
    files.push(...await walkFiles(join(root, base, "sonner")));
  }
  return [...new Set(files)].sort();
};

const sourceInventory = JSON.parse(await readFile(join(root, "catalog/source-inventory.json"), "utf8"));
const sourceLock = JSON.parse(await readFile(join(root, "provenance/source-lock.json"), "utf8"));
const reactDependencies = JSON.parse(await readFile(join(root, "react/dependencies.json"), "utf8"));
const bladeDependencies = JSON.parse(await readFile(join(root, "blade/dependencies.json"), "utf8"));
const accessibilityReports = (await Promise.all([
  readJsonIfPresent("validation/reports/react-browser.json"),
  readJsonIfPresent("validation/reports/blade-browser.json"),
])).filter(Boolean);
const lockByPath = new Map((sourceLock.perFileLocks ?? []).map((item) => [item.path, item.sha256]));
const sourceById = new Map(sourceInventory.reactComponents.map((item) => [item.id, item.source]));

const acceptedVisualParityFindings = new Set([
  "alert-dialog:color-contrast",
  "aspect-ratio:color-contrast",
  "button:color-contrast",
]);
const allowedSeverities = new Set(["minor", "moderate", "serious", "critical"]);
const accessibilityFor = (id) => {
  const findings = [];
  let auditFailed = false;

  for (const report of accessibilityReports) {
    const framework = report.framework ?? "unknown";
    const accessibility = report.accessibility ?? {};
    if (accessibility.status === "failed") auditFailed = true;

    for (const violation of accessibility.violations ?? []) {
      if (violation.component !== id) continue;
      const accepted = acceptedVisualParityFindings.has(`${id}:${violation.id}`);
      const firstNode = violation.nodes?.[0];
      findings.push({
        id: `${framework}-${violation.id}`,
        severity: allowedSeverities.has(violation.impact) ? violation.impact : "moderate",
        status: accepted ? "accepted" : "open",
        summary: `${framework === "react" ? "React" : framework === "blade" ? "Blade" : framework} — ${violation.help ?? violation.description ?? violation.id}`,
        detail: [
          firstNode?.failureSummary ?? violation.description,
          violation.helpUrl,
          accepted ? "Retained for the approved visual-parity-first release and explicitly flagged for later token/design remediation." : null,
        ].filter(Boolean).join(" "),
      });
    }

    for (const timeout of accessibility.timeouts ?? []) {
      if (timeout.component !== id) continue;
      auditFailed = true;
      findings.push({
        id: `${framework}-axe-timeout`,
        severity: "critical",
        status: "open",
        summary: `${framework === "react" ? "React" : framework === "blade" ? "Blade" : framework} accessibility audit did not complete.`,
        detail: timeout.error ?? "The component requires a fresh axe audit.",
      });
    }
  }

  const completeFrameworkAudit = ["react", "blade"].every((framework) => accessibilityReports.some((report) =>
    report.framework === framework
      && report.accessibility?.status !== "failed"
      && report.accessibility?.auditedExamples >= rows.length,
  ));
  const auditStatus = auditFailed
    ? "failed"
    : !completeFrameworkAudit
      ? "pending"
      : findings.length
        ? "passed-with-findings"
        : "passed";

  return { wcagTarget: "WCAG 2.2 AA", auditStatus, findings };
};

await mkdir(join(root, "catalog/components"), { recursive: true });
await mkdir(join(root, "catalog/recipes"), { recursive: true });

const componentEntries = [];
for (const [id, title, category, maturity, description, exports, searchTerms] of rows) {
  const componentDeps = reactDependencies.perComponent?.[id] ?? { packages: [], internal: [] };
  const sourcePath = sourceById.get(id);
  const sourceSha = lockByPath.get(sourcePath);
  if (!sourcePath || !sourceSha) throw new Error(`Missing locked source record for ${id}`);
  const manifest = {
    "$schema": "../component.schema.json",
    schemaVersion: "1.0.0",
    id, title, description, category, maturity,
    searchTerms: [...new Set([...searchTerms, title.toLowerCase(), "react", "blade"])],
    react: {
      files: [reactFileFor(id)], exports,
      props: [...(reactProps[id] ?? []), p("className", "string", false, undefined, "Additional consumer layout or spacing classes.")],
      internalDependencies: componentDeps.internal ?? [],
      npmDependencies: (componentDeps.packages ?? []).map((name) => ({ name, version: reactDependencies.dependencies?.[name] ?? "exact-version-missing", purpose: "Direct component import" })),
      exampleFiles: [`react/examples/${id}/basic.tsx`],
    },
    blade: {
      files: await bladeFilesFor(id), canonicalTag: `<x-ui.${id}>`, legacyTags: legacyTags[id] ?? [],
      props: bladeProps[id] ?? [], slots: slots[id] ?? ["default"], events: eventMap[id] ?? [], phpDependencies: phpFor(id),
      runtimeDependencies: runtimeFor(id, bladeDependencies),
      installTargets: ["app/View/Components/Ui", "resources/views/components/ui", "resources/js/ui", "resources/css"],
      exampleFiles: [`blade/examples/${id}/basic.blade.php`],
    },
    shared: {
      variants: (variants[id] ?? ["default"]).map((value, index) => named(value, index === 0)),
      sizes: (sizes[id] ?? []).map((value, index) => named(value, index === 0)),
      states: visualStates(id),
      responsiveBehavior: ["Retains touch targets and usable wrapping at 360px.", ...(category === "overlays" ? ["Floating or modal content is constrained to the viewport."] : []), ...(["page-header", "page-container", "table"].includes(id) ? ["Layout adapts at the documented sm and lg breakpoints."] : [])],
      tokens: ["--background", "--foreground", "--primary", "--primary-foreground", "--muted", "--muted-foreground", "--border", "--input", "--ring", "--radius"],
      iconMappings: (iconMappings[id] ?? []).map(([meaning, react, blade, size, weight]) => ({ meaning, react, blade, size, weight })),
    },
    previews: [{ id: "basic", title: "Basic", reactExample: `react/examples/${id}/basic.tsx`, bladeExample: `blade/examples/${id}/basic.blade.php`, states: visualStates(id), supportsDirection: ["accordion", "breadcrumb", "dialog", "dropdown-menu", "pagination", "popover", "select", "sheet", "tabs", "tooltip"].includes(id) }],
    parity: { classification: differences[id] ? "documented-exception" : "framework-equivalent", intentionalDifferences: [...(differences[id] ?? []), ...(iconMappings[id] ? ["React uses Lucide and Blade uses Phosphor; semantic glyph, rendered size, weight, colour and alignment match while path shapes may differ."] : [])] },
    accessibility: accessibilityFor(id),
    source: { commit: sourceCommit, verifiedAt, files: [{ path: sourcePath, sha256: sourceSha }], decisionReferences: ["provenance/decisions.md#component-scope", ...(differences[id] ? ["foundations/docs/exceptions.md"] : [])] },
  };
  if (!manifest.blade.files.length) throw new Error(`No Blade files found for ${id}`);
  await writeFile(join(root, `catalog/components/${id}.json`), `${JSON.stringify(manifest, null, 2)}\n`);
  componentEntries.push({ id, title, category, kind: "component", maturity, manifest: `catalog/components/${id}.json`, frameworks: ["react", "blade"], searchTerms });
}

const recipeRows = [
  ["quick-launch", "Quick Launch", "dashboard", "Frequently used destination cards.", "QuickLaunchRecipe.tsx", ["quick launch", "dashboard", "shortcut"]],
  ["availability-toggle-list", "Availability Toggle List", "channels", "Availability switches with one default item.", "AvailabilityToggleListRecipe.tsx", ["availability", "toggle", "channel"]],
  ["channel-logo-picker", "Channel Logo Picker", "channels", "Host-controlled channel logo selection.", "ChannelLogoPickerRecipe.tsx", ["logo", "upload", "channel"]],
  ["booking-card", "Booking Card", "bookings", "Compact booking identity and status card.", "BookingCardRecipe.tsx", ["booking", "card", "summary"]],
  ["booking-details-dialog", "Booking Details Dialog", "bookings", "Read and action booking-detail composition.", "BookingDetailsDialogRecipe.tsx", ["booking", "details", "dialog"]],
  ["people-popover-content", "People Popover Content", "people", "Party quantities and accessibility selection.", "PeoplePopoverContentRecipe.tsx", ["people", "popover", "participants"]],
];
const recipeEntries = [];
for (const [id, title, category, description, reactFilename, searchTerms] of recipeRows) {
  const sourceRecord = sourceInventory.domainComponents.recipes.find((item) => item.id === id);
  const sourceSha = lockByPath.get(sourceRecord.source);
  if (!sourceSha) throw new Error(`Missing locked recipe source record for ${id}`);
  const manifest = {
    schemaVersion: "1.0.0", id, title, description, category, maturity: "stable", kind: "recipe",
    searchTerms, fixture: `recipes/${id}/fixtures/basic.json`, documentation: `recipes/${id}/README.md`,
    react: { files: [`recipes/${id}/react/${reactFilename}`], exampleData: `recipes/${id}/fixtures/basic.json` },
    blade: { files: [`recipes/${id}/blade/${id}.blade.php`], exampleData: `recipes/${id}/fixtures/basic.json` },
    contract: { support: "composition-recipe", standaloneApi: false, fixturePolicy: "neutral DTOs only", parity: "framework-equivalent" },
    source: { commit: sourceCommit, verifiedAt, files: [{ path: sourceRecord.source, sha256: sourceSha }], decisionReferences: ["provenance/decisions.md#domain-material"] },
  };
  await writeFile(join(root, `catalog/recipes/${id}.json`), `${JSON.stringify(manifest, null, 2)}\n`);
  recipeEntries.push({ id, title, category, kind: "recipe", maturity: "stable", manifest: `catalog/recipes/${id}.json`, frameworks: ["react", "blade"], searchTerms });
}

const crosswalkGroups = {
  canonical: ["badge.blade.php", "checkbox.blade.php", "container.blade.php", "error.blade.php", "field.blade.php", "form.blade.php", "heading.blade.php", "input.blade.php", "label.blade.php", "link.blade.php", "modal.blade.php", "radio.blade.php", "search.blade.php", "select.blade.php", "separator.blade.php", "stats-card.blade.php", "subheading.blade.php", "text.blade.php", "textarea.blade.php", "button/group.blade.php", "button/index.blade.php", "navlist/group.blade.php", "navlist/index.blade.php", "navlist/item.blade.php", "sidebar/index.blade.php", "sidebar/toggle.blade.php", "popover/index.blade.php", "popover/item.blade.php", "popover/separator.blade.php", "tab-panel.blade.php", "tabs.blade.php", "table/org-td.blade.php", "table/org-th.blade.php", "table/wrapper.blade.php"],
  alias: ["action-message.blade.php", "auth-session-status.blade.php", "ref-badge.blade.php", "session-status.blade.php", "source-badge.blade.php", "spacer.blade.php", "toggle-button.blade.php", "button/action.blade.php", "button/link.blade.php", "icons/bin.blade.php", "icons/edit.blade.php", "icons/eye.blade.php", "icons/reschedule.blade.php", "layouts/admin/page.blade.php", "layouts/app/page.blade.php", "table/dash-td.blade.php", "table/dash-th.blade.php", "table/responsive/table.blade.php", "table/responsive/td.blade.php", "table/responsive/tr.blade.php", "users/status-badge.blade.php"],
  reference: ["app-logo-icon.blade.php", "app-logo.blade.php", "auth-header.blade.php", "header.blade.php", "button/dashboard-link.blade.php", "epos/new-trackables.blade.php", "layouts/admin.blade.php", "layouts/admin/sidebar.blade.php", "layouts/app.blade.php", "layouts/app/sidebar.blade.php", "layouts/auth.blade.php", "layouts/auth/simple.blade.php", "settings/layout.blade.php", "users/card.blade.php", "users/group-selector.blade.php", "users/org-role-badge.blade.php", "users/role-card.blade.php", "users/seller-commission-rate-field.blade.php"],
  exclude: ["placeholder-pattern.blade.php", "layouts/admin/header.blade.php", "layouts/app/header.blade.php", "layouts/auth/card.blade.php", "layouts/auth/split.blade.php", "navbar/index.blade.php", "navbar/item.blade.php"],
};
const targetFor = (path, disposition) => {
  if (disposition === "reference") return null;
  if (disposition === "exclude") return null;
  const rules = [
    [/badge|status-badge/, "<x-ui.badge>"], [/checkbox/, "<x-ui.checkbox>"], [/container|layouts\/.+\/page/, "<x-ui.page-container>"], [/modal/, "<x-ui.dialog>"],
    [/(?:^|\/)input|search/, "<x-ui.input>"], [/label/, "<x-ui.label>"], [/radio/, "<x-ui.radio-group>"], [/select/, "<x-ui.select>"], [/separator|spacer/, "<x-ui.separator>"],
    [/textarea/, "<x-ui.textarea>"], [/button|toggle-button/, "<x-ui.button>"], [/popover/, "<x-ui.dropdown-menu>"], [/sidebar/, "<x-ui.sheet>"], [/tab/, "<x-ui.tabs>"], [/table/, "<x-ui.table>"],
    [/action-message|session-status/, "<x-ui.alert>"], [/icons\//, "Phosphor Blade icon"], [/error/, "<x-ui.form.message>"], [/field|form/, "<x-ui.form>"],
  ];
  return rules.find(([pattern]) => pattern.test(path))?.[1] ?? "Compatibility primitive documented in blade/INSTALL.md";
};
const crosswalkItems = [];
for (const [disposition, paths] of Object.entries(crosswalkGroups)) for (const path of paths) crosswalkItems.push({
  path, disposition, source: `_style-reference/multi-channel-sales-platform-main 2/resources/views/components/${path}`,
  target: targetFor(path, disposition),
  migration: disposition === "canonical" ? "Replace with the canonical target when touching the call site." : disposition === "alias" ? "Existing tag remains a thin wrapper; migrate opportunistically." : disposition === "reference" ? "Retain in the production application; no distributable source is shipped." : "Remove or leave unused; this source is intentionally outside the handoff.",
});
crosswalkItems.sort((a, b) => a.path.localeCompare(b.path));
await writeFile(join(root, "catalog/blade-crosswalk.json"), `${JSON.stringify({ schemaVersion: "1.0.0", sourceCommit, verifiedAt, counts: Object.fromEntries(Object.entries(crosswalkGroups).map(([key, value]) => [key, value.length])), phpClasses: ["FormControl", "Input", "Checkbox", "Radio", "Select", "Textarea", "Error"], items: crosswalkItems }, null, 2)}\n`);

const deferredReasons = {
  carousel: ["Unused complex primitive with no Blade counterpart or product evidence.", "A product flow requires ordered, horizontally paged content."],
  chart: ["Unused wrapper whose API is coupled to a charting dependency and has no Blade rendering counterpart.", "Shared data-visualisation requirements and Blade parity expectations are agreed."],
  "command-palette": ["Unused complex keyboard interaction with no production Blade basis.", "Global search or command navigation is commissioned."],
  "context-menu": ["Unused pointer-specific overlay with no production Blade basis.", "A validated use case also defines touch and keyboard alternatives."],
  drawer: ["Unused Vaul dependency overlaps the approved Sheet component.", "A drag-driven mobile bottom sheet is required rather than a standard Sheet."],
  "hover-card": ["Unused hover-first overlay with no production Blade basis.", "A non-essential preview interaction with equivalent focus behavior is needed."],
  menubar: ["Unused application-menu primitive with no production Blade basis.", "A desktop application menubar is part of an approved navigation model."],
  "navigation-menu": ["Unused scaffold; the only comparable production navbar is dead code.", "A public-site mega-menu or equivalent navigation is required."],
  "resizable-panels": ["Unused dependency-backed layout with no Blade counterpart.", "A persistent split-pane workflow is approved for both stacks."],
  sidebar: ["Unused reusable scaffold while live production sidebars remain application-bound shells.", "A host-neutral navigation data model and shell ownership boundary are agreed."],
};
const deferredEntries = sourceInventory.deferredReactComponents.map((item) => ({ id: item.id, title: item.id.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join(" "), source: item.source, reason: deferredReasons[item.id][0], revisitWhen: deferredReasons[item.id][1] }));
deferredEntries.find((item) => item.id === "command-palette").title = "Command Palette";
deferredEntries.find((item) => item.id === "resizable-panels").title = "Resizable Panels";

const catalog = {
  "$schema": "./catalog.schema.json", schemaVersion: "1.0.0", version: (await readFile(join(root, "VERSION"), "utf8")).trim(), name: "Scudamore's UI",
  components: componentEntries, recipes: recipeEntries,
  foundations: [
    { id: "tokens", title: "Tokens", data: ["foundations/data/tokens.json", "foundations/css/tokens.css", "foundations/css/tailwind-theme.css"], documentation: "foundations/docs/tokens.md" },
    { id: "brands", title: "Brands", data: ["foundations/data/brands.json", "foundations/css/brands.css"], documentation: "foundations/docs/theming.md" },
    { id: "typography", title: "Typography", data: ["foundations/css/fonts.css"], documentation: "foundations/docs/typography.md" },
    { id: "layout", title: "Layout", data: [], documentation: "foundations/docs/layout.md" },
    { id: "icons", title: "Icons", data: [], documentation: "foundations/docs/icons.md" },
    { id: "exceptions", title: "Exceptions", data: [], documentation: "foundations/docs/exceptions.md" },
  ],
  utilities: [{ id: "device-preview-frame", title: "Device Preview Frame", category: "documentation", kind: "utility", maturity: "infrastructure", manifest: "catalog/source-inventory.json", frameworks: ["react"], searchTerms: ["device", "preview", "viewport", "playground"] }],
  deferredComponents: deferredEntries,
  counts: { stable: 30, beta: 9, paired: 39, deferred: 10, recipes: 6, utilities: 1 },
};
await writeFile(join(root, "catalog/catalog.json"), `${JSON.stringify(catalog, null, 2)}\n`);

console.log(`Generated ${componentEntries.length} paired component manifests, ${recipeEntries.length} recipe manifests and ${crosswalkItems.length} Blade dispositions.`);
