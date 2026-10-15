import { INSTANCE_THEMES } from '../../constants/use-id.js';

export function inspectIdWiring(activeLessonId, setInstances) {
    if (activeLessonId === 'uid-basics') {
      const cards = document.querySelectorAll('.uid-instance-card');
      const allInputs = Array.from(document.querySelectorAll('.uid-form-input'));

      const parsed = Array.from(cards).map((card, idx) => {
        const theme = INSTANCE_THEMES[idx % INSTANCE_THEMES.length];
        const labelEl = card.querySelector('.uid-form-label') || card.querySelector('label');
        const inputEl = card.querySelector('.uid-form-input') || card.querySelector('input');
        const badgeEl = card.querySelector('.uid-id-badge');
        const instanceLabel = card.querySelector('.uid-instance-label')?.textContent?.trim() || `Field ${idx + 1}`;

        const forAttr = labelEl?.getAttribute('for') || labelEl?.htmlFor || '';
        const inputId = inputEl?.getAttribute('id') || '';
        const chipText = badgeEl?.textContent?.trim() || inputId;
        const isFocused = document.activeElement === inputEl;

        // Detect collisions in real DOM
        const duplicateCount = allInputs.filter(inp => inp.getAttribute('id') === inputId && inputId).length;
        const isCollision = duplicateCount > 1;

        const attributes = [
          {
            key: 'htmlFor',
            tag: 'label',
            attr: 'htmlFor',
            value: forAttr,
            browserOrder: 1,
            role: 'Accessible Name & Click Association',
            connected: Boolean(forAttr && forAttr === inputId),
            isBroken: !forAttr || forAttr !== inputId,
            element: labelEl
          },
          {
            key: 'id',
            tag: 'input',
            attr: 'id',
            value: inputId,
            browserOrder: 2,
            role: 'Target Identity in Document Object Model',
            connected: Boolean(inputId),
            isBroken: !inputId,
            element: inputEl
          }
        ];

        return {
          idx,
          name: instanceLabel,
          hubId: chipText,
          theme,
          isCollision,
          isFocused,
          attributes,
          labelEl,
          inputEl
        };
      });

      setInstances(parsed);
    } else if (activeLessonId === 'uid-a11y') {
      const fieldGroups = document.querySelectorAll('.uid-a11y-field-group');

      const parsed = Array.from(fieldGroups).map((group, idx) => {
        const theme = INSTANCE_THEMES[idx % INSTANCE_THEMES.length];
        const labelEl = group.querySelector('.uid-a11y-label');
        const inputEl = group.querySelector('.uid-a11y-input');
        const hintEl = group.querySelector('.uid-a11y-hint');
        const errorEl = group.querySelector('.uid-a11y-error');
        const badgeEl = group.querySelector('.uid-id-badge');

        const forAttr = labelEl?.getAttribute('for') || '';
        const inputId = inputEl?.getAttribute('id') || '';
        const hintId = hintEl?.getAttribute('id') || '';
        const errorId = errorEl?.getAttribute('id') || '';
        const ariaDesc = inputEl?.getAttribute('aria-describedby') || '';
        const chipText = badgeEl?.textContent?.trim() || inputId;
        const isFocused = document.activeElement === inputEl;

        const attributes = [
          {
            key: 'htmlFor',
            tag: 'label',
            attr: 'htmlFor',
            value: forAttr,
            browserOrder: 1,
            role: 'Click focus target & Accessible Name',
            connected: Boolean(forAttr && forAttr === inputId),
            isBroken: !forAttr,
            element: labelEl
          },
          {
            key: 'id-input',
            tag: 'input',
            attr: 'id',
            value: inputId,
            browserOrder: 2,
            role: 'Primary input identity in DOM tree',
            connected: Boolean(inputId),
            isBroken: !inputId,
            element: inputEl
          },
          {
            key: 'id-hint',
            tag: 'p',
            attr: 'id',
            value: hintId,
            browserOrder: 3,
            role: 'Help text description target',
            connected: Boolean(hintId),
            isBroken: !hintId,
            element: hintEl
          },
          {
            key: 'aria-desc',
            tag: 'input',
            attr: 'aria-describedby',
            value: ariaDesc,
            browserOrder: 4,
            role: 'Screen reader accessibility description link',
            connected: Boolean(ariaDesc && hintId && ariaDesc.includes(hintId)),
            isBroken: !ariaDesc,
            element: inputEl
          }
        ];

        if (errorEl) {
          attributes.push({
            key: 'id-error',
            tag: 'span',
            attr: 'id',
            value: errorId,
            browserOrder: 5,
            role: 'Live error message announcement target',
            connected: Boolean(errorId && ariaDesc.includes(errorId)),
            isBroken: !errorId,
            element: errorEl
          });
        }

        return {
          idx,
          name: 'Email Address Field Suite',
          hubId: chipText,
          theme,
          isCollision: false,
          isFocused,
          attributes,
          labelEl,
          inputEl
        };
      });

      setInstances(parsed);
    }
  }
