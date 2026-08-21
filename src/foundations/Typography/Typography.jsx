import { cn } from '../../utilities/cn';

export const typographyVariants = {
  'author-name': {
    'className': 'text-4xl font-extrabold leading-[1.12] text-gray-900 dark:text-gray-100 sm:text-6xl sm:leading-[1.08] md:text-6xl md:leading-[1.08] text-balance break-words',
    'element': 'h1'
  },
  'author-role': {
    'className': 'text-xl leading-8 text-gray-600 dark:text-gray-300 md:text-2xl md:leading-9',
    'element': 'p'
  },
  'card-subtitle': {
    'className': 'text-lg font-medium text-gray-600 dark:text-gray-400',
    'element': 'p'
  },
  'card-title': {
    'className': 'text-xl font-bold text-gray-900 dark:text-white leading-tight',
    'element': 'h3'
  },
  'display-lg': {
    'className': 'text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.12] text-gray-900 dark:text-gray-100 text-balance',
    'element': 'h1'
  },
  'display-xl': {
    'className': 'text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[1.08] text-gray-900 dark:text-gray-100 text-balance',
    'element': 'h1'
  },
  'error-title': {
    'className': 'text-7xl font-extrabold leading-none text-gray-900 dark:text-gray-100 md:border-r-2 md:border-gray-900 md:pr-6 md:text-8xl dark:md:border-gray-100',
    'element': 'h1'
  },
  'index-feature-summary': {
    'className': 'max-w-[68ch] text-base leading-7 text-gray-700 dark:text-gray-300',
    'element': 'p'
  },
  'index-feature-title': {
    'className': 'text-xl font-bold leading-7 text-gray-900 dark:text-white text-pretty break-words',
    'element': 'h3'
  },
  'index-hero-summary': {
    'className': 'max-w-3xl text-lg leading-7 text-gray-700 dark:text-gray-300 md:text-xl md:leading-[1.5]',
    'element': 'p'
  },
  'index-hero-title': {
    'className': 'max-w-3xl text-[2rem] font-bold leading-[1.15] text-gray-900 text-balance break-words dark:text-white sm:text-[2.625rem] sm:leading-[1.12]',
    'element': 'h2'
  },
  'index-list-title': {
    'className': 'text-lg font-semibold leading-6 text-gray-900 dark:text-white md:text-xl md:leading-7',
    'element': 'h3'
  },
  'heading-lg': {
    'className': 'text-3xl font-bold leading-[1.35] text-gray-900 dark:text-white md:text-4xl',
    'element': 'h2'
  },
  'heading-md': {
    'className': 'text-2xl font-bold leading-[1.25] text-gray-900 dark:text-white',
    'element': 'h3'
  },
  'heading-sm': {
    'className': 'text-lg md:text-xl font-semibold text-gray-900 dark:text-white',
    'element': 'h4'
  },
  'heading-xl': {
    'className': 'text-4xl font-bold leading-[1.12] text-gray-900 text-balance dark:text-white sm:text-5xl',
    'element': 'h2'
  },
  'list-title': {
    'className': 'text-xl font-semibold leading-tight text-gray-900 dark:text-white md:text-2xl',
    'element': 'h3'
  },
  'metadata': {
    'className': 'text-xs font-medium uppercase tabular-nums text-gray-500 dark:text-gray-400',
    'element': 'p'
  },
  'paragraph-lg': {
    'className': 'text-xl leading-9 text-gray-700 dark:text-gray-300 md:text-2xl',
    'element': 'p'
  },
  'paragraph-md': {
    'className': 'text-base leading-8 text-gray-700 dark:text-gray-300 md:text-lg',
    'element': 'p'
  },
  'paragraph-sm': {
    'className': 'text-sm leading-5 text-gray-600 dark:text-gray-400',
    'element': 'p'
  },
  'post-meta': {
    'className': 'text-sm leading-6 tabular-nums text-gray-500 dark:text-gray-400',
    'element': 'p'
  },
  'post-subtitle': {
    'className': 'w-full break-words text-xl leading-snug tracking-tight text-gray-600 capitalize dark:text-gray-100 md:text-2xl',
    'element': 'p'
  },
  'post-title': {
    'className': 'w-full break-words text-4xl font-extrabold leading-[1.12] tracking-[-0.03em] text-gray-900 dark:text-gray-100 md:text-5xl md:leading-[1.08]',
    'element': 'h1'
  },
  'prose-lead': {
    'className': 'text-xl leading-10 text-gray-700 dark:text-gray-300',
    'element': 'p'
  },
  'subtitle-lg': {
    'className': 'text-xl md:text-2xl font-medium text-gray-600 dark:text-gray-300 leading-snug',
    'element': 'p'
  },
  'subtitle-md': {
    'className': 'text-xl font-medium leading-snug text-gray-600 dark:text-gray-400 md:text-2xl',
    'element': 'p'
  },
  'subtitle-xl': {
    'className': 'text-2xl sm:text-3xl font-medium text-gray-600 dark:text-gray-300 leading-snug',
    'element': 'p'
  },
  'title-lg': {
    'className': 'text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-gray-900 dark:text-white',
    'element': 'h1'
  },
  'title-md': {
    'className': 'text-3xl sm:text-4xl font-extrabold leading-9 text-gray-900 dark:text-gray-100 text-balance',
    'element': 'h1'
  },
  'title-xl': {
    'className': 'text-5xl font-extrabold leading-[1.05] text-gray-900 dark:text-gray-100 sm:text-6xl md:text-7xl lg:text-8xl text-balance',
    'element': 'h1'
  }
};

const Typography = ({
  as,
  children,
  className = '',
  variant = 'paragraph-md',
  ...rest
}) => {
  const config = typographyVariants[variant];

  if (!config) return null;

  const Element = as || config.element;

  return (
    <Element className={ cn(config.className, className) } { ...rest }>
      {children}
    </Element>
  );
};

export { typographyVariants as variants };
export default Typography;
