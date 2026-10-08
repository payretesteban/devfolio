import { useEffect, useRef, useState } from 'react';

type Props = {
  href: string;
  label: string;
  className?: string;
  /** Accessible title for the dialog, e.g. "Book a free consultation" */
  title?: string;
};

/**
 * Booking button that opens the scheduling page in a modal instead of
 * navigating away.
 *
 * - Cal.com links use Cal's official embed (embed.js, loaded lazily on the
 *   first click) and its modal, themed with our accent color. Cal's embed
 *   pages only render when talking to embed.js, so a plain iframe won't work.
 * - Other providers (HubSpot Meetings, Calendly, …) open in our own modal
 *   with an iframe, using the native <dialog> element for focus trapping,
 *   Esc-to-close and top-layer stacking.
 *
 * Progressive enhancement: it renders a normal link, so before hydration or
 * without JS it still opens the booking page.
 */
export default function BookingButton({ href, label, className = '', title }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const embedUrl = toEmbedUrl(href);
  const calLink = toCalLink(href);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Let modified clicks (new tab, etc.) behave like a normal link
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    if (calLink) {
      e.preventDefault();
      openCalModal(calLink);
      return;
    }
    if (!dialogRef.current?.showModal) return; // very old browsers: just follow the link
    e.preventDefault();
    setOpen(true);
  };

  return (
    <>
      <a href={href} onClick={onClick} className={className} aria-haspopup="dialog">
        {label} <span aria-hidden="true">→</span>
      </a>

      {!calLink && (
        <dialog
          ref={dialogRef}
          aria-label={title || label}
          onClose={() => setOpen(false)}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setOpen(false); // click on backdrop
          }}
          className="m-auto w-[min(1000px,calc(100vw-24px))] max-w-none overflow-hidden rounded-theme border border-line-strong bg-surface p-0 text-ink shadow-2xl shadow-black/60 backdrop:bg-black/70 backdrop:backdrop-blur-sm"
        >
          <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
            <p className="m-0 flex items-center gap-2 font-mono text-sm">
              <span className="text-success">●</span> {title || label}
            </p>
            <div className="flex items-center gap-2">
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md px-2 py-1 font-mono text-xs text-muted no-underline hover:bg-white/5 hover:text-ink"
              >
                open in new tab ↗
              </a>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-md border border-line text-muted transition hover:border-line-strong hover:text-ink"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="relative h-[min(720px,calc(100dvh-120px))] bg-surface">
            {!loaded && (
              <div className="absolute inset-0 grid place-items-center bg-surface font-mono text-sm text-muted">
                <span>
                  <span className="text-success">➜</span> loading calendar
                  <span className="ml-1 inline-block h-4 w-2 translate-y-0.5 animate-blink bg-muted" />
                </span>
              </div>
            )}
            {/* Only mount the iframe once opened, so the booking page doesn't slow down the initial page load */}
            {open && (
              <iframe
                src={embedUrl}
                title={title || label}
                onLoad={() => setLoaded(true)}
                className="h-full w-full border-0"
                allow="payment; fullscreen"
              />
            )}
          </div>
        </dialog>
      )}
    </>
  );
}

/** Add each provider's "embed" parameters so the page renders without its own chrome. */
function toEmbedUrl(href: string) {
  try {
    const url = new URL(href);
    const host = url.hostname;
    if (host.includes('meetings') && host.includes('hubspot')) {
      url.searchParams.set('embed', 'true');
    } else if (host.endsWith('calendly.com')) {
      url.searchParams.set('embed_type', 'Inline');
      url.searchParams.set('embed_domain', typeof window !== 'undefined' ? window.location.hostname : '');
    }
    return url.toString();
  } catch {
    return href;
  }
}

/* ------------------------------------------------------------------ Cal.com */

/** "https://cal.com/estebanpayret/30min?x=1" → "estebanpayret/30min?x=1" (null for other hosts) */
function toCalLink(href: string): string | null {
  try {
    const url = new URL(href);
    if (url.hostname !== 'cal.com' && url.hostname !== 'app.cal.com') return null;
    const path = url.pathname.replace(/^\/+|\/+$/g, '');
    return path ? path + url.search : null;
  } catch {
    return null;
  }
}

const CAL_EMBED_SRC = 'https://app.cal.com/embed/embed.js';

/**
 * Cal.com's official embed snippet: defines window.Cal as a queue and loads
 * embed.js on the first call. Calls made before the script arrives are replayed.
 */
function ensureCal(): (...args: unknown[]) => void {
  const w = window as any;
  if (!w.Cal) {
    (function (C: any, A: string, L: string) {
      const p = (a: any, ar: any) => a.q.push(ar);
      const d = C.document;
      C.Cal =
        C.Cal ||
        function (...ar: any[]) {
          const cal = C.Cal;
          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            d.head.appendChild(d.createElement('script')).src = A;
            cal.loaded = true;
          }
          if (ar[0] === L) {
            const api: any = (...args: any[]) => p(api, args);
            const namespace = ar[1];
            api.q = api.q || [];
            if (typeof namespace === 'string') {
              cal.ns[namespace] = cal.ns[namespace] || api;
              p(cal.ns[namespace], ar);
              p(cal, ['initNamespace', namespace]);
            } else p(cal, ar);
            return;
          }
          p(cal, ar);
        };
    })(window, CAL_EMBED_SRC, 'init');

    const accent = getComputedStyle(document.documentElement).getPropertyValue('--df-accent').trim();
    const brand = accent ? `rgb(${accent})` : '#7C5CFF';
    w.Cal('init', { origin: 'https://app.cal.com' });
    w.Cal('ui', {
      theme: 'dark',
      hideEventTypeDetails: false,
      layout: 'month_view',
      cssVarsPerTheme: { dark: { 'cal-brand': brand }, light: { 'cal-brand': brand } },
    });
  }
  return w.Cal;
}

function openCalModal(calLink: string) {
  ensureCal()('modal', {
    calLink,
    config: { layout: 'month_view', theme: 'dark' },
  });
}
