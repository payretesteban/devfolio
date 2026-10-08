import {
  ModuleFields,
  TextField,
  BooleanField,
  RepeatedFieldGroup,
  FieldGroup,
  LinkField,
} from '@hubspot/cms-components/fields';
import { Section, SectionHeading, splitList, linkProps } from '../../shared/ui.tsx';
import { HeadingFields } from '../../shared/fields.tsx';

/**
 * Timeline styled like `git log`: works for a career history or a changelog
 * / site log. Fully server-rendered, zero client JS.
 */
export function Component({ fieldValues }) {
  const { heading, entries = [], more } = fieldValues;

  return (
    <Section id={heading.anchor}>
      <SectionHeading eyebrow={heading.eyebrow} heading={heading.heading} intro={heading.intro} />
      <ol className="relative m-0 list-none border-l border-line p-0 pl-8 md:ml-4">
        {entries.map((e, i) => (
          <li key={i} className="group relative pb-12 last:pb-0">
            <span
              className={`absolute -left-[41px] top-1.5 grid h-[17px] w-[17px] place-items-center rounded-full border-2 ${
                e.current ? 'border-success bg-success/20' : 'border-line-strong bg-bg'
              }`}
              aria-hidden="true"
            >
              {e.current && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />}
            </span>
            <div className="mb-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs">
              <span className="text-[#f9a86b]">commit {hash(e.company + e.role)}</span>
              {e.current && <span className="rounded bg-success/15 px-1.5 py-0.5 text-success">HEAD → current</span>}
              <span className="text-muted">{e.period}</span>
            </div>
            <h3 className="m-0 text-xl font-semibold tracking-tight">
              {e.role}
              {e.company && (
                <>
                  {' '}
                  <span className="text-muted">@</span> <span className="df-gradient-text">{e.company}</span>
                </>
              )}
            </h3>
            <p className="mb-3 mt-2 max-w-3xl text-muted">{e.description}</p>
            <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0 empty:hidden">
              {splitList(e.stack).map((t) => (
                <li key={t} className="rounded bg-white/5 px-2 py-0.5 font-mono text-[11px] text-ink/80">
                  {t}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
      {more?.text && (
        <a className="df-btn mt-12" {...linkProps(more.link)}>
          <span className="font-mono text-accent-alt">$</span> {more.text} <span aria-hidden="true">→</span>
        </a>
      )}
    </Section>
  );
}

/** Deterministic short "commit hash" so SSR and editor previews always match. */
function hash(input = '') {
  let h = 5381;
  for (let i = 0; i < input.length; i++) h = ((h << 5) + h + input.charCodeAt(i)) >>> 0;
  return h.toString(16).padStart(7, '0').slice(0, 7);
}

const SITE = 'https://www.estebanpayret.com';

const entry = (n: number, role: string, description: string, stack = '', current = false) => ({
  role,
  company: '',
  period: `#${String(n).padStart(2, '0')}`,
  current,
  description,
  stack,
});

export const fields = (
  <ModuleFields>
    <HeadingFields
      eyebrow="git log --site"
      heading="Site log"
      intro="Building in public: the small wins, regressions and rabbit holes behind this site."
      anchor="log"
    />
    <RepeatedFieldGroup
      name="entries"
      label="Entries (newest first)"
      occurrence={{ min: 1, max: 24, default: 6, sorting_label_field: 'entries.role' }}
      default={[
        entry(12, 'The Scope Creep Trap', 'Shipped an interactive project scoping tool to The Lab.', 'Gemini API, Rule engine', true),
        entry(11, 'Fluent in Robot', 'Added the AI-powered Read & Listen language practice feature.', 'Gemini API, Web Speech'),
        entry(10, 'Form Over Function', 'Redesigned the log section to be more visual and less technical.', 'Design'),
        entry(9, 'Speed Checks & Sanity Checks', 'Built a live Performance dashboard with 10-minute caching.', 'PageSpeed API, Caching'),
        entry(8, 'Thirst Traps Defeated', 'Fixed a Next.js hydration error and added a test so it stays fixed.', 'Next.js, Vitest'),
        entry(7, 'The Facelift', 'Reworked navigation across every viewport, tablet breakpoints included.', 'Tailwind CSS'),
      ]}
    >
      <TextField name="role" label="Title / role" default="Entry" />
      <TextField name="company" label="Company (optional, shown as @company)" default="" />
      <TextField name="period" label="Period or number" default="#01" />
      <BooleanField name="current" label="Latest (HEAD)" default={false} display="toggle" />
      <TextField name="description" label="Description" default="" allowNewLine />
      <TextField name="stack" label="Tags (comma-separated)" default="" />
    </RepeatedFieldGroup>
    <FieldGroup name="more" label="Footer link">
      <TextField name="text" label="Label" default="Read the full log" />
      <LinkField name="link" label="Link" default={{ url: { type: 'EXTERNAL', href: `${SITE}/site-log`, content_id: null } }} />
    </FieldGroup>
  </ModuleFields>
);

export const meta = { label: 'Devfolio · Git-log timeline' };
