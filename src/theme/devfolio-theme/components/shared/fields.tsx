/** Reusable field groups so every section exposes the same editor controls. */
import { TextField, FieldGroup } from '@hubspot/cms-components/fields';

type HeadingDefaults = { eyebrow: string; heading: string; intro?: string; anchor: string };

export function HeadingFields({ eyebrow, heading, intro = '', anchor }: HeadingDefaults) {
  return (
    <FieldGroup name="heading" label="Section heading" display="inline">
      <TextField name="eyebrow" label="Eyebrow (mono label)" default={eyebrow} />
      <TextField name="heading" label="Heading" default={heading} />
      <TextField name="intro" label="Intro" default={intro} allowNewLine />
      <TextField
        name="anchor"
        label="Anchor ID"
        helpText="Used for in-page links and the ⌘K command palette, e.g. #projects"
        default={anchor}
      />
    </FieldGroup>
  );
}
