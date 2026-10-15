import { IMPERATIVE_TIMING_MS } from '../../constants/use-imperative-handle.js';
import { useState, useRef, useImperativeHandle, forwardRef, useEffect, useCallback } from 'react';
import { FireworksDisplay } from './ImperativeParent.jsx';

export const ChildFireworksBox = forwardRef(function ChildFireworksBox(
  {
    boxNumber,
    childSide,
    fireworkColor,
    isImperativeOn,
    onPlayOnParent,
    onRecordRender,
    onRecordMutation
  },
  ref
) {
  const [isGlowing, setIsGlowing] = useState(false);
  const [fireworksActive, setFireworksActive] = useState(false);
  const glowTimerRef = useRef(null);
  const fireworkTimerRef = useRef(null);

  const handlePlayFireworks = useCallback(() => {
    setFireworksActive(true);
    if (onRecordRender) onRecordRender(`Box ${boxNumber} (${fireworkColor.toUpperCase()} Fireworks)`);
    if (onRecordMutation) {
      onRecordMutation({
        type: 'attribute',
        target: `Box ${boxNumber}`,
        description: `Box ${boxNumber} (${childSide} child) launched ${fireworkColor} fireworks animation`
      });
    }
    if (fireworkTimerRef.current) clearTimeout(fireworkTimerRef.current);
    fireworkTimerRef.current = setTimeout(() => {
      setFireworksActive(false);
    }, IMPERATIVE_TIMING_MS.glowAndFireworks);
  }, [boxNumber, childSide, fireworkColor, onRecordRender, onRecordMutation]);

  const handleLocalGlow = useCallback(() => {
    setIsGlowing(true);
    if (onRecordRender) onRecordRender(`Box ${boxNumber} (Inherited Glow)`);
    if (onRecordMutation) {
      onRecordMutation({
        type: 'attribute',
        target: `Box ${boxNumber}`,
        description: `Box ${boxNumber} executed inherited glow`
      });
    }
    if (glowTimerRef.current) clearTimeout(glowTimerRef.current);
    glowTimerRef.current = setTimeout(() => {
      setIsGlowing(false);
    }, IMPERATIVE_TIMING_MS.glowAndFireworks);
  }, [boxNumber, onRecordRender, onRecordMutation]);

  // useImperativeHandle: exposes triggerFireworks ONLY when bridge toggle is ON
  // When called by parent, triggers the firework animation on the parent component
  useImperativeHandle(
    ref,
    () => {
      if (!isImperativeOn) return null;
      return {
        triggerFireworks: () => {
          if (onPlayOnParent) {
            onPlayOnParent(fireworkColor);
          }
        }
      };
    },
    [isImperativeOn, fireworkColor, onPlayOnParent]
  );

  useEffect(() => {
    return () => {
      if (glowTimerRef.current) clearTimeout(glowTimerRef.current);
      if (fireworkTimerRef.current) clearTimeout(fireworkTimerRef.current);
    };
  }, []);

  return (
    <div
      className={`context-box-item imperative-box box-child child-${childSide} ${isGlowing ? 'box-glowing' : ''}`}
      id={`imperative-box-${boxNumber}`}
    >
      {/* Fireworks Particle Burst Animation on Child */}
      {fireworksActive && <FireworksDisplay color={fireworkColor} />}

      <div className="context-box-header">
        <h4 className="context-box-name">Box {boxNumber} ({childSide === 'left' ? 'Left' : 'Right'} Child)</h4>
        <span className={`theme-pill-badge pill-${fireworkColor}`}>
          {fireworkColor === 'red' ? 'Red Fireworks' : 'Blue Fireworks'}
        </span>
      </div>

      <div className="context-box-body">
        <p className="context-box-desc">
          {childSide === 'left'
            ? 'Left child with local red fireworks animation & inherited glow function.'
            : 'Right child with local blue fireworks animation & inherited glow function.'}
        </p>

        <div className="child-control-column">
          <button
            type="button"
            className={`firework-btn btn-firework-${fireworkColor}`}
            id={`btn-child-${boxNumber}-fireworks`}
            onClick={handlePlayFireworks}
          >
            {fireworkColor === 'red' ? 'Red' : 'Blue'} Fireworks
          </button>

          <button
            type="button"
            className="imperative-glow-btn"
            id={`btn-child-${boxNumber}-glow`}
            onClick={handleLocalGlow}
          >
            Glow (Inherited)
          </button>
        </div>
      </div>
    </div>
  );
});
