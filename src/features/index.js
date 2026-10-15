import { UseStateSandbox } from './use-state/UseStateSandbox';
import { lessons as useStateLessons, getInitialTrace as getUseStateTrace, getInitialRender as getUseStateInitialRender } from './use-state/lessons';

import { UseEffectSandbox } from './use-effect/UseEffectSandbox';
import { lessons as useEffectLessons, getInitialTrace as getUseEffectTrace, getInitialRender as getUseEffectInitialRender } from './use-effect/lessons';

import { UseContextSandbox } from './use-context/UseContextSandbox';
import { lessons as useContextLessons, getInitialTrace as getUseContextTrace, getInitialRender as getUseContextInitialRender } from './use-context/lessons';

import { UseIdSandbox } from './use-id/UseIdSandbox';
import { lessons as useIdLessons, getInitialTrace as getUseIdTrace, getInitialRender as getUseIdInitialRender } from './use-id/lessons';

import { UseOptimisticSandbox } from './use-optimistic/UseOptimisticSandbox';
import { lessons as useOptimisticLessons, getInitialTrace as getUseOptimisticTrace, getInitialRender as getUseOptimisticInitialRender } from './use-optimistic/lessons';

import { UseDeferredValueSandbox } from './use-deferred-value/UseDeferredValueSandbox';
import { lessons as useDeferredValueLessons, getInitialTrace as getUseDeferredValueTrace, getInitialRender as getUseDeferredValueInitialRender } from './use-deferred-value/lessons';

import { UseTransitionSandbox } from './use-transition/UseTransitionSandbox';
import { lessons as useTransitionLessons, getInitialTrace as getUseTransitionTrace, getInitialRender as getUseTransitionInitialRender } from './use-transition/lessons';

import { UseRefSandbox } from './use-ref/UseRefSandbox';
import { lessons as useRefLessons, getInitialTrace as getUseRefTrace, getInitialRender as getUseRefInitialRender } from './use-ref/lessons';

import { UseReducerSandbox } from './use-reducer/UseReducerSandbox';
import { lessons as useReducerLessons, getInitialTrace as getUseReducerTrace, getInitialRender as getUseReducerInitialRender } from './use-reducer/lessons';

import { UseImperativeHandleSandbox } from './use-imperative-handle/UseImperativeHandleSandbox';
import { lessons as useImperativeHandleLessons, getInitialTrace as getUseImperativeHandleTrace, getInitialRender as getUseImperativeHandleInitialRender } from './use-imperative-handle/lessons';

import { UseFormStatusSandbox } from './use-form-status/UseFormStatusSandbox';
import { lessons as useFormStatusLessons, getInitialTrace as getUseFormStatusTrace, getInitialRender as getUseFormStatusInitialRender } from './use-form-status/lessons';

import { UseLayoutEffectSandbox } from './use-layout-effect/UseLayoutEffectSandbox';
import { lessons as useLayoutEffectLessons, getInitialTrace as getUseLayoutEffectTrace, getInitialRender as getUseLayoutEffectInitialRender } from './use-layout-effect/lessons';

import { UseInsertionEffectSandbox } from './use-insertion-effect/UseInsertionEffectSandbox';
import { lessons as useInsertionEffectLessons, getInitialTrace as getUseInsertionEffectTrace, getInitialRender as getUseInsertionEffectInitialRender } from './use-insertion-effect/lessons';

import { UseSyncExternalStoreSandbox } from './use-sync-external-store/UseSyncExternalStoreSandbox';
import { lessons as useSyncExternalStoreLessons, getInitialTrace as getUseSyncExternalStoreTrace, getInitialRender as getUseSyncExternalStoreInitialRender } from './use-sync-external-store/lessons';

import { UseActionStateSandbox } from './use-action-state/UseActionStateSandbox';
import { lessons as useActionStateLessons, getInitialTrace as getUseActionStateTrace, getInitialRender as getUseActionStateInitialRender } from './use-action-state/lessons';

import { UseHookSandbox } from './use/UseHookSandbox';
import { lessons as useLessons, getInitialTrace as getUseTrace, getInitialRender as getUseInitialRender } from './use/lessons';

import { UseDebugValueSandbox } from './use-debug-value/UseDebugValueSandbox';
import { lessons as useDebugValueLessons, getInitialTrace as getUseDebugValueTrace, getInitialRender as getUseDebugValueInitialRender } from './use-debug-value/lessons';

import { UseEffectEventSandbox } from './use-effect-event/UseEffectEventSandbox';
import { lessons as useEffectEventLessons, getInitialTrace as getUseEffectEventTrace, getInitialRender as getUseEffectEventInitialRender } from './use-effect-event/lessons';

