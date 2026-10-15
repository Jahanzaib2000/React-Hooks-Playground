/**
 * Execution trace factory for initial mount traces.
 * Standardizes the trace structure for predictable inspection.
 *
 * @param {string} componentName - The display name of the component being mounted
 * @param {Array|Object} hooks - The initial hook slot array or single hook slot definition
 * @param {string|Object} diffSummary - Descriptive diff summary string or full commit object
 * @param {Object|null} [effects=null] - Effect lifecycle details if applicable
 * @returns {Object} Standardized execution trace object
 */
export function createMountTrace(componentName, hooks, diffSummary, effects = null) {
  const commit = typeof diffSummary === 'object' && diffSummary !== null
    ? { mutationsCount: 1, ...diffSummary }
    : { diffSummary, mutationsCount: 1 };

  return {
    trigger: { label: 'Initial Mount', type: 'Mount' },
    componentName,
    renderNumber: 1,
    hooks: Array.isArray(hooks) ? hooks : [hooks],
    commit,
    effects
  };
}
