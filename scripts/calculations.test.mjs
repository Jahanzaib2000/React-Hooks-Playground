import test from 'node:test';
import assert from 'node:assert/strict';
import { relativeCenter, relativePort } from '../src/features/use-reducer/animationGeometry.js';
import { formatCallTime } from '../src/features/use-effect-event/formatCallTime.js';
import { cartReducer, createInitialCartState } from '../src/features/use-reducer/helpers.js';

test('packet center is relative to the playground, including scrolled/negative positions', () => {
  assert.deepEqual(relativeCenter({ left: 210, top: 60, width: 80, height: 40 }, { left: 100, top: 20 }), { x: 150, y: 60 });
  assert.deepEqual(relativeCenter({ left: -60, top: -30, width: 20, height: 10 }, { left: -100, top: -50 }), { x: 50, y: 25 });
});
test('call duration crosses minute/hour boundaries without changing the lesson display', () => {
  for (const [seconds, expected] of [[0,'00:00'],[9,'00:09'],[59,'00:59'],[60,'01:00'],[3599,'59:59'],[3600,'60:00']]) assert.equal(formatCallTime(seconds), expected);
});
test('cart quantity changes keep totals synchronized and do not mutate earlier snapshots', () => {
  const product = { id: 'test', name: 'Test', price: 12, icon: '*' };
  const empty = createInitialCartState();
  const one = cartReducer(empty, { type: 'ADD_ITEM', payload: product });
  const two = cartReducer(one, { type: 'ADD_ITEM', payload: product });
  const backToOne = cartReducer(two, { type: 'DECREMENT_ITEM', payload: { id: 'test' } });
  const removed = cartReducer(backToOne, { type: 'REMOVE_ITEM', payload: { id: 'test' } });
  assert.deepEqual([empty.totalCount, one.totalCount, two.totalCount, backToOne.totalCount, removed.totalCount], [0,1,2,1,0]);
  assert.equal(two.totalAmount,24);
  assert.deepEqual(removed, empty);
  assert.notStrictEqual(createInitialCartState().items, empty.items);
});

test('packet ports retain distinct catalog/cart edge offsets', () => {
  const rect = { left: 210, right: 290, top: 60, height: 40 };
  const root = { left: 100, top: 20 };
  assert.deepEqual(relativePort(rect, root, -15, 'right'), { x: 175, y: 60 });
  assert.deepEqual(relativePort(rect, root, 20), { x: 130, y: 60 });
  assert.deepEqual(relativePort(rect, root, 25), { x: 135, y: 60 });
});
