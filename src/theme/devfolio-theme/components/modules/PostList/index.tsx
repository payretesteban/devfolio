import {
  ModuleFields,
  TextField,
  BooleanField,
  RepeatedFieldGroup,
  FieldGroup,
  LinkField,
} from '@hubspot/cms-components/fields';
import { Section, SectionHeading, linkProps, cx } from '../../shared/ui.tsx';
import { HeadingFields } from '../../shared/fields.tsx';

/** Curated list of posts (on this HubSpot blog or anywhere else), rendered like a file listing. */
export function Component({ fieldValues }) {
  const { heading, posts = [], more } = fieldValues;

  return (
    <Section id={heading.anchor}>
      <SectionHeading eyebrow={heading.eyebrow} heading={heading.heading} intro={heading.intro} />
      <ul className="m-0 list-none divide-y divide-line overflow-hidden rounded-theme border border-line bg-surface/60 p-0">
        {posts.map((p, i) => {
          const external = /^https?:/.test(p.url || '');
          return (
            <li key={i}>
              <a
                href={p.url || '#'}
                target={p.new_tab ? '_blank' : undefined}
                rel={p.new_tab ? 'noopener noreferrer' : undefined}
                className="group flex items-center gap-4 px-5 py-5 no-underline transition hover:bg-white/[0.03] md:px-7"
              >
                <span className="hidden w-10 shrink-0 font-mono text-xs text-muted sm:block">{String(i + 1).padStart(2, '0')}</span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-lg font-semibold tracking-tight transition group-hover:text-accent-alt">{p.title}</span>
                    {p.featured && (
                      <span className="rounded bg-accent/15 px-1.5 py-0.5 font-mono text-[11px] text-accent-text">★ featured</span>
                    )}
                  </span>
                  {p.excerpt && <span className="mt-1 block text-[15px] text-muted">{p.excerpt}</span>}
                </span>
                <span className={cx('shrink-0 font-mono text-sm text-muted transition group-hover:translate-x-1 group-hover:text-ink')} aria-hidden="true">
                  {external && p.new_tab ? '↗' : '→'}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
      {more?.text && (
        <a className="df-btn mt-8" {...linkProps(more.link)}>
          {more.text} <span aria-hidden="true">→</span>
        </a>
      )}
    </Section>
  );
}

const SITE = 'https://www.estebanpayret.com';
const post = (title: string, slug: string, excerpt = '', featured = false) => ({
  title,
  url: `${SITE}/${slug}`,
  excerpt,
  featured,
  new_tab: true,
});

export const fields = (
  <ModuleFields>
    <HeadingFields
      eyebrow="posts"
      heading="Writing"
      intro="Notes on engineering, leadership and life underwater."
      anchor="posts"
    />
    <RepeatedFieldGroup
      name="posts"
      label="Posts"
      occurrence={{ min: 1, max: 12, default: 4, sorting_label_field: 'posts.title' }}
      default={[
        post('My Life Underwater: 15 Years of Scuba Diving', 'my-life-underwater-15-years-of-scuba-diving', '', true),
        post('Starting Fresh: Rebuilding with Next.js and Sanity', 'starting-fresh-rebuilding-with-next-js-and-sanity'),
        post('Keep breathing', 'keep-breathing'),
        post('Time comes at you like a train/or a whale shark', 'time-comes-at-you-like-a-train-or-a-whale-shark'),
      ]}
    >
      <TextField name="title" label="Title" default="Post title" />
      <TextField name="url" label="URL" default="/blog" />
      <TextField name="excerpt" label="Excerpt (optional)" default="" allowNewLine />
      <BooleanField name="featured" label="Featured" default={false} display="toggle" />
      <BooleanField name="new_tab" label="Open in new tab" default={false} display="toggle" />
    </RepeatedFieldGroup>
    <FieldGroup name="more" label="Footer link">
      <TextField name="text" label="Label (leave empty to hide)" default="All posts" />
      <LinkField name="link" label="Link" default={{ url: { type: 'EXTERNAL', href: '/blog', content_id: null } }} />
    </FieldGroup>
  </ModuleFields>
);

export const meta = { label: 'Devfolio · Post list' };
