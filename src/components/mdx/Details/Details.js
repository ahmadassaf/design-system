/**
 * Details/FAQ Component
 *
 * @description An interactive disclosure component for displaying expandable FAQ sections or details.
 * Uses Headless UI's Disclosure component to create accessible collapsible content areas with
 * plus/minus icons indicating the open/closed state. The disclosure button lives inside a real
 * heading (APG disclosure pattern) while the large display title is purely decorative.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

'use client';

import { Disclosure } from '@headlessui/react';

import Icon from '../../core/Icon';

const Details = ({ title, children, headingLevel = 2, ...rest }) => {
  const Heading = `h${headingLevel}`;

  return (
    <div className='mx-auto my-8'>
      <h2 aria-hidden='true' className='mt-0 border-b border-gray-900/10 pb-3 text-2xl font-bold leading-10 tracking-tight text-gray-900 dark:border-white/10 dark:text-white'>{title}</h2>
      <div className='mt-8 space-y-6 divide-y divide-gray-900/10 dark:divide-white/10'>

        <Disclosure as='div' key={ title } className='pt-6'>
          {({ open }) => (
            <>
              <Heading className='m-0'>
                <Disclosure.Button className='flex w-full items-start justify-between text-left text-gray-900 dark:text-white'>
                  <span className='text-base font-semibold leading-7'>{title}</span>
                  <span className='ml-6 flex h-7 items-center'>
                    {open ? (
                      <Icon name='Minus' size='sm' decorative />
                    ) : (
                      <Icon name='Plus' size='sm' decorative />
                    )}
                  </span>
                </Disclosure.Button>
              </Heading>
              <Disclosure.Panel as='div' className='mt-2 p-0'>
                <div className='text-base leading-7 text-gray-600 dark:text-gray-300' { ...rest }>
                  {children}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

      </div>
    </div>
  );
};

export default Details;