export const HOOK_MODULES = {
  useState: {
    Sandbox: UseStateSandbox,
    lessons: useStateLessons,
    initialTrace: getUseStateTrace,
    getInitialTrace: getUseStateTrace,
    getInitialRender: getUseStateInitialRender
  },
  useEffect: {
    Sandbox: UseEffectSandbox,
    lessons: useEffectLessons,
    initialTrace: getUseEffectTrace,
    getInitialTrace: getUseEffectTrace,
    getInitialRender: getUseEffectInitialRender
  },
  useContext: {
    Sandbox: UseContextSandbox,
    lessons: useContextLessons,
    initialTrace: getUseContextTrace,
    getInitialTrace: getUseContextTrace,
    getInitialRender: getUseContextInitialRender
  },
  useId: {
    Sandbox: UseIdSandbox,
    lessons: useIdLessons,
    initialTrace: getUseIdTrace,
    getInitialTrace: getUseIdTrace,
    getInitialRender: getUseIdInitialRender
  },
  useOptimistic: {
    Sandbox: UseOptimisticSandbox,
    lessons: useOptimisticLessons,
    initialTrace: getUseOptimisticTrace,
    getInitialTrace: getUseOptimisticTrace,
    getInitialRender: getUseOptimisticInitialRender
  },
  useDeferredValue: {
    Sandbox: UseDeferredValueSandbox,
    lessons: useDeferredValueLessons,
    initialTrace: getUseDeferredValueTrace,
    getInitialTrace: getUseDeferredValueTrace,
    getInitialRender: getUseDeferredValueInitialRender
  },
  useTransition: {
    Sandbox: UseTransitionSandbox,
    lessons: useTransitionLessons,
    initialTrace: getUseTransitionTrace,
    getInitialTrace: getUseTransitionTrace,
    getInitialRender: getUseTransitionInitialRender
  },
  useRef: {
    Sandbox: UseRefSandbox,
    lessons: useRefLessons,
    initialTrace: getUseRefTrace,
    getInitialTrace: getUseRefTrace,
    getInitialRender: getUseRefInitialRender
  },
  useReducer: {
    Sandbox: UseReducerSandbox,
    lessons: useReducerLessons,
    initialTrace: getUseReducerTrace,
    getInitialTrace: getUseReducerTrace,
    getInitialRender: getUseReducerInitialRender
  },
  useImperativeHandle: {
    Sandbox: UseImperativeHandleSandbox,
    lessons: useImperativeHandleLessons,
    initialTrace: getUseImperativeHandleTrace,
    getInitialTrace: getUseImperativeHandleTrace,
    getInitialRender: getUseImperativeHandleInitialRender
  },
  useFormStatus: {
    Sandbox: UseFormStatusSandbox,
    lessons: useFormStatusLessons,
    initialTrace: getUseFormStatusTrace,
    getInitialTrace: getUseFormStatusTrace,
    getInitialRender: getUseFormStatusInitialRender
  },
  useLayoutEffect: {
    Sandbox: UseLayoutEffectSandbox,
    lessons: useLayoutEffectLessons,
    initialTrace: getUseLayoutEffectTrace,
    getInitialTrace: getUseLayoutEffectTrace,
    getInitialRender: getUseLayoutEffectInitialRender
  },
  useInsertionEffect: {
    Sandbox: UseInsertionEffectSandbox,
    lessons: useInsertionEffectLessons,
    initialTrace: getUseInsertionEffectTrace,
    getInitialTrace: getUseInsertionEffectTrace,
    getInitialRender: getUseInsertionEffectInitialRender
  },
  useSyncExternalStore: {
    Sandbox: UseSyncExternalStoreSandbox,
    lessons: useSyncExternalStoreLessons,
    initialTrace: getUseSyncExternalStoreTrace,
    getInitialTrace: getUseSyncExternalStoreTrace,
    getInitialRender: getUseSyncExternalStoreInitialRender
  },
  useActionState: {
    Sandbox: UseActionStateSandbox,
    lessons: useActionStateLessons,
    initialTrace: getUseActionStateTrace,
    getInitialTrace: getUseActionStateTrace,
    getInitialRender: getUseActionStateInitialRender
  },
  use: {
    Sandbox: UseHookSandbox,
    lessons: useLessons,
    initialTrace: getUseTrace,
    getInitialTrace: getUseTrace,
    getInitialRender: getUseInitialRender
  },
  useDebugValue: {
    Sandbox: UseDebugValueSandbox,
    lessons: useDebugValueLessons,
    initialTrace: getUseDebugValueTrace,
    getInitialTrace: getUseDebugValueTrace,
    getInitialRender: getUseDebugValueInitialRender
  },
  useEffectEvent: {
    Sandbox: UseEffectEventSandbox,
    lessons: useEffectEventLessons,
    initialTrace: getUseEffectEventTrace,
    getInitialTrace: getUseEffectEventTrace,
    getInitialRender: getUseEffectEventInitialRender
  }
};

export const HOOK_LESSONS = {
  useState: useStateLessons,
  useEffect: useEffectLessons,
  useContext: useContextLessons,
  useId: useIdLessons,
  useOptimistic: useOptimisticLessons,
  useDeferredValue: useDeferredValueLessons,
  useTransition: useTransitionLessons,
  useRef: useRefLessons,
  useReducer: useReducerLessons,
  useImperativeHandle: useImperativeHandleLessons,
  useFormStatus: useFormStatusLessons,
  useLayoutEffect: useLayoutEffectLessons,
  useInsertionEffect: useInsertionEffectLessons,
  useSyncExternalStore: useSyncExternalStoreLessons,
  useActionState: useActionStateLessons,
  use: useLessons,
  useDebugValue: useDebugValueLessons,
  useEffectEvent: useEffectEventLessons
};
