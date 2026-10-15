import { INITIAL_FACTORS, RANDOM_FACTOR_MIN, RANDOM_FACTOR_SPAN } from '../../constants/use-deferred-value.js';
// Helper utilities for the useDeferredValue Playground

/**
 * Generate two random 2-digit integers for multiplication (10..99)
 */
export function generateRandomFactors() {
  const a = Math.floor(Math.random() * RANDOM_FACTOR_SPAN) + RANDOM_FACTOR_MIN;
  const b = Math.floor(Math.random() * RANDOM_FACTOR_SPAN) + RANDOM_FACTOR_MIN;
  return { a, b, id: Math.random().toString(36).slice(2, 7) };
}

/**
 * Calculate product of two numbers
 */
export function calculateProduct(a, b) {
  return a * b;
}

/**
 * Formats multiplication calculation string
 */
export function formatCalculation(a, b) {
  const prod = a * b;
  return `${a} × ${b} = ${prod.toLocaleString()}`;
}

/**
 * Builds metadata for Timeline render cards
 */
export function buildDeferredClickInfo({
  urgentFactors,
  deferredFactors,
  isStale = false,
  isComputing = false,
  strategy = 'deferred-value'
}) {
  return {
    urgentFactors: { ...urgentFactors },
    deferredFactors: { ...deferredFactors },
    urgentFormula: `${urgentFactors.a} × ${urgentFactors.b}`,
    urgentProduct: urgentFactors.a * urgentFactors.b,
    deferredFormula: `${deferredFactors.a} × ${deferredFactors.b}`,
    deferredProduct: deferredFactors.a * deferredFactors.b,
    isStale,
    isComputing,
    strategy
  };
}

/**
 * Provides initial timeline metadata on lesson mount
 */
export function getInitialUseDeferredValueInfo(_lessonId = 'udv-delayed-multi', tokenId = '') {
  const initialFactors = createInitialFactors();
  const initialFormula = `${initialFactors.a} × ${initialFactors.b}`;
  const initialProduct = initialFactors.a * initialFactors.b;
  return {
    urgentFactors: initialFactors,
    deferredFactors: initialFactors,
    urgentFormula: initialFormula,
    urgentProduct: initialProduct,
    deferredFormula: initialFormula,
    deferredProduct: initialProduct,
    isStale: false,
    isComputing: false,
    strategy: tokenId || 'deferred-value'
  };
}

export function createInitialFactors() {
  return { ...INITIAL_FACTORS };
}
