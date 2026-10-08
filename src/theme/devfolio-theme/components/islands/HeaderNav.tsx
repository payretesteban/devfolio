import { useEffect, useMemo, useRef, useState } from 'react';

type Link = { label: string; href: string };
type Props = { logoText: string; logoStyle?: 'tag' | 'path'; nav: Link[]; cta: Link; socials: Link[] };

type Command = Link & { group: 'Navigate' | 'Elsewhere' | 'Actions'; action?: () => void };

export default function HeaderNav({ logoText, logoStyle = 'tag', nav, cta, socials }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Global ⌘K / Ctrl+K shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const [first, ...rest] = logoText.split('.');

  return (
    <>
      <div
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled ? 'border-b border-line bg-bg/70 backdrop-blur-xl' : 'border-b border-transparent'
        }`}
      >
        <nav className="df-container flex h-16 items-center justify-between gap-6" aria-label="Main">
          <a href="/" className="font-mono text-[15px] font-bold tracking-tight no-underline" aria-label="Home">
            {logoStyle === 'tag' ? (
              <>
                <span className="text-muted">&lt;</span>
                <span className="df-gradient-text">{logoText}</span>
                <span className="text-muted">/&gt;</span>
              </>
            ) : (
              <>
                <span className="text-accent-alt">~/</span>
                {first}
                {rest.length > 0 && <span className="text-muted">.{rest.join('.')}</span>}
              </>
            )}
            <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-blink bg-accent" />
          </a>

          <ul className="hidden list-none items-center gap-1 p-0 md:flex">
            {nav.map((l) => (
              <li key={l.href + l.label}>
                <a
                  href={l.href}
                  className="rounded-md px-3 py-2 text-sm text-muted no-underline transition hover:bg-white/5 hover:text-ink"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="hidden items-center gap-3 rounded-lg border border-line bg-white/[0.03] py-1.5 pl-3 pr-1.5 text-sm text-muted transition hover:border-line-strong hover:text-ink sm:flex"
              aria-label="Open command palette"
            >
              Jump to…
              <kbd className="rounded border border-line-strong bg-white/5 px-1.5 py-0.5 font-mono text-[11px]">⌘K</kbd>
            </button>
            <a href={cta.href} className="df-btn df-btn-primary hidden !py-2 !text-sm sm:inline-flex">
              {cta.label}
            </a>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-lg border border-line text-ink md:hidden"
              aria-expanded={menuOpen}
              aria-label="Toggle menu"
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span className="relative block h-3 w-4">
                <span className={`absolute left-0 h-0.5 w-4 bg-current transition ${menuOpen ? 'top-1.5 rotate-45' : 'top-0'}`} />
                <span className={`absolute left-0 h-0.5 w-4 bg-current transition ${menuOpen ? 'top-1.5 -rotate-45' : 'top-2.5'}`} />
              </span>
            </button>
          </div>
        </nav>

        {menuOpen && (
          <div className="border-t border-line bg-bg/95 backdrop-blur-xl md:hidden">
            <ul className="df-container flex list-none flex-col gap-1 py-4">
              {[...nav, cta].map((l) => (
                <li key={'m' + l.href + l.label}>
                  <a
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-md px-3 py-3 font-mono text-sm no-underline hover:bg-white/5"
                  >
                    <span className="text-accent-alt">→</span> {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {paletteOpen && (
        <CommandPalette nav={nav} socials={socials} cta={cta} onClose={() => setPaletteOpen(false)} />
      )}
    </>
  );
}

function CommandPalette({
  nav,
  socials,
  cta,
  onClose,
}: {
  nav: Link[];
  socials: Link[];
  cta: Link;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = useMemo<Command[]>(
    () => [
      { label: 'Home', href: '/', group: 'Navigate' },
      ...nav.map((l) => ({ ...l, group: 'Navigate' as const })),
      ...socials.map((l) => ({ ...l, group: 'Elsewhere' as const })),
      { label: cta.label, href: cta.href, group: 'Actions' },
      ...socials
        .filter((l) => l.href.startsWith('mailto:'))
        .map((l) => ({
          label: 'Copy email address',
          href: '#',
          group: 'Actions' as const,
          action: () => navigator.clipboard?.writeText(l.href.replace('mailto:', '')),
        })),
      {
        label: 'Copy page URL',
        href: '#',
        group: 'Actions',
        action: () => navigator.clipboard?.writeText(window.location.href),
      },
    ],
    [nav, socials, cta],
  );

  const results = commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    inputRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => setActive(0), [query]);

  const run = (c?: Command) => {
    if (!c) return;
    onClose();
    if (c.action) return c.action();
    if (/^https?:\/\//.test(c.href)) window.open(c.href, '_blank', 'noopener');
    else window.location.href = c.href;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    }
    if (e.key === 'Enter') run(results[active]);
  };

  let lastGroup = '';

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/60 px-4 pt-[15vh] backdrop-blur-sm"
      onMouseDown={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div
        className="w-full max-w-lg animate-fade-up overflow-hidden rounded-theme border border-line-strong bg-surface shadow-2xl shadow-black/60"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <span className="font-mono text-accent-alt">❯</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search…"
            className="h-14 w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-muted"
            aria-label="Search commands"
          />
          <kbd className="rounded border border-line-strong px-1.5 py-0.5 font-mono text-[11px] text-muted">esc</kbd>
        </div>
        <ul className="max-h-80 list-none overflow-y-auto p-2" role="listbox">
          {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-muted">No results for “{query}”</li>}
          {results.map((c, i) => {
            const header = c.group !== lastGroup ? c.group : null;
            lastGroup = c.group;
            return (
              <li key={c.group + c.label + i} role="option" aria-selected={i === active}>
                {header && <p className="px-3 pb-1 pt-3 font-mono text-[11px] uppercase tracking-widest text-muted">{header}</p>}
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => run(c)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${
                    i === active ? 'bg-accent/15 text-ink' : 'text-muted'
                  }`}
                >
                  <span>{c.label}</span>
                  <span className="font-mono text-xs opacity-60">
                    {c.action ? '⏎' : /^https?:/.test(c.href) ? '↗' : c.href}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="flex gap-4 border-t border-line px-4 py-2 font-mono text-[11px] text-muted">
          <span>↑↓ navigate</span>
          <span>⏎ open</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}
