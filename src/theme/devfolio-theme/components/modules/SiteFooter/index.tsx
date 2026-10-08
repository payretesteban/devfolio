import { ModuleFields, TextField, BooleanField, RepeatedFieldGroup } from '@hubspot/cms-components/fields';
import '../../shared/ui.tsx';
import { THEME_VERSION } from '../../shared/version.ts';

export function Component({ fieldValues }) {
  const { tagline, links = [], built_with, show_version } = fieldValues;
  const year = new Date().getFullYear();

  return (
    <div className="mt-12 border-t border-line">
      <div className="df-container flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="m-0 font-mono text-sm">
            <span className="text-success">➜</span> <span className="text-accent-alt">~</span> {tagline}
          </p>
          <p className="m-0 mt-2 font-mono text-xs text-muted">
            © {year} · {built_with}
            {show_version && <span className="ml-2 rounded border border-line px-1.5 py-0.5 text-accent-alt">v{THEME_VERSION}</span>}
          </p>
        </div>
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
          {links.map((l, i) => (
            <li key={i}>
              <a
                href={l.href}
                target={/^https?:/.test(l.href) ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="block rounded-lg border border-line px-3 py-1.5 font-mono text-xs text-muted no-underline transition hover:border-line-strong hover:text-ink"
              >
                {l.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export const fields = (
  <ModuleFields>
    <TextField name="tagline" label="Tagline" default="Esteban Payret · Building Teams, Products & Systems" />
    <TextField name="built_with" label="Built-with note" default="Built with HubSpot CMS React, TypeScript & Tailwind CSS" />
    <BooleanField name="show_version" label="Show theme version" default={true} display="toggle" />
    <RepeatedFieldGroup
      name="links"
      label="Links"
      occurrence={{ min: 0, max: 8, default: 4, sorting_label_field: 'links.text' }}
      default={[
        { text: 'LinkedIn', href: 'https://www.linkedin.com/in/esteban-payret/' },
        { text: 'GitHub', href: 'https://github.com/payretesteban' },
        { text: 'Email', href: 'mailto:me@estebanpayret.com' },
        { text: 'estebanpayret.com', href: 'https://www.estebanpayret.com' },
      ]}
    >
      <TextField name="text" label="Label" default="Link" />
      <TextField name="href" label="URL" default="https://" />
    </RepeatedFieldGroup>
  </ModuleFields>
);

export const meta = { label: 'Devfolio · Site footer' };
