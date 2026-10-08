/**
 * Shared building blocks for every Devfolio module.
 *
 * Importing tailwind.css here (rather than in each module) means every module
 * that renders a <Section> pulls in the same compiled Tailwind stylesheet,
 * and the HubSpot build de-duplicates it into a single shared asset.
 */
import type { ReactNode } from 'react';
import '../../styles/tailwind.css';

export type LinkValue = {
  url?: { href?: string; type?: string; content_id?: number | null };
  open_in_new_tab?: boolean;
  no_follow?: boolean;
};

/** HubSpot LinkField → anchor props */
export function linkProps(link?: LinkValue) {
  const href = link?.url?.href || '#';
  const external = !!link?.open_in_new_tab;
  return {
    href,
    target: external ? '_blank' : undefined,
    rel:
      [external && 'noopener noreferrer', link?.no_follow && 'nofollow']
        .filter(Boolean)
        .join(' ') || undefined,
  };
}

/** "React, TypeScript , HubL" → ["React", "TypeScript", "HubL"] */
export const splitList = (value?: string) =>
  (value || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

export const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

type SectionProps = {
  id?: string;
  className?: string;
  children: ReactNode;
};

export function Section({ id, className, children }: SectionProps) {
  return (
    <section id={id || undefined} className={cx('df-section scroll-mt-20', className)}>
      <div className="df-container">{children}</div>
    </section>
  );
}

type SectionHeadingProps = {
  eyebrow?: string;
  heading?: string;
  intro?: string;
  align?: 'left' | 'center';
};

export function SectionHeading({ eyebrow, heading, intro, align = 'left' }: SectionHeadingProps) {
  return (
    <div className={cx('mb-12', align === 'center' && 'mx-auto text-center [&_.df-lead]:mx-auto')}>
      {eyebrow && <p className="df-eyebrow">{eyebrow}</p>}
      {heading && <h2 className="df-h2">{heading}</h2>}
      {intro && <p className="df-lead">{intro}</p>}
    </div>
  );
}
