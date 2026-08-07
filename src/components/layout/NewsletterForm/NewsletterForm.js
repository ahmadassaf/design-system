'use client';

/**
 * Newsletter Form Component
 *
 * @description Newsletter subscription form component that integrates with Buttondown API.
 * Provides email validation, submission handling, and success/error feedback states.
 * Features responsive design with inline form layout and disabled state after subscription.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

import { useEffect, useId, useRef, useState } from 'react';

import Button from '../../core/Button';
import { cn } from '../../../utilities/cn';

/**
 * Newsletter subscription form component
 *
 * @description Renders a newsletter subscription form with email input and submit button.
 * Handles form submission to Buttondown API, manages subscription state, and provides
 * user feedback for success and error cases.
 *
 * @param {Object} props - Component props
 * @param {string} [props.endpoint='/api/buttondown'] - Subscription API endpoint to POST the email to
 * @param {string} [props.title='Subscribe to the newsletter'] - Form title (currently unused in display)
 *
 * @returns {JSX.Element} Newsletter subscription form
 *
 * @example
 * <NewsletterForm title="Join our newsletter" />
 */
const NewsletterForm = ({ className, classNames = {}, endpoint = '/api/buttondown', title = 'Subscribe to the newsletter' }) => {
  const abortControllerRef = useRef(null);
  const inputEl = useRef(null);
  const mountedRef = useRef(false);
  const inputId = useId();
  const messageId = useId();
  const [ error, setError ] = useState(false);
  const [ message, setMessage ] = useState('');
  const [ submitting, setSubmitting ] = useState(false);
  const [ subscribed, setSubscribed ] = useState(false);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      abortControllerRef.current?.abort();
    };
  }, []);

  /**
   * Handles newsletter subscription form submission
   *
   * @param {Event} event - Form submission event
   */
  const subscribe = async(event) => {
    event.preventDefault();

    if (submitting) return;

    const email = inputEl.current?.value?.trim();

    if (!email) {
      setError(true);
      setMessage('Enter a valid e-mail address.');

      return;
    }

    abortControllerRef.current?.abort();

    const controller = new AbortController();
    const subscriptionEndpoint = endpoint || '/api/buttondown';

    abortControllerRef.current = controller;
    setSubmitting(true);

    try {
      const res = await fetch(subscriptionEndpoint, {
        'body': JSON.stringify({
          email
        }),
        'headers': {
          'Content-Type': 'application/json'
        },
        'method': 'POST',
        'signal': controller.signal
      });

      let responseError = null;

      try {
        ({ 'error': responseError } = await res.json());
      } catch {
        // Guard against non-JSON responses (e.g. HTML error pages from the server).
        responseError = res.ok ? null : 'Unexpected response';
      }

      if (controller.signal.aborted || !mountedRef.current) return;

      if (responseError || !res.ok) {
        setError(true);
        setMessage('Your e-mail address is invalid or you are already subscribed!');

        return;
      }

      if (inputEl.current) inputEl.current.value = '';
      setError(false);
      setSubscribed(true);
      setMessage('Successfully! 🎉 You are now subscribed.');
    } catch (err) {
      if (err?.name === 'AbortError' || !mountedRef.current) return;

      setError(true);
      setMessage('Something went wrong. Please check your connection and try again.');
    } finally {
      if (abortControllerRef.current === controller) abortControllerRef.current = null;
      if (!controller.signal.aborted && mountedRef.current) setSubmitting(false);
    }
  };

  return (
    <div className={ cn('mt-8 xl:col-span-2 xl:mt-0', className, classNames.root) }>
      <h3 className={ cn('text-base font-medium text-gray-900 dark:text-white', classNames.title) }>{title}</h3>
      <p className={ cn('mt-4 text-base text-gray-600 md:text-sm dark:text-gray-300', classNames.description) }>
        The latest articles, readings, and resources, sent to your inbox monthly
      </p>
      <form className={ cn('mt-4 sm:flex sm:max-w-md', classNames.form) } onSubmit={ subscribe }>
        <label htmlFor={ inputId } className='sr-only'>
          Email address
        </label>
        <input
          autoComplete='email'
          id={ inputId }
          name='email'
          placeholder={ subscribed ? "You're subscribed !  🎉" : 'Enter your email' }
          ref={ inputEl }
          required
          type='email'
          disabled={ subscribed }
          aria-invalid={ error || undefined }
          aria-describedby={ message ? messageId : undefined }
          className={ cn('min-h-11 w-full min-w-0 appearance-none rounded-sm border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 shadow-xs placeholder-gray-500 focus-visible:border-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 md:text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder-gray-400 dark:focus-visible:border-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900', classNames.input) }
        />
        <div className={ cn('mt-3 sm:ml-3 sm:mt-0 sm:shrink-0', classNames.action) }>
          <Button
            type='submit'
            disabled={ subscribed || submitting }
            aria-busy={ submitting || undefined }
            className={ cn('w-full', classNames.button) }
            size='sm'
            variant='solid'
          >
            {subscribed ? 'Thank you!' : submitting ? 'Signing up…' : 'Sign up'}
          </Button>
        </div>
      </form>
      {message ? <p id={ messageId } role={ error ? 'alert' : 'status' } className={ cn('mt-3 text-sm', error ? 'text-red-600 dark:text-red-400' : 'text-green-700 dark:text-green-400', classNames.message) }>{message}</p> : null}
    </div>
  );
};

export default NewsletterForm;

/**
 * Blog-specific newsletter form with styled wrapper
 *
 * @description Newsletter form variant with additional styling and background for use within blog content.
 * Wraps the main NewsletterForm component with centered layout and background styling.
 *
 * @param {Object} props - Component props
 * @param {string} props.title - Form title to pass to NewsletterForm
 *
 * @returns {JSX.Element} Styled newsletter form for blog context
 *
 * @example
 * <BlogNewsletterForm title="Subscribe for updates" />
 */
export const BlogNewsletterForm = ({ classNames = {}, title }) => (
  <div className={ cn('flex items-center justify-center', classNames.root) }>
    <div className={ cn('bg-gray-100 p-6 dark:bg-gray-800 sm:px-14 sm:py-8', classNames.frame) }>
      <NewsletterForm title={ title } classNames={ classNames.form } />
    </div>
  </div>
);
