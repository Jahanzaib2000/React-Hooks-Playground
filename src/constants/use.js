export const TIME_PHASES = [
  {
    id: 't0',
    label: 't0',
    title: 'Render Trigger',
    desc: 'Component mounts and begins execution pass',
    topBlock: 'Render',
    bottomBlock: 'Render starts'
  },
  {
    id: 't1',
    label: 't1',
    title: 'Data Request',
    desc: 'Top commits empty state; Bottom calls use(promise)',
    topBlock: 'Shows empty or loading state',
    bottomBlock: 'Reaches the data request'
  },
  {
    id: 't2',
    label: 't2',
    title: 'Pause / Effect',
    desc: 'Top fires useEffect; Bottom suspends fiber',
    topBlock: 'Effect fires',
    bottomBlock: 'Paused'
  },
  {
    id: 't3',
    label: 't3',
    title: 'Awaiting Network',
    desc: 'Background async fetch in-flight; Suspense holds fallback',
    topBlock: 'Fetch runs',
    bottomBlock: 'Paused'
  },
  {
    id: 't4',
    label: 't4',
    title: 'Resolution & Commit',
    desc: 'Top re-renders with data; Bottom finishes in 1 single pass',
    topBlock: 'Re-render with data',
    bottomBlock: 'Render finishes with data'
  }
];

export const USE_TIMING_MS = {
  "playbackStep": 1500
};
