import { Island } from '@hubspot/cms-components';
import { ModuleFields, TextField, ChoiceField, RepeatedFieldGroup } from '@hubspot/cms-components/fields';
import { Section, SectionHeading } from '../../shared/ui.tsx';
import { HeadingFields } from '../../shared/fields.tsx';
import { highlight } from '../../shared/highlight.ts';
import CodeTabs from '../../islands/CodeTabs.tsx?island';

/**
 * Code is tokenized on the server; the island only receives serialisable
 * tokens plus the raw code for the copy button, keeping the client bundle tiny.
 */
export function Component({ fieldValues }) {
  const { heading, files = [] } = fieldValues;

  const tabs = files.map((f) => ({
    filename: f.filename,
    language: f.language,
    code: f.code,
    tokens: highlight(f.code || '', f.language),
  }));

  return (
    <Section id={heading.anchor}>
      <div className="grid items-start gap-12 lg:grid-cols-[0.8fr_1.2fr] [&>*]:min-w-0">
        <div className="lg:sticky lg:top-28">
          <SectionHeading eyebrow={heading.eyebrow} heading={heading.heading} intro={heading.intro} />
        </div>
        <Island module={CodeTabs} hydrateOn="visible" tabs={tabs} />
      </div>
    </Section>
  );
}

const MODULE_SNIPPET = `import { Island } from '@hubspot/cms-components';
import { ModuleFields, TextField } from '@hubspot/cms-components/fields';
import Counter from '../islands/Counter.tsx?island';

// Server-rendered React module with a hydrated island
export function Component({ fieldValues }) {
  return (
    <section className="df-section">
      <h2 className="df-h2">{fieldValues.title}</h2>
      <Island module={Counter} hydrateOn="visible" start={0} />
    </section>
  );
}

export const fields = (
  <ModuleFields>
    <TextField name="title" label="Title" default="Hello HubSpot" />
  </ModuleFields>
);`;

const HUBL_SNIPPET = `{% extends "./layouts/base.hubl.html" %}

{% block body %}
  {# React modules dropped into a HubL drag-and-drop area #}
  {% dnd_area "home_dnd" label="Home sections" %}
    {% dnd_section full_width=true %}
      {% dnd_module path="../components/modules/TerminalHero" %}
      {% end_dnd_module %}
    {% end_dnd_section %}
  {% end_dnd_area %}
{% endblock body %}`;

const TAILWIND_SNIPPET = `// Theme-editor colors -> CSS variables -> Tailwind utilities
const themeColor = (name) => \`rgb(var(--df-\${name}) / <alpha-value>)\`;

export default {
  content: ['./components/**/*.{ts,tsx}', './templates/**/*.html'],
  theme: {
    extend: {
      colors: {
        accent: themeColor('accent'),
        surface: themeColor('surface'),
        muted: themeColor('muted'),
      },
    },
  },
  plugins: [typography],
};`;

const SHELL_SNIPPET = `# local dev with hot reload against real HubSpot data
npm run start

# build + deploy the project to the sandbox
hs project upload
hs project open`;

export const fields = (
  <ModuleFields>
    <HeadingFields
      eyebrow="under the hood"
      heading="How this site is built"
      intro="A HubSpot CMS theme written in React + TypeScript, styled with Tailwind, and deployed as a HubSpot project. Static by default, interactive where it counts."
      anchor="code"
    />
    <RepeatedFieldGroup
      name="files"
      label="Code tabs"
      occurrence={{ min: 1, max: 6, default: 4, sorting_label_field: 'files.filename' }}
      default={[
        { filename: 'TerminalHero.tsx', language: 'tsx', code: MODULE_SNIPPET },
        { filename: 'home.hubl.html', language: 'hubl', code: HUBL_SNIPPET },
        { filename: 'tailwind.config.js', language: 'js', code: TAILWIND_SNIPPET },
        { filename: 'terminal', language: 'bash', code: SHELL_SNIPPET },
      ]}
    >
      <TextField name="filename" label="File name" default="index.tsx" />
      <ChoiceField
        name="language"
        label="Language"
        display="select"
        default="tsx"
        choices={[
          ['tsx', 'TypeScript / JSX'],
          ['js', 'JavaScript'],
          ['hubl', 'HubL / HTML'],
          ['css', 'CSS'],
          ['json', 'JSON'],
          ['bash', 'Shell'],
        ]}
      />
      <TextField name="code" label="Code" default="console.log('hello');" allowNewLine />
    </RepeatedFieldGroup>
  </ModuleFields>
);

export const meta = { label: 'Devfolio · Code showcase' };
