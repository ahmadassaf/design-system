import { forwardRef } from 'react';
import Link from 'next/link';

import { cn } from '../../../utilities/cn';
import { isExternalHref } from '../../../utilities/href';
import { createVariants } from '../../../utilities/variants';
import { buttonToneAliases, buttonToneClasses, buttonTones } from './Button.tones';

const compoundVariants = Object.entries(buttonToneClasses).flatMap(([ tone, variants ]) => (
  Object.entries(variants).map(([ variant, className ]) => ({ className, tone, variant }))
));

export const buttonVariants = createVariants({
  'base': 'ds-motion-press inline-flex min-h-11 items-center justify-center font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-offset-gray-950',
  compoundVariants,
  'defaultVariants': {
    'radius': 'md',
    'size': 'md',
    'tone': 'accent',
    'variant': 'solid'
  },
  'variants': {
    'radius': {
      'full': 'rounded-full',
      'lg': 'rounded-lg',
      'md': 'rounded-md',
      'sm': 'rounded-sm'
    },
    'size': {
      'lg': 'gap-3 px-8 py-4 text-base',
      'md': 'gap-2 px-6 py-3 text-sm',
      'sm': 'gap-2 px-4 py-2 text-sm',
      'xs': 'gap-1.5 px-3 py-1.5 text-xs'
    },
    'tone': Object.fromEntries(Object.keys(buttonToneClasses).map((tone) => [ tone, '' ])),
    'variant': {
      'ghost': '',
      'outline': 'border',
      'soft': '',
      'solid': '',
      'subtle': ''
    }
  }
});

export const buttonSizes = Object.keys(buttonVariants.variants.size);
export { buttonToneAliases, buttonTones };

// mailto also renders as a plain anchor: NextLink client navigation makes no sense for it
const rendersAsExternalAnchor = (href) => isExternalHref(href) || Boolean(href?.startsWith('mailto:'));

const Button = forwardRef(function Button({
  children,
  className,
  disabled = false,
  href,
  radius,
  size,
  tone,
  variant,
  ...rest
}, ref) {
  const classes = buttonVariants({ className, radius, size, tone, variant });
  const disabledLinkProps = disabled ? {
    'aria-disabled': true,
    'onClick': (event) => {
      event.preventDefault();
      event.stopPropagation();
    },
    'tabIndex': -1
  } : {};

  if (href && !rendersAsExternalAnchor(href)) return (
    <Link ref={ ref } href={ href } className={ classes } { ...rest } { ...disabledLinkProps }>
      {children}
    </Link>
  );

  if (href) return (
    <a ref={ ref } href={ href } className={ classes } target='_blank' rel='noopener noreferrer' { ...rest } { ...disabledLinkProps }>
      {children}
    </a>
  );

  return (
    <button ref={ ref } className={ cn(classes, disabled && 'cursor-not-allowed') } disabled={ disabled } type={ rest.type || 'button' } { ...rest }>
      {children}
    </button>
  );
});

export { buttonVariants as variants };
export default Button;
