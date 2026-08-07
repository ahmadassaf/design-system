import Check from 'lucide-react/dist/esm/icons/check.js';
import Copy from 'lucide-react/dist/esm/icons/copy.js';
import TriangleAlert from 'lucide-react/dist/esm/icons/triangle-alert.js';
import { useState } from 'react';

const escapeHtml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

const tokenPattern = /(?<string>'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`[\s\S]*?`)|(?<tag><\/?[A-Za-z][^>]*?>)|\b(?<keyword>import|export|from|const|let|var|return|if|else|null|true|false|default|function|process|env)\b|\b(?<component>[A-Z][A-Za-z0-9_]*)\b|\b(?<number>\d+)\b/g;

const tokenClass = (groups) => {
  if (groups.string) return 'text-green-300';
  if (groups.tag) return 'text-sky-300';
  if (groups.keyword) return 'text-purple-300';
  if (groups.component) return 'text-blue-300';
  if (groups.number) return 'text-yellow-300';

  return '';
};

const highlightCode = (code) => {
  let html = '';
  let lastIndex = 0;

  for (const match of code.matchAll(tokenPattern)) {
    const token = match[0];
    const index = match.index || 0;
    const className = tokenClass(match.groups || {});

    html += escapeHtml(code.slice(lastIndex, index));
    html += className ? `<span class="${className}">${escapeHtml(token)}</span>` : escapeHtml(token);
    lastIndex = index + token.length;
  }

  html += escapeHtml(code.slice(lastIndex));

  return html;
};

const languageLabels = {
  'js': 'JavaScript',
  'jsx': 'JSX',
  'mdx': 'MDX',
  'ts': 'TypeScript',
  'tsx': 'TSX'
};

export const HighlightedCode = ({ code, copyable = true, language = 'jsx' }) => {
  const [ copyState, setCopyState ] = useState('idle');
  const copyLabel = copyState === 'copied' ? 'Copied' : copyState === 'error' ? 'Retry copy' : 'Copy code';
  const copyStatus = copyState === 'copied' ? 'Code copied.' : copyState === 'error' ? 'Copy failed. Select Retry copy to try again.' : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopyState('copied');
    } catch {
      setCopyState('error');
    }
  };

  return (
    <div className='overflow-hidden rounded-lg border border-gray-800 bg-gray-950 shadow-sm'>
      <div className='flex min-h-10 items-center justify-between gap-3 border-b border-gray-800 px-4 py-1 text-xs font-semibold uppercase text-gray-400'>
        <span>{languageLabels[language] || language}</span>
        {copyable ? (
          <>
            <button
              type='button'
              onClick={ handleCopy }
              className='inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-2 rounded-md px-3 text-gray-300 transition-colors hover:bg-gray-800 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400'
              aria-label={ copyLabel }
              title={ copyLabel }
            >
              {copyState === 'copied' ? <Check aria-hidden='true' size={ 16 } /> : copyState === 'error' ? <TriangleAlert aria-hidden='true' size={ 16 } /> : <Copy aria-hidden='true' size={ 16 } />}
              {copyState === 'idle' ? null : <span>{copyLabel}</span>}
            </button>
            <span className='sr-only' aria-live='polite'>{copyStatus}</span>
          </>
        ) : null}
      </div>
      <pre className='overflow-auto whitespace-pre-wrap break-words p-4 text-left text-xs leading-6 text-gray-100'>
        <code dangerouslySetInnerHTML={{ '__html': highlightCode(code) }} />
      </pre>
    </div>
  );
};
