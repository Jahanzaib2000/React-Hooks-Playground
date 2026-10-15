/**
 * Standardized telemetry helper for recording user actions, renders, execution traces, and DOM mutations.
 * Unifies the 3-part dispatch pattern used across hooks sandboxes.
 *
 * @param {Object} params
 * @param {Function} [params.onRecordRender] - Callback to record a new render entry in the timeline
 * @param {Function} [params.onRecordTrace] - Callback to update the active execution trace
 * @param {Function} [params.onRecordMutation] - Callback to append a DOM mutation entry
 * @param {number} [params.renderNumber] - Sequence number of this render
 * @param {string|Object} [params.trigger] - Descriptive trigger label or object
 * @param {*} [params.prevState] - Previous state before action
 * @param {*} [params.currentState] - State resulting from action
 * @param {Object} [params.trace] - Execution tree trace object
 * @param {Object} [params.mutation] - DOM mutation record
 */
export function recordAction({
  onRecordRender,
  onRecordTrace,
  onRecordMutation,
  renderNumber,
  trigger,
  prevState,
  currentState,
  trace,
  mutation,
  ...extra
}) {
  if (onRecordMutation && mutation) {
    onRecordMutation(mutation);
  }

  if (onRecordRender) {
    onRecordRender({
      renderNumber,
      trigger,
      prevState,
      currentState,
      ...extra
    });
  }

  if (onRecordTrace && trace) {
    onRecordTrace(trace);
  }
}
