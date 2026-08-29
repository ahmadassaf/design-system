/**
 * DraftBadge Component
 *
 * @description Shared yellow-dot draft indicator used by post rows and post headers.
 */

import { cn } from '../../../utilities/cn';

const DraftBadge = ({ className }) => (
  <span className={ cn('flex items-center gap-1.5', className) }>
    <span className='h-2 w-2 flex-shrink-0 rounded-full bg-yellow-500'></span>
    <span className='text-xs font-medium text-yellow-700 dark:text-yellow-300'>Draft</span>
  </span>
);

export default DraftBadge;
