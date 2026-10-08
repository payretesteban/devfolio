/**
 * A tiny, dependency-free tokenizer that runs at render time on the server.
 * It returns plain serialisable tokens, so the highlighter itself never ships
 * to the browser: the island only maps tokens to <span>s.
 * Handles the common token types for JS/TS/JSX, HubL, CSS, JSON and shell.
 */
export type Token = { text: string; className?: string };

const KEYWORDS = new Set(
  (
    'import export from default const let var function return if else for while of in new class extends ' +
    'async await try catch throw type interface as true false null undefined this ' +
    'set endset endif endfor macro endmacro block endblock extends include module dnd_area end_dnd_area'
  ).split(' '),
);

const STRINGS = '(`(?:\\\\.|[^`])*`|"(?:\\\\.|[^"\\\\])*"|\'(?:\\\\.|[^\'\\\\])*\')';
const REST = '(\\{%-?|-?%\\}|\\{\\{|\\}\\}|=>|<\\/?[A-Za-z][\\w.]*|\\/?>)|(\\b\\d+(?:\\.\\d+)?\\b)|([A-Za-z_$][\\w$]*)(?=\\s*\\()|([A-Za-z_$][\\w$-]*)';
// '#' only starts a comment in shell snippets (elsewhere it's a hex color, selector, etc.)
const COMMENTS = '(\\/\\/[^\\n]*|\\{#[\\s\\S]*?#\\}|\\/\\*[\\s\\S]*?\\*\\/)';
const SHELL_COMMENTS = '(#[^\\n]*)';

const buildRegex = (comments: string) => new RegExp(`${comments}|${STRINGS}|${REST}`, 'gm');
const CODE_RE = buildRegex(COMMENTS);
const SHELL_RE = buildRegex(SHELL_COMMENTS);

export function highlight(code: string, language: string): Token[] {
  const out: Token[] = [];
  let last = 0;
  const push = (text: string, className?: string) => out.push(className ? { text, className } : { text });
  const re = language === 'bash' ? SHELL_RE : CODE_RE;

  code.replace(re, (match, comment, str, punct, num, fn, word, offset: number) => {
    if (offset > last) push(code.slice(last, offset));
    last = offset + match.length;

    if (comment) {
      push(match, 'italic text-muted/70');
    } else if (str) push(match, 'text-success');
    else if (punct) push(match, 'text-accent-alt');
    else if (num) push(match, 'text-[#f9a86b]');
    else if (fn) push(match, 'text-[#82aaff]');
    else if (word && KEYWORDS.has(word)) push(match, 'text-accent');
    else push(match);
    return match;
  });

  if (last < code.length) push(code.slice(last));
  return out;
}
