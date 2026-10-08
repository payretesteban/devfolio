import { ModuleFields, TextField, NumberField, RepeatedFieldGroup } from '@hubspot/cms-components/fields';
import '../../shared/ui.tsx';

/** Pure server-rendered module: an infinite CSS marquee, zero client JS. */
export function Component({ fieldValues }) {
  const { text: label, items = [], duration } = fieldValues;
  const names: string[] = items.map((i) => i.tech).filter(Boolean);
  if (!names.length) return null;

  return (
    <section className="border-y border-line bg-white/[0.015] py-8" aria-label={label}>
      <p className="df-container mb-5 text-center font-mono text-xs uppercase tracking-[0.2em] text-muted">{label}</p>
      <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <ul
          className="flex w-max animate-marquee list-none gap-3 p-0 hover:[animation-play-state:paused]"
          style={{ ['--marquee-duration' as string]: `${duration || 40}s` }}
        >
          {/* Rendered twice so translateX(-50%) loops seamlessly */}
          {[...names, ...names].map((name, i) => (
            <li
              key={i}
              aria-hidden={i >= names.length || undefined}
              className="whitespace-nowrap rounded-lg border border-line bg-surface px-4 py-2 font-mono text-sm text-ink/90"
            >
              <span className="mr-2 text-accent">◆</span>
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export const fields = (
  <ModuleFields>
    <TextField name="text" label="Label" default="Stack I build with" />
    <NumberField name="duration" label="Loop duration (seconds)" default={40} min={10} max={120} display="slider" suffix="s" />
    <RepeatedFieldGroup
      name="items"
      label="Technologies"
      occurrence={{ min: 1, max: 40, default: 12, sorting_label_field: 'items.tech' }}
      default={[
        'React', 'TypeScript', 'Next.js', 'AWS', 'Sanity', 'Tailwind CSS',
        'Vitest', 'Gemini API', 'PageSpeed API', 'HubSpot CMS', 'HubL', 'CMS React',
      ].map((tech) => ({ tech }))}
    >
      <TextField name="tech" label="Technology" default="React" />
    </RepeatedFieldGroup>
  </ModuleFields>
);

export const meta = { label: 'Devfolio · Tech marquee' };
