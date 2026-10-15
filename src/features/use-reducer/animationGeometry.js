

export function relativeCenter(rect, rootRect) {
  return {
    x: rect.left + rect.width / 2 - rootRect.left,
    y: rect.top + rect.height / 2 - rootRect.top
  };
}

export function relativePort(rect, rootRect, offset, side = 'left') {
  return {
    x: rect[side] - rootRect.left + offset,
    y: rect.top + rect.height / 2 - rootRect.top
  };
}
