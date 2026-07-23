/**
 * Post Component
 *
 * @description Individual blog post preview component that displays post metadata and title
 * in a structured list format. Features responsive design, draft indication, and hover effects.
 * Used in blog listings to provide a consistent post preview experience.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

import Link from '../../core/Link';
import Pill from '../../core/Pill';
import formatDate from '../../../utilities/formatDate';

/**
 * Enhanced clean post component
 *
 * @description Clean, typography-focused post preview with subtle improvements
 * while maintaining the minimal aesthetic. Enhanced spacing, hover states, and metadata display.
 */
const Post = ({ frontMatter = {}, locale }) => {
  const baseUrl = frontMatter.type === 'Thought' ? '/thoughts' : '/blog';

  return (
    <li key={ frontMatter.slug } className='group'>
      <article className='border-b border-gray-100 py-3 dark:border-border-dark last:border-b-0'>
        <div className='flex flex-col gap-1 md:flex-row md:items-center md:justify-between md:gap-4'>

          {/* Main content */}
          <div className='min-w-0 flex-1'>
            <div className='mb-1 flex items-center gap-2 text-sm'>
              <time
                dateTime={ frontMatter.date }
                className='font-medium text-gray-500 group-hover:text-gray-600 dark:text-gray-400 dark:group-hover:text-gray-300'
              >
                {formatDate(frontMatter.date, locale)}
              </time>

              {frontMatter.category && (
                <>
                  <span className='text-gray-300 dark:text-gray-600'>·</span>
                  <Pill href={ `/blog/categories/${frontMatter.category.replaceAll(' ', '-').toLowerCase()}` } tone='blue' variant='subtle' size='xs' radius='md' className='my-0 mr-0 normal-case tracking-normal capitalize'>
                    {frontMatter.category}
                  </Pill>
                </>
              )}

              {frontMatter.draft && (
                <>
                  <span className='text-gray-300 dark:text-gray-600'>·</span>
                  <span className='h-2 w-2 rounded-full bg-yellow-500'></span>
                  <span className='text-xs font-medium text-yellow-600 dark:text-yellow-400'>Draft</span>
                </>
              )}
            </div>

            <h3 className='mb-1 text-[1.3125rem] font-semibold leading-tight tracking-tight text-gray-900 dark:text-white md:text-[1.375rem]'>
              <Link href={ `${baseUrl}/${frontMatter.slug}` } className='font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400'>
                {frontMatter.title}
              </Link>
            </h3>

            {frontMatter.subtitle && (
              <p className='line-clamp-1 text-[0.9375rem] leading-relaxed text-gray-600 dark:text-gray-300'>
                {frontMatter.subtitle}
              </p>
            )}
          </div>
        </div>
      </article>
    </li>
  );
};

export default Post;
