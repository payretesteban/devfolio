import { Island } from '@hubspot/cms-components';
import {
  ModuleFields,
  TextField,
  LinkField,
  RepeatedFieldGroup,
  FieldGroup,
  BooleanField,
} from '@hubspot/cms-components/fields';
import { linkProps } from '../../shared/ui.tsx';
import TerminalTyper from '../../islands/TerminalTyper.tsx?island';

export function Component({ fieldValues }) {
  const { status, show_status, headline, highlight, subheadline, primary, secondary, terminal } = fieldValues;

  // Split the headline so the highlighted phrase gets the gradient treatment.
  const parts = highlight && headline.includes(highlight) ? headline.split(highlight) : [headline];

  return (
    <section className="relative pb-20 pt-36 md:pb-28 md:pt-44">
      <div className="df-container grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] [&>*]:min-w-0">
        <div className="animate-fade-up">
          {show_status && (
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] px-3 py-1.5 font-mono text-xs text-muted">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              {status}
            </p>
          )}
          <h1 className="m-0 text-[clamp(40px,6.4vw,76px)] font-extrabold leading-[1.02] tracking-[-0.035em]">
            {parts[0]}
            {parts.length > 1 && <span className="df-gradient-text">{highlight}</span>}
            {parts[1]}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted md:text-xl">{subheadline}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            {primary?.text && (
              <a className="df-btn df-btn-primary" {...linkProps(primary.link)}>
                {primary.text} <span aria-hidden="true">→</span>
              </a>
            )}
            {secondary?.text && (
              <a className="df-btn" {...linkProps(secondary.link)}>
                {secondary.text}
              </a>
            )}
          </div>
        </div>

        <Island
          module={TerminalTyper}
          hydrateOn="load"
          title={terminal.title}
          lines={(terminal.lines || []).map((l) => ({ command: l.command, output: l.output }))}
        />
      </div>
    </section>
  );
}

const link = (href: string, newTab = false) => ({
  url: { type: 'EXTERNAL' as const, href, content_id: null },
  open_in_new_tab: newTab,
});

export const fields = (
  <ModuleFields>
    <BooleanField name="show_status" label="Show availability badge" default={true} display="toggle" />
    <TextField name="status" label="Availability badge" default="Open to leadership roles, consulting & freelance" />
    <TextField name="headline" label="Headline" default="Building Teams, Products & Systems." allowNewLine />
    <TextField
      name="highlight"
      label="Highlighted phrase"
      helpText="Part of the headline rendered with the gradient"
      default="Products & Systems"
    />
    <TextField
      name="subheadline"
      label="Sub-headline"
      allowNewLine
      default="Technical Leader, Engineering Manager and Software Engineer with 15+ years building web products and leading engineering teams, including 4 years at HubSpot mentoring engineers. Now helping companies improve their products, engineering efficiency and AI adoption."
    />
    <FieldGroup name="primary" label="Primary button">
      <TextField name="text" label="Label" default="Book a Free Consultation" />
      <LinkField name="link" label="Link" default={link('https://cal.com/estebanpayret/30min', true)} />
    </FieldGroup>
    <FieldGroup name="secondary" label="Secondary button">
      <TextField name="text" label="Label" default="Explore My Services" />
      <LinkField name="link" label="Link" default={link('https://www.estebanpayret.com/services')} />
    </FieldGroup>
    <FieldGroup name="terminal" label="Terminal">
      <TextField name="title" label="Window title" default="zsh — ~/estebanpayret" />
      <RepeatedFieldGroup
        name="lines"
        label="Commands"
        occurrence={{ min: 1, max: 8, default: 5, sorting_label_field: 'terminal.lines.command' }}
        default={[
          { command: 'whoami', output: 'Esteban Payret · Tech Lead & People Manager' },
          { command: 'cat experience.txt', output: '15+ yrs building web products · 4 yrs at HubSpot' },
          { command: 'ls ./focus', output: 'products/  engineering-efficiency/  ai-adoption/' },
          { command: 'npm test', output: '✔ 326 passing · 96.3% coverage' },
          { command: 'echo $STATUS', output: 'Open to leadership roles, consulting & freelance' },
        ]}
      >
        <TextField name="command" label="Command" default="echo hello" />
        <TextField name="output" label="Output" default="hello" />
      </RepeatedFieldGroup>
    </FieldGroup>
  </ModuleFields>
);

export const meta = {
  label: 'Devfolio · Terminal hero',
};
