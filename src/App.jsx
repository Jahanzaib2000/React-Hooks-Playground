import { DEFAULT_INSPECTOR_TAB, MAX_MUTATION_HISTORY } from './constants/app.js';
import { useState } from 'react';
import { HOOK_MODULES } from './features';
import {
  Header,
  CodeViewer,
  TimelineDock,
  TheoryDrawer,
  ExecutionTree,
  DomDiffInspector,
  IdWiringInspector,
  OptimisticLifecycleInspector
} from './shared/components';

export default function App({ activeHook }) {
  const [isTheoryOpen, setIsTheoryOpen] = useState(false);
  const [inspectorTab, setInspectorTab] = useState(DEFAULT_INSPECTOR_TAB);

  // A route change starts one fresh lesson/telemetry session, including Back/Forward.
  return (
    <div className="app-container">
      <Header activeHook={activeHook} onOpenTheory={() => setIsTheoryOpen(true)} />
      <HookWorkspace
        key={activeHook}
        activeHook={activeHook}
        isTheoryOpen={isTheoryOpen}
        setIsTheoryOpen={setIsTheoryOpen}
        inspectorTab={inspectorTab}
        setInspectorTab={setInspectorTab}
      />
    </div>
  );
}

function HookWorkspace({ activeHook, isTheoryOpen, setIsTheoryOpen, inspectorTab, setInspectorTab }) {
  const [activeLessonId, setActiveLessonId] = useState(HOOK_MODULES[activeHook].lessons[0].id);
  const [selectedTokenId, setSelectedTokenId] = useState(HOOK_MODULES[activeHook].lessons[0].tokenOptions[0].id);
  const [activeRenderIndex, setActiveRenderIndex] = useState(0);
  const [mutations, setMutations] = useState([]);

  const currentModule = HOOK_MODULES[activeHook];
  const currentLessons = currentModule?.lessons || [];
  const currentLesson = currentLessons.find((l) => l.id === activeLessonId) || currentLessons[0];

  const [renderHistory, setRenderHistory] = useState(() => [
    currentModule?.getInitialRender?.(currentLesson?.id, selectedTokenId) || {
      renderNumber: 1,
      trigger: 'Initial Mount',
      prevState: null,
      currentState: { count: 0 }
    }
  ]);

  const [executionTrace, setExecutionTrace] = useState(() =>
    currentModule?.getInitialTrace?.(currentLesson?.id, selectedTokenId)
  );

  const resetTraceAndHistory = (hook, lesson, tokenId) => {
    const effTokenId = tokenId || lesson?.tokenOptions?.[0]?.id;
    const mod = HOOK_MODULES[hook];
    const initialRender = mod?.getInitialRender?.(lesson?.id, effTokenId) || {
      renderNumber: 1,
      trigger: 'Initial Mount',
      prevState: null,
      currentState: { count: 0 }
    };
    setRenderHistory([initialRender]);
    setActiveRenderIndex(0);
    setMutations([]);
    setExecutionTrace(mod?.getInitialTrace?.(lesson?.id, effTokenId) || null);
  };

  const handleSelectLesson = (lessonId) => {
    const newLesson = currentLessons.find((l) => l.id === lessonId);
    if (!newLesson) return;
    const newTokenId = newLesson.tokenOptions?.[0]?.id;
    setActiveLessonId(lessonId);
    setSelectedTokenId(newTokenId);
    resetTraceAndHistory(activeHook, newLesson, newTokenId);
  };

  const handleSelectToken = (tokenId) => {
    setSelectedTokenId(tokenId);
    resetTraceAndHistory(activeHook, currentLesson, tokenId);
  };

  const handleRecordRender = (renderData) => {
    setRenderHistory((prev) => {
      const updated = [...prev, renderData];
      setActiveRenderIndex(updated.length - 1);
      return updated;
    });
  };

  const handleRecordTrace = (trace) => setExecutionTrace(trace);
  const handleRecordMutation = (mutation) => setMutations((prev) => [mutation, ...prev.slice(0, MAX_MUTATION_HISTORY - 1)]);

  const isSplitCodeOnly = activeHook === 'useFormStatus' && activeLessonId === 'ufs-pending-state';
  const isLayoutEffect = activeHook === 'useLayoutEffect';
  const isDebugValue = activeHook === 'useDebugValue';
  const ActiveSandbox = currentModule?.Sandbox;

  const sandboxElement = ActiveSandbox && (
    <ActiveSandbox
      activeLessonId={activeLessonId}
      selectedTokenId={selectedTokenId}
      onSelectToken={handleSelectToken}
      onRecordRender={handleRecordRender}
      onRecordTrace={handleRecordTrace}
      onRecordMutation={handleRecordMutation}
      onReset={() => resetTraceAndHistory(activeHook, currentLesson, selectedTokenId)}
    />
  );

  return (
    <>
      <main className={`workspace-grid ${isSplitCodeOnly ? 'full-width-workspace' : ''} ${isLayoutEffect ? 'layout-effect-workspace' : ''} ${isDebugValue ? 'debug-value-workspace' : ''}`}>
        {isDebugValue ? (
          <>
            <section className="debug-value-sandbox-pane">
              {sandboxElement}
            </section>
            <section className="debug-value-code-pane">
              <CodeViewer
                lessons={currentLessons}
                activeLessonId={activeLessonId}
                onSelectLesson={handleSelectLesson}
                lesson={currentLesson}
                selectedTokenId={selectedTokenId}
                onSelectToken={handleSelectToken}
              />
            </section>
          </>
        ) : (
          <>
            <section className={`left-pane ${isSplitCodeOnly ? 'full-width-pane' : ''} ${isLayoutEffect ? 'layout-effect-code-pane' : ''}`}>
              <CodeViewer
                lessons={currentLessons}
                activeLessonId={activeLessonId}
                onSelectLesson={handleSelectLesson}
                lesson={currentLesson}
                selectedTokenId={selectedTokenId}
                onSelectToken={handleSelectToken}
              />
            </section>

            {!isSplitCodeOnly && (
              <section className={`right-pane ${isLayoutEffect ? 'layout-effect-sandbox-pane' : ''}`}>
                {sandboxElement}
                <TimelineDock
                  renderHistory={renderHistory}
                  activeRenderIndex={activeRenderIndex}
                  onSelectRender={setActiveRenderIndex}
                />
              </section>
            )}
          </>
        )}
      </main>

      {activeHook === 'useId' && (
        <IdWiringInspector
          activeLessonId={activeLessonId}
          selectedTokenId={selectedTokenId}
        />
      )}

      {activeHook === 'useOptimistic' && (
        <OptimisticLifecycleInspector
          activeLessonId={activeLessonId}
          selectedTokenId={selectedTokenId}
          executionTrace={executionTrace}
        />
      )}

      <section className="panel-card bottom-dock">
        <nav className="tabs-nav">
          <button
            type="button"
            className={`tab-link ${inspectorTab === 'dom' ? 'active' : ''}`}
            onClick={() => setInspectorTab('dom')}
          >
            <span>🌲 DOM Changes ({mutations.length})</span>
          </button>
          <button
            type="button"
            className={`tab-link ${inspectorTab === 'tree' ? 'active' : ''}`}
            onClick={() => setInspectorTab('tree')}
          >
            <span>🪝 Component &amp; Hook Tree</span>
          </button>
        </nav>

        {inspectorTab === 'dom' ? (
          <DomDiffInspector mutations={mutations} />
        ) : (
          <ExecutionTree executionTrace={executionTrace} />
        )}
      </section>

      <TheoryDrawer
        isOpen={isTheoryOpen}
        onClose={() => setIsTheoryOpen(false)}
        lesson={currentLesson}
        activeHook={activeHook}
      />
    </>
  );
}
