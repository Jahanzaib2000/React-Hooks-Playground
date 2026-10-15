// useActionState lesson definitions and execution traces
export function getInitialRender() {
  return {
    renderNumber: 1,
    trigger: 'Initial Mount',
    prevState: null,
    currentState: { status: 'idle', message: null, isPending: false }
  };
}

export const lessons = [
    {
      id: 'uas-login-form',
      hook: 'useActionState',
      title: 'Asynchronous Form Actions & Pending States',
      subtitle: 'Manage server action response states and transitions cleanly in React 19',
      category: 'React 19 Actions',
      tokenOptions: [
        {
          id: 'standard',
          label: 'useActionState Login',
          description: 'Login form with automatic email, blank password input, and multi-phase validation pop-up'
        }
      ],
      codeTemplate: () => `// React 19: Asynchronous Form Action State
async function loginAction(previousState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  // Phase 1: Validating (2s)
  // Phase 2: Confirming response (3s)
  // Phase 3: Evaluate credentials
  if (password === 'react123') {
    return { status: 'success', message: 'logged in' };
  } else {
    return { status: 'error', message: 'incorrect login or password' };
  }
}

function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, {
    status: 'idle',
    message: null
  });

  return (
    <form action={formAction}>
      <input name="email" defaultValue="developer@react.dev" readOnly />
      <input name="password" type="password" placeholder="Enter password" />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Verifying...' : 'Sign In'}
      </button>
      <div className="hint">Hint: Password is "react123"</div>
    </form>
  );
}`,
      explain: {
        takeaway: 'useActionState in React 19 handles asynchronous server actions, automatically binds pending state, and updates state without boilerplate.',
        myths: [
          'Myth: useActionState requires manual useState for loading spinners and error handling.',
          'Myth: Form actions must execute in client-only memory without transition awareness.'
        ]
      }
    }
  ];

export function getInitialTrace(lessonId, _tokenId = '') {
  switch (lessonId) {
    case 'uas-login-form': {
      return {
        trigger: { label: 'Initial Mount', type: 'Mount' },
        componentName: 'LoginForm',
        renderNumber: 1,
        hooks: [
          {
            slot: 0,
            name: 'useActionState',
            status: 'Idle (Awaiting form submission)',
            actionRequired: false,
            prevState: 'undefined',
            nextState: JSON.stringify({ status: 'idle', message: null })
          }
        ],
        commit: {
          diffSummary: 'Mounted LoginForm with autofilled email and useActionState',
          mutationsCount: 1
        },
        effects: null
      };
    }
    default:
      return null;
  }
}
