'use client';

/**
 * Image Component
 *
 * @description Wrapper around Next.js Image component for use in MDX content.
 * Supports captions, optional fallback and dark-mode image sources, and opens
 * images in a full-screen modal when clicked.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

import { useEffect, useState } from 'react';
import NextImageModule from 'next/image';

import ImageModal from '../ImageModal';
import Button from '../../core/Button';
import resolveNextImage from '../../../utilities/resolveNextImage';

const NextImage = resolveNextImage(NextImageModule);

/**
 * Renders an optimized image using Next.js Image component with modal functionality
 *
 * @param {Object} props - All Next.js Image component props
 * @param {string} [props.alt=''] - Alt text for the image (defaults to empty so images are treated as decorative unless described)
 * @param {string} [props.caption] - Optional image caption
 * @param {string} [props.darkSrc] - Optional dark-mode image source
 * @param {string} [props.fallback] - Optional fallback image source after load failure
 * @param {string} props.src - Image source URL
 * @param {...Object} props.rest - All standard Next.js Image props (width, height, etc.)
 * @returns {JSX.Element} A Next.js Image component with optimized loading and modal
 *
 * @example
 * // In MDX content:
 * <Image src="/static/images/example.jpg" width={500} height={300} />
 */
const Image = ({ alt = '', caption, darkSrc, fallback, src, ...rest }) => {
  const [ isModalOpen, setIsModalOpen ] = useState(false);
  const [ currentSrc, setCurrentSrc ] = useState(src);
  const [ erroredSources, setErroredSources ] = useState({});

  useEffect(() => {
    setCurrentSrc(src);
    setErroredSources({});
  }, [ darkSrc, fallback, src ]);

  const getDisplaySrc = (imageSrc) => (fallback && erroredSources[imageSrc] ? fallback : imageSrc);

  const handleImageClick = (imageSrc) => {
    setCurrentSrc(imageSrc);
    setIsModalOpen(true);
  };

  const createImageProps = (imageSrc, className) => {
    return {
      ...rest,
      alt,
      'blurDataURL': 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
      className,
      'loading': 'lazy',
      'onError': () => {
        if (fallback && imageSrc !== fallback) setErroredSources((sources) => ({ ...sources, [imageSrc]: true }));
      },
      'placeholder': 'blur',
      'priority': false,
      'sizes': '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
      'src': imageSrc
    };
  };

  const renderImage = (imageSrc, className = '') => {
    const imageProps = createImageProps(getDisplaySrc(imageSrc), `cursor-pointer hover:opacity-90 transition-opacity duration-200 ${className || rest.className || ''}`);
    const nativeImageProps = { ...imageProps };

    delete nativeImageProps.blurDataURL;
    delete nativeImageProps.placeholder;
    delete nativeImageProps.priority;

    return NextImage ? <NextImage { ...imageProps } /> : <img { ...nativeImageProps } />;
  };

  return (
    <figure>
      <Button variant='ghost' tone='gray' size='sm' className='block max-w-full p-0 hover:bg-transparent dark:hover:bg-transparent' onClick={ () => handleImageClick(getDisplaySrc(src)) } aria-label={ alt ? `Open image: ${alt}` : 'Open image' }>
        {renderImage(src, darkSrc ? `${rest.className || ''} dark:hidden` : rest.className)}
      </Button>
      {darkSrc && (
        <Button variant='ghost' tone='gray' size='sm' className='hidden max-w-full p-0 hover:bg-transparent dark:block dark:hover:bg-transparent' onClick={ () => handleImageClick(getDisplaySrc(darkSrc)) } aria-label={ alt ? `Open image: ${alt}` : 'Open image' }>
          {renderImage(darkSrc, rest.className)}
        </Button>
      )}
      {caption && <figcaption className='mt-3 text-center text-sm text-gray-500 dark:text-gray-400'>{caption}</figcaption>}

      <ImageModal
        isOpen={ isModalOpen }
        onClose={ () => setIsModalOpen(false) }
        src={ currentSrc }
        alt={ alt }
        caption={ caption }
      />
    </figure>
  );
};

export default Image;