declare module 'jest-axe' {
  import type { AxeResults } from 'axe-core';

  interface JestAxe {
    (container: Element): Promise<AxeResults>;
  }

  const axe: JestAxe;
  export { axe, AxeResults };
  export default axe;
}