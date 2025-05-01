import React from 'react';

// This helper makes it easy to use dynamic imports with React.lazy
export function lazyImport<
  T extends React.ComponentType<any>,
  I extends { [K2 in K]: T },
  K extends keyof I
>(factory: () => Promise<I>, name: K): I {
  return Object.create({
    [name]: React.lazy(() => factory().then((module) => ({ default: module[name] }))),
  });
}

// Usage example:
// const { ComponentName } = lazyImport(() => import('./path/to/component'), 'ComponentName');
