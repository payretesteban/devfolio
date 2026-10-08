import { Island } from '@hubspot/cms-components';
import {
  ModuleFields,
  TextField,
  ImageField,
  BooleanField,
  RepeatedFieldGroup,
} from '@hubspot/cms-components/fields';
import { Section, SectionHeading, splitList } from '../../shared/ui.tsx';
import { HeadingFields } from '../../shared/fields.tsx';
import ProjectExplorer from '../../islands/ProjectExplorer.tsx?island';

export function Component({ fieldValues }) {
  const { heading, projects = [] } = fieldValues;

  const items = projects.map((p, i) => ({
    id: i,
    title: p.title,
    summary: p.summary,
    year: p.year,
    tags: splitList(p.tags),
    image: p.image?.src ? { src: p.image.src, alt: p.image.alt || p.title } : null,
    repoUrl: p.repo_url || '',
    liveUrl: p.live_url || '',
    featured: !!p.featured,
  }));

  return (
    <Section id={heading.anchor}>
      <SectionHeading eyebrow={heading.eyebrow} heading={heading.heading} intro={heading.intro} />
      <Island module={ProjectExplorer} hydrateOn="visible" projects={items} />
    </Section>
  );
}

const sample = (title, summary, tags, badge, live_url, featured = false) => ({
  title,
  summary,
  tags,
  year: badge,
  featured,
  repo_url: '',
  live_url,
  image: { src: '', alt: '' },
});

const SITE = 'https://www.estebanpayret.com';

export const fields = (
  <ModuleFields>
    <HeadingFields
      eyebrow="the lab"
      heading="Experiments & tools"
      intro="Small, real things I build to explore ideas, from AI scoping tools to a text adventure. Filter by stack to see what's under the hood."
      anchor="lab"
    />
    <RepeatedFieldGroup
      name="projects"
      label="Projects"
      occurrence={{ min: 1, max: 24, default: 6, sorting_label_field: 'projects.title' }}
      default={[
        sample('SMLX AI · Project Scoping', 'Answer seven questions and get a rough size, timeline, phases and risks for your project.', 'Rule engine, Gemini API', 'Beta', `${SITE}/scope`, true),
        sample('The Deep Drop', 'A text adventure with its own parser and scoring engine.', 'Game engine, TypeScript', 'Game', `${SITE}/adventure`),
        sample('Performance', 'Runs a live Google Lighthouse audit against this site.', 'PageSpeed API, Caching', 'Live', `${SITE}/performance`),
        sample('Tests', '326 passing checks and 96.3% coverage, written so non-engineers can read them.', 'Vitest, Coverage', 'Live', `${SITE}/tests`),
        sample('Read & Listen', 'AI-written texts in two languages, read aloud, from A1 to C2.', 'Gemini API, Web Speech', 'Beta', `${SITE}/read-listen`),
        sample('AI Cost Case', "A demo company's AI agents redesigned for cost: $2,333 → $18, a 92% token reduction.", 'Cost model, SVG', 'Case study', `${SITE}/ai-cost-case`),
      ]}
    >
      <TextField name="title" label="Title" default="Project" />
      <TextField name="summary" label="Summary" default="What it does and why it matters." allowNewLine />
      <TextField name="tags" label="Stack (comma-separated)" default="React, TypeScript" />
      <TextField name="year" label="Badge (year, Beta, Live…)" default="2026" />
      <ImageField name="image" label="Screenshot (optional)" resizable={false} default={{ src: '', alt: '' }} />
      <TextField name="repo_url" label="Repository URL" default="" />
      <TextField name="live_url" label="Live URL" default="" />
      <BooleanField name="featured" label="Featured (spans two columns)" default={false} display="toggle" />
    </RepeatedFieldGroup>
  </ModuleFields>
);

export const meta = { label: 'Devfolio · Project grid' };
