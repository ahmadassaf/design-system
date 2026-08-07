'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';

import { cn } from '../../../utilities/cn';

export const DataTable = ({ caption, className, columns = [], overflowLabel = 'Scrollable data table', rows = [] }) => {
  const descriptionId = useId();
  const scrollRef = useRef(null);
  const [ scrollEdges, setScrollEdges ] = useState({ left: false, right: false });
  const updateScrollEdges = useCallback(() => {
    const scrollRegion = scrollRef.current;

    if (!scrollRegion) return;

    const nextEdges = {
      left: scrollRegion.scrollLeft > 1,
      right: Math.ceil(scrollRegion.scrollLeft + scrollRegion.clientWidth) < scrollRegion.scrollWidth - 1
    };

    setScrollEdges((currentEdges) => (
      currentEdges.left === nextEdges.left && currentEdges.right === nextEdges.right ? currentEdges : nextEdges
    ));
  }, []);

  useEffect(() => {
    updateScrollEdges();
    window.addEventListener('resize', updateScrollEdges);
    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(updateScrollEdges);

    if (scrollRef.current) resizeObserver?.observe(scrollRef.current);

    return () => {
      window.removeEventListener('resize', updateScrollEdges);
      resizeObserver?.disconnect();
    };
  }, [ updateScrollEdges ]);

  return (
    <div className={ cn('relative isolate overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950', className) }>
      <div
        ref={ scrollRef }
        role='region'
        tabIndex={ 0 }
        aria-label={ caption ? `${caption} scrollable table` : overflowLabel }
        aria-describedby={ descriptionId }
        className='overflow-x-auto rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
        onScroll={ updateScrollEdges }
      >
        <table className='w-full min-w-[560px] border-collapse bg-white text-left text-sm dark:bg-gray-950'>
          {caption ? <caption className='bg-white px-4 py-3 text-left text-sm font-medium text-gray-500 dark:bg-gray-950'>{caption}</caption> : null}
          <thead className='bg-gray-50 dark:bg-gray-900'>
            <tr>
              {columns.map((column) => <th key={ column.key } scope='col' className='border-b border-gray-200 px-4 py-3 text-xs font-semibold uppercase text-gray-600 dark:border-gray-800 dark:text-gray-300'>{column.header}</th>)}
            </tr>
          </thead>
          <tbody className='bg-white dark:bg-gray-950'>
            {rows.map((row, rowIndex) => (
              <tr key={ row.id || rowIndex } className='border-b border-gray-100 bg-white last:border-b-0 dark:border-gray-800 dark:bg-gray-950'>
                {columns.map((column) => <td key={ column.key } className='px-4 py-3 text-gray-700 dark:text-gray-300'>{column.render ? column.render(row) : row[column.key]}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <span id={ descriptionId } className='sr-only'>Scroll horizontally to see all columns.</span>
      <span aria-hidden='true' className={ cn('pointer-events-none absolute inset-y-0 left-0 w-5 rounded-l-lg shadow-[inset_12px_0_12px_-12px_rgb(23_23_23_/_0.38)] transition-opacity dark:shadow-[inset_12px_0_12px_-12px_rgb(255_255_255_/_0.28)]', scrollEdges.left ? 'opacity-100' : 'opacity-0') } />
      <span aria-hidden='true' className={ cn('pointer-events-none absolute inset-y-0 right-0 w-5 rounded-r-lg shadow-[inset_-12px_0_12px_-12px_rgb(23_23_23_/_0.38)] transition-opacity dark:shadow-[inset_-12px_0_12px_-12px_rgb(255_255_255_/_0.28)]', scrollEdges.right ? 'opacity-100' : 'opacity-0') } />
    </div>
  );
};

export default DataTable;
