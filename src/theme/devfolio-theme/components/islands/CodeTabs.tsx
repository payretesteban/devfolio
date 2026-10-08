import { useId, useState } from 'react';
import CopyButton from './CopyButton.tsx';

type Token = { text: string; className?: string };
type Tab = { filename: string; language: string; code: string; tokens: Token[] };

export default function CodeTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(0);
  const uid = useId();
  const tab = tabs[active];
  if (!tab) return null;
  const lineCount = tab.code.split('\n').length;

  return (
    <div className="overflow-hidden rounded-theme border border-line-strong bg-[#0b0d13] shadow-2xl shadow-black/40">
      <div className="flex items-center justify-between gap-2 border-b border-line bg-white/[0.02] pr-3">
        <div className="flex overflow-x-auto" role="tablist" aria-label="Source files">
          {tabs.map((t, i) => (
            <button
              key={t.filename + i}
              type="button"
              role="tab"
              id={`${uid}-tab-${i}`}
              aria-controls={`${uid}-panel`}
              aria-selected={i === active}
              tabIndex={i === active ? 0 : -1}
              onKeyDown={(e) => {
                // WAI-ARIA tabs pattern: arrow keys move between tabs
                if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
                const next = (i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length;
                setActive(next);
                document.getElementById(`${uid}-tab-${next}`)?.focus();
              }}
              onClick={() => setActive(i)}
              className={`relative whitespace-nowrap px-4 py-3 font-mono text-xs transition ${
                i === active ? 'bg-[#0b0d13] text-ink' : 'text-muted hover:text-ink'
              }`}
            >
              {i === active && <span className="absolute inset-x-0 top-0 h-0.5 bg-brand" />}
              {t.filename}
            </button>
          ))}
        </div>
        <CopyButton value={tab.code} />
      </div>
      {/* tabIndex makes the horizontally scrollable code reachable by keyboard (axe: scrollable-region-focusable) */}
      <div
        className="flex overflow-x-auto font-mono text-[13px] leading-6 focus-visible:outline-offset-[-2px]"
        role="tabpanel"
        id={`${uid}-panel`}
        aria-labelledby={`${uid}-tab-${active}`}
        tabIndex={0}
      >
        <pre aria-hidden="true" className="m-0 select-none border-r border-line px-4 py-5 text-right text-muted">
          {Array.from({ length: lineCount }, (_, i) => i + 1).join('\n')}
        </pre>
        <pre className="m-0 flex-1 px-5 py-5 text-ink/90">
          <code>
            {tab.tokens.map((t, i) => (t.className ? <span key={i} className={t.className}>{t.text}</span> : t.text))}
          </code>
        </pre>
      </div>
    </div>
  );
}
