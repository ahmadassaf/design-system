/**
 * FAQ Component
 *
 * @description Collapsible FAQ section with expandable question-answer pairs.
 * Features accessible disclosure patterns using native buttons and controlled panels.
 * Used within MDX content to present frequently asked questions in an organized format.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

'use client';

import { useId, useState } from 'react';

import Icon from '../../core/Icon';

const FaqItem = ({ faq }) => {
  const [ open, setOpen ] = useState(false);
  const panelId = useId();

  return (
    <div className='pt-6'>
      <dt>
        <button
          aria-controls={ panelId }
          aria-expanded={ open }
          className='flex min-h-11 w-full items-center justify-between text-left text-gray-900 dark:text-white'
          type='button'
          onClick={ () => setOpen((currentOpen) => !currentOpen) }
        >
          <span className='text-base font-semibold leading-7'>{faq.question}</span>
          <span className='ml-6 flex h-7 items-center'>
            {open ? (
              <Icon name='Minus' size='sm' decorative />
            ) : (
              <Icon name='Plus' size='sm' decorative />
            )}
          </span>
        </button>
      </dt>
      {open ? (
        <dd id={ panelId } className='mt-2 p-0'>
          <p className='text-base leading-7 text-gray-600 dark:text-gray-300'>{faq.answer}</p>
        </dd>
      ) : null}
    </div>
  );
};

/**
 * Renders a collapsible FAQ section
 *
 * @param {Object} props - Component props
 * @param {Array<Object>} props.questions - Array of FAQ objects
 * @param {string} props.questions[].question - The question text
 * @param {string} props.questions[].answer - The answer text
 * @returns {JSX.Element} A div containing the FAQ section with expandable items
 *
 * @example
 * // In MDX content:
 * <Faq questions={[
 *   { question: "What is React?", answer: "A JavaScript library for building user interfaces." },
 *   { question: "How do I get started?", answer: "Begin by reading the official documentation." }
 * ]} />
 */
const Faq = ({ heading = 'FAQ', headingLevel = 2, questions }) => {
  const Heading = ({ 2: 'h2', 3: 'h3', 4: 'h4', 5: 'h5', 6: 'h6' })[headingLevel] || 'h2';

  return <div className='mx-auto my-8'>
    <Heading className='mt-0 border-b border-gray-900/10 pb-3 text-2xl font-bold leading-10 text-gray-900 dark:border-white/10 dark:text-white'>{heading}</Heading>
    <dl className='mt-8 space-y-6 divide-y divide-gray-900/10 dark:divide-white/10'>
      {questions.map((faq) => (
        <FaqItem key={ faq.question } faq={ faq } />
      ))}
    </dl>
  </div>;
};

export default Faq;
