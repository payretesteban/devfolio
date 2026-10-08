import { Island, Form } from '@hubspot/cms-components';
import { ModuleFields, TextField, FormField, FieldGroup, LinkField } from '@hubspot/cms-components/fields';
import { Section, linkProps } from '../../shared/ui.tsx';
import { HeadingFields } from '../../shared/fields.tsx';
import CopyButton from '../../islands/CopyButton.tsx?island';

/**
 * Contact block backed by a native HubSpot form, so submissions land straight
 * in the CRM as contacts (and can trigger workflows).
 */
export function Component({ fieldValues }) {
  const { heading, email, response_time, booking } = fieldValues;
  const hasForm = !!fieldValues.form?.form_id;

  return (
    <Section id={heading.anchor}>
      <div className="relative overflow-hidden rounded-[calc(var(--df-radius)*1.6)] border border-line-strong bg-surface p-8 md:p-14">
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-accent/25 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent-alt/15 blur-3xl" />

        <div className="relative grid gap-12 lg:grid-cols-2">
          <div>
            <p className="df-eyebrow">{heading.eyebrow}</p>
            <h2 className="df-h2">{heading.heading}</h2>
            <p className="df-lead">{heading.intro}</p>

            {email && (
              <div className="mt-8 flex flex-wrap items-center gap-3 rounded-lg border border-line bg-bg/60 p-3 pl-4 font-mono text-sm">
                <span className="text-success">$</span>
                <a href={`mailto:${email}`} className="no-underline hover:text-accent-alt">
                  {email}
                </a>
                <Island module={CopyButton} hydrateOn="idle" value={email} label="Copy" wrapperClassName="ml-auto" />
              </div>
            )}
            {booking?.text && (
              <a className="df-btn df-btn-primary mt-6" {...linkProps(booking.link)}>
                {booking.text} <span aria-hidden="true">→</span>
              </a>
            )}
            {response_time && (
              <p className="mt-4 font-mono text-xs text-muted">
                <span className="text-success">●</span> {response_time}
              </p>
            )}
          </div>

          <div className="df-hs-form rounded-theme border border-line bg-bg/70 p-6 backdrop-blur md:p-8">
            {hasForm ? (
              <Form fieldPath="form" />
            ) : (
              <p className="m-0 font-mono text-sm text-muted">
                <span className="text-accent-alt">TODO:</span> pick a HubSpot form in this module's settings.
              </p>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}

export const fields = (
  <ModuleFields>
    <HeadingFields
      eyebrow="contact"
      heading="Let's work together"
      intro="Consulting, freelance or a full-time engineering leadership role: tell me what you're working on. Messages land straight in my HubSpot CRM."
      anchor="contact"
    />
    <TextField name="email" label="Email address" default="me@estebanpayret.com" />
    <TextField name="response_time" label="Response note" default="I reply within 2 business days" />
    <FieldGroup name="booking" label="Booking button">
      <TextField name="text" label="Label (leave empty to hide)" default="Book a free 30-min call" />
      <LinkField
        name="link"
        label="Link"
        default={{ url: { type: 'EXTERNAL', href: 'https://cal.com/estebanpayret/30min', content_id: null }, open_in_new_tab: true }}
      />
    </FieldGroup>
    <FormField
      name="form"
      label="HubSpot form"
      // Without embedVersions the picker only lists legacy (v2) forms;
      // forms built in HubSpot's new form editor are v4.
      embedVersions={['v2', 'v4']}
      default={{ response_type: 'inline', message: 'Thanks! I’ll get back to you within 2 business days.' }}
    />
  </ModuleFields>
);

export const meta = { label: 'Devfolio · Contact' };
