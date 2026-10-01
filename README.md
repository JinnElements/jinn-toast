# \<jinn-toast>

Plain vanilla web-component wrapping [toastify-js](https://github.com/apvarun/toastify-js)

This webcomponent follows the [open-wc](https://github.com/open-wc/open-wc) recommendation.

## Installation
```bash
npm i @jinntec/jinn-toast
```

## Usage
```html
<script type="module">
  import 'jinn-toast/jinn-toast.js';
</script>

<jinn-toast text="first toast with defaults"></jinn-toast>
<jinn-toast text="second toast top left" position="left"></jinn-toast>
<jinn-toast text="third toast bottom left" position="left" gravity="bottom"></jinn-toast>
<jinn-toast text="fourth toast bottom left" position="right" gravity="bottom"></jinn-toast>
<jinn-toast text="warning" duration="5000" data-class="warning" position="right" gravity="bottom"></jinn-toast>
<jinn-toast text="error" duration="-1" data-class="error" close="true" position="left" gravity="bottom"></jinn-toast>

```

To display the toast by API:
```
document.getElementById('my-toast').showToast('hello');
```

Or by dispatching an 'jinn-toast' event to the respective toast element:
```
toast.dispatchEvent(
      new CustomEvent('jinn-toast', {
        composed: true,
        bubbles: true,
        detail: {
          text:'hello'
        },
      }),
    );
```

Per-toast options override the attributes of the element for one toast: `gravity`, `position`,
`className` (added to `data-class`), `duration` and `close`:
```
toast.showToast('hello', { gravity: 'top', position: 'center', className: 'banner', close: true });
```
The same works via the event, as `detail: { text: 'hello', options: { … } }`.

## Accessibility
- Every `jinn-toast` contains a visually hidden live region that exists before any toast is shown, and
  each toast's text is announced through it. It is `role="status"` / `aria-live="polite"` by default;
  use `politeness="assertive"` for urgent toasts such as errors (`role="alert"`).
- The close control is a focusable button (`role="button"`, `tabindex="0"`, Enter/Space), named by
  the `close-label` attribute (default `Close`, set it to localise).
- The toast itself is not a live region, so text is not announced twice.

Most of orginal options are just copied from toastify-js. See their docs for further options.

## Linting with ESLint, Prettier, and Types
To scan the project for linting errors, run
```bash
npm run lint
```

You can lint with ESLint and Prettier individually as well
```bash
npm run lint:eslint
```
```bash
npm run lint:prettier
```

To automatically fix many linting errors, run
```bash
npm run format
```

You can format using ESLint and Prettier individually as well
```bash
npm run format:eslint
```
```bash
npm run format:prettier
```

## Testing with Web Test Runner
To run the suite of Web Test Runner tests, run
```bash
npm run test
```

To run the tests in watch mode (for &lt;abbr title=&#34;test driven development&#34;&gt;TDD&lt;/abbr&gt;, for example), run

```bash
npm run test:watch
```


## Tooling configs

For most of the tools, the configuration is in the `package.json` to reduce the amount of files in your project.

If you customize the configuration a lot, you can consider moving them to individual files.

## Local Demo with `web-dev-server`
```bash
npm start
```
To run a local development server that serves the basic demo located in `demo/index.html`

#Releasing on npm

np --branch main --no-release-draft --no-tests --no-2fa

git status must be clean.
