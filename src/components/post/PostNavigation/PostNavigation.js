/**
 * PostNavigation Component
 *
 * @description Navigation component that provides links to previous and next blog posts.
 * Features responsive design that stacks vertically on mobile devices and displays
 * side-by-side on larger screens. Only renders when there are adjacent posts available.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

import Link from '../../core/Link';

/**
 * Renders navigation links to adjacent blog posts
 *
 * @description Contextual navigation component that displays links to the previous and next
 * blog posts in the chronological sequence. Features responsive layout that adapts to
 * different screen sizes and only renders when adjacent posts exist.
 *
 * @param {Object} props - Component props
 * @param {Object|null} props.next - Next blog post object
 * @param {string} props.next.slug - URL slug for the next post
 * @param {string} props.next.title - Title of the next post
 * @param {Object|null} props.prev - Previous blog post object
 * @param {string} props.prev.slug - URL slug for the previous post
 * @param {string} props.prev.title - Title of the previous post
 * @param {2|3|4|5|6} [props.headingLevel=2] - Semantic level for the previous/next labels
 * @param {string} [props.type='Post'] - Content type (Post or Thought)
 *
 * @returns {JSX.Element} Post navigation links with responsive layout
 *
 * @example
 * // Basic usage with both posts
 * const nextPost = { slug: 'next-post', title: 'Next Post Title' };
 * const prevPost = { slug: 'prev-post', title: 'Previous Post Title' };
 * <PostNavigation next={nextPost} prev={prevPost} />
 *
 * @example
 * // Usage with only one adjacent post
 * <PostNavigation next={null} prev={prevPost} />
 */
const headingElements = { 2: 'h2', 3: 'h3', 4: 'h4', 5: 'h5', 6: 'h6' };

const PostNavigation = ({ headingLevel = 2, next, prev, type = 'Post' }) => {
  const isThought = type === 'Thought';
  const baseUrl = isThought ? '/thoughts' : '/blog';
  const label = isThought ? 'Thought' : 'Article';
  const Heading = headingElements[headingLevel] || headingElements[2];

  return (
    <div className='divide-gray-200 text-sm font-medium leading-5 dark:divide-gray-700'>
      {(next || prev) && (
        <div className='flex justify-between max-sm:flex-col py-4'>
          {prev && (
            <div className='max-sm:py-2 group'>
              <Heading className='text-xs uppercase text-gray-500 dark:text-gray-400'>
                Previous {label}
              </Heading>
              <div className='text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
                <Link href={ `${baseUrl}/${prev.slug}` }>{prev.title}</Link>
              </div>
            </div>
          )}
          {next && (
            <div className='max-sm:py-2 group'>
              <Heading className='text-xs uppercase text-gray-500 dark:text-gray-400'>
                Next {label}
              </Heading>
              <div className='text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
                <Link href={ `${baseUrl}/${next.slug}` }>{next.title}</Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostNavigation;
