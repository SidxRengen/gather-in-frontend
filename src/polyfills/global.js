// Polyfill for libraries expecting Node's `global` in the browser
if (typeof global === "undefined") {
  // eslint-disable-next-line no-restricted-globals
  window.global = window;
}
