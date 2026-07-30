import Alpine from 'alpinejs';
import collapse from '@alpinejs/collapse';
import focus from '@alpinejs/focus';
import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';

const dispatch = (el, component, value) => {
  el.dispatchEvent(new CustomEvent(`ui:${component}:change`, {
    bubbles: true,
    detail: { value },
  }));
};

export function registerUi(runtime = Alpine) {
  runtime.data('uiDisclosure', (initial = false, component = 'collapsible') => ({
    open: Boolean(initial),
    toggle() {
      this.open = !this.open;
      dispatch(this.$root, component, this.open);
    },
    close() {
      if (!this.open) return;
      this.open = false;
      dispatch(this.$root, component, false);
    },
  }));

  runtime.data('uiOverlay', (initial = false, component = 'dialog') => ({
    open: Boolean(initial),
    returnFocus: null,
    show(trigger = document.activeElement) {
      this.returnFocus = trigger;
      this.open = true;
      dispatch(this.$root, component, true);
      this.$nextTick(() => this.$refs.panel?.focus());
    },
    hide() {
      if (!this.open) return;
      this.open = false;
      dispatch(this.$root, component, false);
      this.$nextTick(() => this.returnFocus?.focus?.());
    },
  }));

  runtime.data('uiFloating', (initial = false, placement = 'bottom-start', component = 'popover', delay = 0) => ({
    open: Boolean(initial),
    cleanup: null,
    timer: null,
    async position() {
      if (!this.$refs.trigger || !this.$refs.panel) return;
      const update = async () => {
        const { x, y } = await computePosition(this.$refs.trigger, this.$refs.panel, {
          placement,
          middleware: [offset(4), flip(), shift({ padding: 8 })],
        });
        Object.assign(this.$refs.panel.style, { left: `${x}px`, top: `${y}px` });
      };
      this.cleanup?.();
      this.cleanup = autoUpdate(this.$refs.trigger, this.$refs.panel, update);
      await update();
    },
    show() {
      clearTimeout(this.timer);
      const reveal = async () => {
        if (this.open) return;
        this.open = true;
        dispatch(this.$root, component, true);
        await this.$nextTick(() => this.position());
      };
      if (Number(delay) > 0) this.timer = setTimeout(reveal, Number(delay));
      else reveal();
    },
    toggle() {
      if (this.open) this.close(false);
      else this.show();
    },
    close(returnFocus = true) {
      clearTimeout(this.timer);
      if (!this.open) return;
      this.open = false;
      this.cleanup?.();
      dispatch(this.$root, component, false);
      if (returnFocus) this.$nextTick(() => this.$refs.trigger?.focus());
    },
    focusItem(delta) {
      const items = [...(this.$refs.panel?.querySelectorAll('[role^=menuitem]:not([disabled])') ?? [])];
      if (!items.length) return;
      const current = items.indexOf(document.activeElement);
      items[(current + delta + items.length) % items.length]?.focus();
    },
    focusFirst() { this.$refs.panel?.querySelector('[role^=menuitem]:not([disabled])')?.focus(); },
    focusLast() { [...(this.$refs.panel?.querySelectorAll('[role^=menuitem]:not([disabled])') ?? [])].at(-1)?.focus(); },
    destroy() { clearTimeout(this.timer); this.cleanup?.(); },
  }));

  runtime.data('uiToggle', (initial = false, component = 'toggle') => ({
    on: Boolean(initial),
    toggle() {
      this.on = !this.on;
      dispatch(this.$root, component, this.on);
    },
  }));

  runtime.data('uiTabs', (initial) => ({
    active: initial,
    select(value) {
      this.active = value;
      dispatch(this.$root, 'tabs', value);
    },
  }));

  runtime.data('uiStepper', (initial = 0, min = 0, max = null, step = 1) => ({
    value: Number(initial),
    set(next) {
      const bounded = Math.max(Number(min), max === null ? Number(next) : Math.min(Number(max), Number(next)));
      this.value = bounded;
      dispatch(this.$root, 'stepper', bounded);
    },
    increment() { this.set(this.value + Number(step)); },
    decrement() { this.set(this.value - Number(step)); },
  }));

  runtime.data('uiOtp', (initial = '', length = 6) => ({
    value: String(initial ?? '').slice(0, Number(length)),
    init() {
      this.$nextTick(() => {
        const chars = this.value.split('');
        this.$root.querySelectorAll('[data-slot="input-otp-slot"]').forEach((field, index) => { field.value = chars[index] ?? ''; });
      });
    },
    sync() {
      const fields = [...this.$root.querySelectorAll('[data-slot="input-otp-slot"]')];
      this.value = fields.map((field) => field.value).join('').slice(0, Number(length));
      dispatch(this.$root, 'input-otp', this.value);
    },
    input(event, index) {
      event.target.value = event.target.value.replace(/[^0-9A-Za-z]/g, '').slice(-1);
      this.sync();
      if (event.target.value) this.$root.querySelectorAll('[data-slot="input-otp-slot"]')[index + 1]?.focus();
    },
    keydown(event, index) {
      if (event.key === 'Backspace' && !event.target.value) this.$root.querySelectorAll('[data-slot="input-otp-slot"]')[index - 1]?.focus();
    },
    paste(event) {
      event.preventDefault();
      const chars = event.clipboardData.getData('text').replace(/[^0-9A-Za-z]/g, '').slice(0, Number(length)).split('');
      this.$root.querySelectorAll('[data-slot="input-otp-slot"]').forEach((field, index) => { field.value = chars[index] ?? ''; });
      this.sync();
    },
  }));

  runtime.data('uiCalendar', (value = '', min = null, max = null) => ({
    value,
    cursor: value ? new Date(`${value}T12:00:00`) : new Date(),
    min: min ? new Date(`${min}T12:00:00`) : null,
    max: max ? new Date(`${max}T12:00:00`) : null,
    get monthLabel() { return this.cursor.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }); },
    get weekdays() { return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; },
    get days() {
      const year = this.cursor.getFullYear();
      const month = this.cursor.getMonth();
      const first = new Date(year, month, 1);
      const start = new Date(year, month, 1 - first.getDay());
      return Array.from({ length: 42 }, (_, index) => {
        const date = new Date(start); date.setDate(start.getDate() + index);
        const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        return { date, iso, label: date.getDate(), outside: date.getMonth() !== month, disabled: (this.min && date < this.min) || (this.max && date > this.max) };
      });
    },
    get weeks() {
      const days = this.days;
      return Array.from({ length: 6 }, (_, index) => days.slice(index * 7, index * 7 + 7));
    },
    move(delta) { this.cursor = new Date(this.cursor.getFullYear(), this.cursor.getMonth() + delta, 1); },
    select(day) {
      if (day.disabled) return;
      this.value = day.iso;
      dispatch(this.$root, 'calendar', this.value);
    },
  }));
}

Alpine.plugin(collapse);
Alpine.plugin(focus);
registerUi(Alpine);

export { Alpine };
