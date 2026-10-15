import { relativeCenter, relativePort } from './animationGeometry.js';
import { ReducerPlaygroundView } from './ReducerPlaygroundView.jsx';
import { CATALOG_PRODUCTS, REDUCER_TIMING_MS } from '../../constants/use-reducer.js';
import { useState, useRef, useEffect } from 'react';

export function UseReducerInnerSandbox({
  cartState,
  onAddToCart,
  onDecrementFromCart,
  onRemoveFromCart,
  onClearCart
}) {
  const rootRef = useRef(null);
  const box1Ref = useRef(null);
  const box3Ref = useRef(null);
  const box2Ref = useRef(null);
  const trashBoxRef = useRef(null);
  const animTimerRef = useRef(null);

  const [animatingItem, setAnimatingItem] = useState(null);
  const [animPhase, setAnimPhase] = useState('idle'); // 'idle' | 'to-box3' | 'in-box3' | 'to-box2' | 'remove-to-box3' | 'remove-in-box3' | 'remove-to-trash' | 'in-trash'
  const [animType, setAnimType] = useState(null); // 'add' | 'remove'
  const [packetPos, setPacketPos] = useState({ x: 0, y: 0 });
  const [showTrash, setShowTrash] = useState(false);
  const [trashExiting, setTrashExiting] = useState(false);
  const [activeHookTarget, setActiveHookTarget] = useState(null); // 'add' | 'remove' | null
  const [hookStage, setHookStage] = useState('idle'); // 'idle' | 'extending' | 'hooked' | 'retracting'

  useEffect(() => {
    return () => {
      if (animTimerRef.current) clearTimeout(animTimerRef.current);
    };
  }, []);

  const handleStartAdd = (product) => {
    if (animPhase !== 'idle' || activeHookTarget !== null) return;

    if (!rootRef.current || !box1Ref.current || !box3Ref.current || !box2Ref.current) {
      onAddToCart(product);
      return;
    }

    const rootRect = rootRef.current.getBoundingClientRect();
    const b1Rect = box1Ref.current.getBoundingClientRect();
    const b3Rect = box3Ref.current.getBoundingClientRect();
    const b2Rect = box2Ref.current.getBoundingClientRect();

    // Box 1 start port
    const p1 = relativePort(b1Rect, rootRect, -15, 'right');

    // Box 3 center
    const p3 = relativeCenter(b3Rect, rootRect);

    // Box 2 end port
    const p2 = relativePort(b2Rect, rootRect, 20);

    // STEP 1: HOOK FIRST to "add function"!
    setAnimType('add');
    setActiveHookTarget('add');
    setHookStage('extending');

    // Hook reaches "add function" and latches on
    animTimerRef.current = setTimeout(() => {
      setHookStage('hooked');

      // STEP 2: NOW THE ITEM BEGINS TRAVELING WHILE HOOK REMAINS CONNECTED!
      animTimerRef.current = setTimeout(() => {
        setAnimatingItem(product);
        setPacketPos(p1);
        setAnimPhase('to-box3');

        // Double RAF ensures DOM is painted at p1 before animating to p3
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setPacketPos(p3);
          });
        });

        // Item reaches Box 3 (useReducer node)
        animTimerRef.current = setTimeout(() => {
          setAnimPhase('in-box3');

          // Item travels along Wire 2 to Box 2
          animTimerRef.current = setTimeout(() => {
            setAnimPhase('to-box2');
            setPacketPos(p2);

            // Item arrives in Box 2 and IS PLACED IN CART!
            animTimerRef.current = setTimeout(() => {
              onAddToCart(product);
              setAnimatingItem(null);
              setAnimPhase('idle');

              // STEP 3: UNHOOK AFTER ITEM IS PLACED IN CART!
              animTimerRef.current = setTimeout(() => {
                setHookStage('retracting');

                // Hook finishes retracting back into useReducer
                animTimerRef.current = setTimeout(() => {
                  setActiveHookTarget(null);
                  setHookStage('idle');
                  setAnimType(null);
                }, REDUCER_TIMING_MS.hookRetract);
              }, REDUCER_TIMING_MS.hookPause);
            }, REDUCER_TIMING_MS.packetTravel);
          }, REDUCER_TIMING_MS.reducerPause);
        }, REDUCER_TIMING_MS.packetTravel);
      }, REDUCER_TIMING_MS.packetLaunch);
    }, REDUCER_TIMING_MS.hookExtend);
  };

  const handleStartRemove = (item) => {
    if (animPhase !== 'idle' || activeHookTarget !== null) return;

    if (!rootRef.current || !box2Ref.current || !box3Ref.current) {
      onRemoveFromCart(item.id);
      return;
    }

    const rootRect = rootRef.current.getBoundingClientRect();
    const b2Rect = box2Ref.current.getBoundingClientRect();
    const b3Rect = box3Ref.current.getBoundingClientRect();

    // Start in Box 2 (Shopping Cart)
    const p2_start = relativePort(b2Rect, rootRect, 25);

    // Box 3 center (useReducer node)
    const p3_center = relativeCenter(b3Rect, rootRect);

    // STEP 1: HOOK FIRST to "remove function" & display Trash Box!
    setShowTrash(true);
    setTrashExiting(false);
    setAnimType('remove');
    setActiveHookTarget('remove');
    setHookStage('extending');

    // Hook reaches "remove function" and latches on
    animTimerRef.current = setTimeout(() => {
      setHookStage('hooked');

      // STEP 2: NOW THE ITEM BEGINS TRAVELING WHILE HOOK REMAINS CONNECTED!
      animTimerRef.current = setTimeout(() => {
        setAnimatingItem(item);
        setPacketPos(p2_start);
        setAnimPhase('remove-to-box3');

        // Double RAF ensures packet DOM renders at p2_start before transitioning to p3_center
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setPacketPos(p3_center);
          });
        });

        // Item reaches Box 3 (useReducer node)
        animTimerRef.current = setTimeout(() => {
          setAnimPhase('remove-in-box3');

          // Item drops down into Trash Box
          animTimerRef.current = setTimeout(() => {
            let p_trash = {
              x: p3_center.x,
              y: p3_center.y + 75
            };

            if (trashBoxRef.current && rootRef.current) {
              const tRect = trashBoxRef.current.getBoundingClientRect();
              const rRect = rootRef.current.getBoundingClientRect();
              p_trash = relativeCenter(tRect, rRect);
            }

            setAnimPhase('remove-to-trash');
            setPacketPos(p_trash);

            // Item arrives inside Trash Box
            animTimerRef.current = setTimeout(() => {
              setAnimPhase('in-trash');

              // Incinerate / vaporize in trash, then commit state (ITEM PUT IN TRASH!)
              animTimerRef.current = setTimeout(() => {
                onRemoveFromCart(item.id);
                setAnimatingItem(null);
                setTrashExiting(true);

                // STEP 3: UNHOOK AFTER ITEM IS PUT IN THE TRASH!
                animTimerRef.current = setTimeout(() => {
                  setHookStage('retracting');

                  // Hook finishes retracting back into useReducer, hide trash
                  animTimerRef.current = setTimeout(() => {
                    setShowTrash(false);
                    setTrashExiting(false);
                    setActiveHookTarget(null);
                    setHookStage('idle');
                    setAnimPhase('idle');
                    setAnimType(null);
                  }, REDUCER_TIMING_MS.hookRetract);
                }, REDUCER_TIMING_MS.hookPause);
              }, REDUCER_TIMING_MS.trashFade);
            }, REDUCER_TIMING_MS.trashDrop);
          }, REDUCER_TIMING_MS.reducerPause);
        }, REDUCER_TIMING_MS.packetTravel);
      }, REDUCER_TIMING_MS.packetLaunch);
    }, REDUCER_TIMING_MS.hookExtend);
  };

  const handleDirectAddFn = () => {
    if (isAnimating) return;
    const nextProd = CATALOG_PRODUCTS[cartState.items.length % CATALOG_PRODUCTS.length] || CATALOG_PRODUCTS[0];
    handleStartAdd(nextProd);
  };

  const handleDirectRemoveFn = () => {
    if (isAnimating || cartState.items.length === 0) return;
    const lastItem = cartState.items[cartState.items.length - 1];
    handleStartRemove(lastItem);
  };

  const isAnimating = animPhase !== 'idle' || activeHookTarget !== null;

  return (
    <ReducerPlaygroundView
      rootRef={rootRef}
      handleStartAdd={handleStartAdd}
      isAnimating={isAnimating}
      box1Ref={box1Ref}
      animPhase={animPhase}
      activeHookTarget={activeHookTarget}
      cartState={cartState}
      handleDirectAddFn={handleDirectAddFn}
      handleDirectRemoveFn={handleDirectRemoveFn}
      hookStage={hookStage}
      box3Ref={box3Ref}
      showTrash={showTrash}
      trashBoxRef={trashBoxRef}
      trashExiting={trashExiting}
      onAddToCart={onAddToCart}
      onDecrementFromCart={onDecrementFromCart}
      handleStartRemove={handleStartRemove}
      onClearCart={onClearCart}
      box2Ref={box2Ref}
      animatingItem={animatingItem}
      animType={animType}
      packetPos={packetPos}
    />
  );
}
