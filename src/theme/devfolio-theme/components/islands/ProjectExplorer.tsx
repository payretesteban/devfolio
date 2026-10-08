import { useMemo, useState } from 'react';

type Project = {
  id: number;
  title: string;
  summary: string;
  year: string;
  tags: string[];
  image: { src: string; alt: string } | null;
  repoUrl: string;
  liveUrl: string;
  featured: boolean;
};

const ALL = 'All';

/** Filterable project grid with stack chips and a mouse-follow spotlight on each card. */
export default function ProjectExplorer({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState(ALL);

  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    projects.forEach((p) => p.tags.forEach((t) => counts.set(t, (counts.get(t) || 0) + 1)));
    return [ALL, ...[...counts.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t)];
  }, [projects]);

  const visible = filter === ALL ? projects : projects.filter((p) => p.tags.includes(filter));

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2" role="toolbar" aria-label="Filter projects by technology">
        {tags.map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={filter === t}
            onClick={() => setFilter(t)}
            className={`rounded-full border px-3.5 py-1.5 font-mono text-xs transition ${
              filter === t
                ? 'border-transparent bg-brand text-white'
                : 'border-line-strong text-muted hover:border-accent/60 hover:text-ink'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <ul className="m-0 grid grid-flow-row-dense list-none gap-5 p-0 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </ul>
      <p className="sr-only" aria-live="polite">
        {visible.length} projects shown
      </p>
    </>
  );
}

function ProjectCard({ project: p }: { project: Project }) {
  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  return (
    <li
      onMouseMove={onMove}
      className={`df-card group relative flex animate-fade-up flex-col overflow-hidden hover:-translate-y-1 ${
        p.featured ? 'lg:col-span-2' : ''
      }`}
    >
      {/* spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(420px circle at var(--mx) var(--my), rgb(var(--df-accent) / 0.14), transparent 60%)',
        }}
      />
      {p.image && (
        <div className="overflow-hidden border-b border-line">
          <img src={p.image.src} alt={p.image.alt} loading="lazy" className="aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
        </div>
      )}
      <div className="relative flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center justify-between font-mono text-xs text-muted">
          <span>{p.featured ? <span className="text-accent-alt">★ featured</span> : `lab/${String(p.id + 1).padStart(2, '0')}`}</span>
          {p.year && <span className="rounded border border-line-strong px-1.5 py-0.5">{p.year}</span>}
        </div>
        <h3 className="m-0 text-xl font-semibold tracking-tight">{p.title}</h3>
        <p className="mb-5 mt-2 text-[15px] text-muted">{p.summary}</p>
        <ul className="mb-5 mt-auto flex list-none flex-wrap gap-1.5 p-0">
          {p.tags.map((t) => (
            <li key={t} className="rounded bg-white/5 px-2 py-0.5 font-mono text-[11px] text-ink/80">
              {t}
            </li>
          ))}
        </ul>
        {(p.repoUrl || p.liveUrl) && (
          <div className="flex gap-4 border-t border-line pt-4 font-mono text-xs">
            {p.repoUrl && (
              <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className="text-muted no-underline hover:text-ink">
                ⌥ source ↗
              </a>
            )}
            {p.liveUrl && (
              <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="text-accent-alt no-underline hover:underline">
                ● open ↗
              </a>
            )}
          </div>
        )}
      </div>
    </li>
  );
}
