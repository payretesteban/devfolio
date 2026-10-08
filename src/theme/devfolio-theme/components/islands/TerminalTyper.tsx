import { useEffect, useState } from 'react';

type Line = { command: string; output: string };
type Props = { title: string; lines: Line[] };

const TYPE_MS = 45;
const PAUSE_MS = 550;

/**
 * Types each command character by character, then prints its output.
 * Respects prefers-reduced-motion by rendering the final state immediately.
 */
export default function TerminalTyper({ title, lines }: Props) {
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [showOutput, setShowOutput] = useState(false);

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setLineIdx(lines.length);
    }
  }, [lines.length]);

  useEffect(() => {
    if (lineIdx >= lines.length) return;
    const cmd = lines[lineIdx].command;
    let t: number;
    if (charIdx < cmd.length) {
      t = window.setTimeout(() => setCharIdx((c) => c + 1), TYPE_MS + Math.random() * 40);
    } else if (!showOutput) {
      t = window.setTimeout(() => setShowOutput(true), 180);
    } else {
      t = window.setTimeout(() => {
        setLineIdx((i) => i + 1);
        setCharIdx(0);
        setShowOutput(false);
      }, PAUSE_MS);
    }
    return () => window.clearTimeout(t);
  }, [lineIdx, charIdx, showOutput, lines]);

  const done = lineIdx >= lines.length;

  return (
    <div className="relative">
      <div className="absolute -inset-px rounded-theme bg-brand opacity-30 blur-2xl" aria-hidden="true" />
      <div className="relative overflow-hidden rounded-theme border border-line-strong bg-[#0b0d13]/95 shadow-2xl shadow-black/50">
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 font-mono text-xs text-muted">{title}</span>
        </div>
        <div className="min-h-[300px] p-5 font-mono text-[13.5px] leading-relaxed md:text-sm" aria-live="off">
          {lines.map((line, i) => {
            if (i > lineIdx) return null;
            const isCurrent = i === lineIdx;
            const typed = isCurrent ? line.command.slice(0, charIdx) : line.command;
            const outputVisible = !isCurrent || showOutput;
            return (
              <div key={i} className="mb-3">
                <div>
                  <span className="text-success">➜</span> <span className="text-accent-alt">~</span>{' '}
                  <span className="text-ink">{typed}</span>
                  {isCurrent && !showOutput && <Caret />}
                </div>
                {outputVisible && <div className="text-muted">{line.output}</div>}
              </div>
            );
          })}
          {done && (
            <div>
              <span className="text-success">➜</span> <span className="text-accent-alt">~</span> <Caret />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const Caret = () => <span className="inline-block h-4 w-2 translate-y-0.5 animate-blink bg-ink/80" />;
