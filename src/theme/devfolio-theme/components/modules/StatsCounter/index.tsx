import { Island } from '@hubspot/cms-components';
import { ModuleFields, TextField, NumberField, RepeatedFieldGroup } from '@hubspot/cms-components/fields';
import { Section } from '../../shared/ui.tsx';
import CountUp from '../../islands/CountUp.tsx?island';

export function Component({ fieldValues }) {
  const { stats = [] } = fieldValues;
  return (
    <Section className="!py-16">
      <dl className="m-0 grid grid-cols-2 gap-px overflow-hidden rounded-theme border border-line bg-line md:grid-cols-4">
        {stats.map((s, i) => (
          <div key={i} className="flex flex-col-reverse bg-bg p-6 md:p-8">
            <dt className="mt-2 font-mono text-xs uppercase tracking-wider text-muted">{s.text}</dt>
            <dd className="m-0 text-4xl font-bold tracking-tight md:text-5xl">
              {/* hydrateOn="visible": the island only loads JS once scrolled into view */}
              <Island module={CountUp} hydrateOn="visible" wrapperTag="span" value={s.amount} prefix={s.prefix} suffix={s.suffix} />
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

export const fields = (
  <ModuleFields>
    <RepeatedFieldGroup
      name="stats"
      label="Stats"
      occurrence={{ min: 1, max: 8, default: 4, sorting_label_field: 'stats.text' }}
      default={[
        { prefix: '', amount: 15, suffix: '+', text: 'Years building for the web' },
        { prefix: '', amount: 4, suffix: '', text: 'Years at HubSpot' },
        { prefix: '', amount: 326, suffix: '', text: 'Passing tests' },
        { prefix: '', amount: 96.3, suffix: '%', text: 'Test coverage' },
      ]}
    >
      <TextField name="prefix" label="Prefix" default="" />
      <NumberField name="amount" label="Number" default={10} />
      <TextField name="suffix" label="Suffix" default="+" />
      <TextField name="text" label="Label" default="Stat" />
    </RepeatedFieldGroup>
  </ModuleFields>
);

export const meta = { label: 'Devfolio · Stats counter' };
