export const CATEGORIES = [
  { id: 'html',  label: 'HTML',    icon: '🌐', color: '#E34F26' },
  { id: 'css',   label: 'CSS',     icon: '🎨', color: '#2965F1' },
  { id: 'js',    label: 'JavaScript', icon: '⚡', color: '#F7DF1E' },
  { id: 'react', label: 'React',   icon: '⚛️', color: '#61DAFB' },
];

export const DIFFICULTY = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };

export const QUESTIONS = {
  html: [
    { id: 'h1', text: 'What is semantic HTML and why is it important for accessibility and SEO?', difficulty: 'easy', hint: 'Think about elements like <article>, <section>, <header>, and their meaning to browsers and screen readers.' },
    { id: 'h2', text: 'Explain the difference between <div> and <span>. When should you use each?', difficulty: 'easy', hint: 'Consider block vs inline display behavior.' },
    { id: 'h3', text: 'What are data attributes in HTML5? How and when would you use them?', difficulty: 'easy', hint: 'Think about data-* attributes and accessing them via JavaScript.' },
    { id: 'h4', text: 'Describe the HTML5 Canvas element. What are its use cases and limitations?', difficulty: 'medium', hint: 'Consider drawing, animations, and when SVG might be better.' },
    { id: 'h5', text: 'What is the difference between localStorage, sessionStorage, and cookies?', difficulty: 'medium', hint: 'Think about persistence, scope, size limits, and server access.' },
    { id: 'h6', text: 'Explain the purpose of the <meta> viewport tag. What happens without it on mobile?', difficulty: 'easy', hint: 'Consider how browsers scale pages on mobile devices.' },
    { id: 'h7', text: 'What are Web Workers? How do they help with JavaScript performance?', difficulty: 'hard', hint: 'Think about multi-threading, off-main-thread tasks.' },
    { id: 'h8', text: 'Explain the difference between progressive enhancement and graceful degradation.', difficulty: 'medium', hint: 'Consider how you build for baseline browsers vs cutting-edge ones.' },
    { id: 'h9', text: 'What are ARIA roles and attributes? Give examples of when you would use them.', difficulty: 'medium', hint: 'Focus on accessibility for dynamic content and custom widgets.' },
    { id: 'h10', text: 'How does the browser rendering pipeline work from HTML parsing to paint?', difficulty: 'hard', hint: 'Think about DOM, CSSOM, render tree, layout, paint, and composite.' },
  ],

  css: [
    { id: 'c1', text: 'Explain the CSS Box Model. What is the difference between content-box and border-box?', difficulty: 'easy', hint: 'Think about how width/height is calculated with padding and borders.' },
    { id: 'c2', text: 'What is CSS specificity and how is it calculated? Give examples.', difficulty: 'medium', hint: 'Consider inline styles, IDs, classes, and element selectors.' },
    { id: 'c3', text: 'Describe CSS Flexbox layout. When would you choose it over CSS Grid?', difficulty: 'easy', hint: 'Think about one-dimensional vs two-dimensional layout needs.' },
    { id: 'c4', text: 'Explain CSS Grid. What are the key properties and how do they work together?', difficulty: 'medium', hint: 'Consider grid-template-columns, grid-area, fr units, auto-fill/auto-fit.' },
    { id: 'c5', text: 'What are CSS Custom Properties (variables)? How do they differ from preprocessor variables?', difficulty: 'medium', hint: 'Think about runtime vs compile-time, cascading, and JavaScript access.' },
    { id: 'c6', text: 'What is the CSS cascade and how does it determine which styles are applied?', difficulty: 'medium', hint: 'Consider origin, specificity, and order of declaration.' },
    { id: 'c7', text: 'Explain CSS animations vs transitions. When would you use each?', difficulty: 'easy', hint: 'Think about keyframes, trigger events, and timing control.' },
    { id: 'c8', text: 'What are pseudo-elements and pseudo-classes? Give practical examples of each.', difficulty: 'medium', hint: 'Think ::before/::after vs :hover/:nth-child.' },
    { id: 'c9', text: 'Explain the concept of CSS stacking context. What creates a new stacking context?', difficulty: 'hard', hint: 'Think about z-index, transform, opacity, and how elements layer.' },
    { id: 'c10', text: 'What are CSS containment properties? How do they improve rendering performance?', difficulty: 'hard', hint: 'Consider contain: layout, style, paint, and their effect on the render pipeline.' },
  ],

  js: [
    { id: 'j1', text: 'Explain the difference between var, let, and const. What is hoisting?', difficulty: 'easy', hint: 'Think about scope, re-assignment, and how they behave in the temporal dead zone.' },
    { id: 'j2', text: 'What is the event loop in JavaScript? How does it handle asynchronous code?', difficulty: 'medium', hint: 'Consider the call stack, callback queue, microtask queue, and Web APIs.' },
    { id: 'j3', text: 'Explain closures in JavaScript with a practical example.', difficulty: 'medium', hint: 'Think about lexical scoping and how functions retain access to their outer scope.' },
    { id: 'j4', text: 'What is the difference between == and ===? When should you use each?', difficulty: 'easy', hint: 'Consider type coercion and when loose equality might be useful.' },
    { id: 'j5', text: 'Explain Promises and async/await. How do they improve over callbacks?', difficulty: 'medium', hint: 'Think about callback hell, error handling, and chaining.' },
    { id: 'j6', text: 'What is prototype-based inheritance in JavaScript? How does it work?', difficulty: 'hard', hint: 'Think about the prototype chain, __proto__, and Object.create().' },
    { id: 'j7', text: 'Describe the concept of debouncing and throttling. When would you use each?', difficulty: 'medium', hint: 'Consider rate-limiting user input events like scroll, resize, and keypress.' },
    { id: 'j8', text: 'What are JavaScript generators? How do they differ from regular functions?', difficulty: 'hard', hint: 'Think about yield, lazy evaluation, and iterators.' },
    { id: 'j9', text: 'Explain the difference between deep and shallow cloning of objects in JavaScript.', difficulty: 'medium', hint: 'Consider spread operator, Object.assign, JSON methods, and structuredClone.' },
    { id: 'j10', text: 'What is a WeakMap and WeakSet? When would you use them over Map and Set?', difficulty: 'hard', hint: 'Think about garbage collection, memory leaks, and private data patterns.' },
  ],

  react: [
    { id: 'r1', text: 'Explain the difference between controlled and uncontrolled components in React.', difficulty: 'easy', hint: 'Think about who owns the form state — React vs the DOM.' },
    { id: 'r2', text: 'What is the Virtual DOM and how does React\'s reconciliation algorithm work?', difficulty: 'medium', hint: 'Think about diffing, keys, and the Fiber reconciler.' },
    { id: 'r3', text: 'Explain the useEffect hook. What are its dependency array behaviors and cleanup function?', difficulty: 'medium', hint: 'Consider empty array, specific deps, no array, and memory leak prevention.' },
    { id: 'r4', text: 'What is the purpose of useCallback and useMemo? When should you use them?', difficulty: 'medium', hint: 'Think about referential equality, expensive computations, and over-optimization.' },
    { id: 'r5', text: 'Explain React Context API. When would you use it vs a state management library?', difficulty: 'medium', hint: 'Consider prop drilling, performance implications, and when Redux might be better.' },
    { id: 'r6', text: 'What are React custom hooks? How do you create one and what rules must you follow?', difficulty: 'medium', hint: 'Think about the Rules of Hooks and encapsulating stateful logic.' },
    { id: 'r7', text: 'Explain React.memo, React.lazy, and Suspense. How do they optimize performance?', difficulty: 'hard', hint: 'Consider memoization, code splitting, and loading states.' },
    { id: 'r8', text: 'What is prop drilling and what are the common patterns to avoid it?', difficulty: 'easy', hint: 'Think about Context, component composition, and render props.' },
    { id: 'r9', text: 'How does React handle events differently from the browser\'s native event system?', difficulty: 'medium', hint: 'Consider synthetic events, event delegation, and event pooling.' },
    { id: 'r10', text: 'What are React Server Components? How do they differ from Client Components?', difficulty: 'hard', hint: 'Think about what runs on the server vs client, serialization, and data fetching.' },
  ],
};

export const OPENROUTER_MODELS = [
  { id: 'anthropic/claude-3-haiku', label: 'Claude 3 Haiku (Fast)' },
  { id: 'openai/gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
  { id: 'mistralai/mistral-7b-instruct', label: 'Mistral 7B (Free)' },
  { id: 'google/gemma-2-9b-it:free', label: 'Gemma 2 9B (Free)' },
];

export function getRandomQuestions(category, count = 5) {
  const pool = [...QUESTIONS[category]];
  const shuffled = pool.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, pool.length));
}

export function getAllQuestions(categories = ['html', 'css', 'js', 'react'], count = 10) {
  const all = categories.flatMap(cat => QUESTIONS[cat].map(q => ({ ...q, category: cat })));
  return all.sort(() => Math.random() - 0.5).slice(0, count);
}
