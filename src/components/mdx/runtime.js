'use client';

/**
 * MDX Runtime
 *
 * @description Client-side runtime for rendering pre-compiled MDX code (mdx-bundler
 * output). Lives in its own entry point (`@gaudi/design-system/mdx/runtime`) so the
 * `Function`-constructor evaluator and React/ReactDOM scope wiring are only loaded
 * by consumers that actually render compiled MDX — not by everyone importing the
 * mdx component barrel.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */


import React from 'react';
import * as _jsx_runtime from 'react/jsx-runtime';
import ReactDOM from 'react-dom';

import styles from './MdxContent/MdxContent.module.css';

/**
 * Dynamically creates an MDX component from compiled code
 *
 * @param {string} code - The compiled MDX code string
 * @param {Object} [globals={}] - Additional global variables to make available
 * @returns {React.Component} The MDX component ready for rendering
 */
const getMDXComponent = (code, globals = {}) => {
  const scope = { React, ReactDOM, _jsx_runtime, ...globals };
  const fn = new Function(...Object.keys(scope), code);

  return fn(...Object.values(scope)).default;
};

/**
 * React hook for memoized MDX component creation
 *
 * @param {string} code - The compiled MDX code string
 * @param {Object} [globals={}] - Additional global variables to make available
 * @returns {React.Component} Memoized MDX component
 */
export const useMDXComponent = (
  code,
  globals = {}
) => React.useMemo(() => getMDXComponent(code, globals), [ code, globals ]);

/**
 * MDX layout renderer component
 *
 * @param {Object} props - Component props
 * @param {string} props.code - The compiled MDX code to render
 * @param {Object} [props.components] - Custom component overrides
 * @returns {JSX.Element} The rendered MDX content
 * @param {...Object} props.rest - Additional props passed to the MDX component
 */
export const MDXLayoutRenderer = ({ code, components, ...rest }) => {
  const Mdx = useMDXComponent(code);

  return (
    <div className={ styles.root }>
      <Mdx components={ components } { ...rest } />
    </div>
  );
};
