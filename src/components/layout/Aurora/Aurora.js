/**
 * Aurora Background Component
 *
 * @description A visually striking background component that creates an animated aurora borealis effect.
 * Features gradient animations, blur effects, and theme-aware styling that adapts to light/dark modes.
 * Used as a decorative background element to enhance the visual appeal of pages.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '../../../utilities/cn';

/**
 * Aurora background component with animated gradient effects
 *
 * @description Creates a full-height container with animated aurora background effects.
 * Features theme-aware gradients, optional radial gradient overlay, and smooth animations.
 * The component automatically adapts its appearance based on the current theme.
 *
 * @param {Object} props - Component props
 * @param {string} [props.className] - Additional CSS classes to apply
 * @param {React.ReactNode} props.children - Content to render over the aurora background
 * @param {boolean} [props.showRadialGradient=true] - Whether to show the radial gradient overlay
 * @param {...Object} props.props - Additional props passed to the container div
 *
 * @returns {JSX.Element} The rendered aurora background component
 *
 * @example
 * <AuroraBackground showRadialGradient={true}>
 *   <h1>Content over aurora background</h1>
 * </AuroraBackground>
 */
const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}) => {
  const auroraRef = useRef(null);
  const [ isActive, setIsActive ] = useState(true);

  useEffect(() => {
    const aurora = auroraRef.current;

    if (!aurora) return undefined;

    let isIntersecting = true;
    const syncActivity = () => setIsActive(isIntersecting && document.visibilityState === 'visible');
    const observer = new IntersectionObserver(([ entry ]) => {
      isIntersecting = entry.isIntersecting;
      syncActivity();
    });

    observer.observe(aurora);
    document.addEventListener('visibilitychange', syncActivity);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', syncActivity);
    };
  }, []);

  return (
    <div>
      <div className={ cn('relative flex min-h-dvh flex-col items-center justify-center transition-colors motion-reduce:transition-none', className) }
        { ...props }
      >
        <div
          aria-hidden='true'
          className='aurora absolute inset-x-0 top-0 h-[48rem] overflow-hidden [mask-image:linear-gradient(to_bottom,black_0%,black_62%,transparent_100%)]'
          data-animated={ isActive ? 'true' : 'false' }
          data-radial-gradient={ showRadialGradient ? 'true' : 'false' }
          ref={ auroraRef }
        >
          <div className='aurora-field pointer-events-none absolute'></div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuroraBackground;
