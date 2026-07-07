/**
 * Full-screen loading veil shown while fonts and media buffer. It sits above the
 * page and fades itself out once `done` flips, so the site is only revealed as a
 * finished whole. The spinner borrows the site's monochrome, uppercase Archivo
 * look so the wait feels like part of the design, not a browser default.
 */
export default function Loader({ done }: { done: boolean }) {
  return (
    <div
      className={`loader${done ? ' loader--hidden' : ''}`}
      role="status"
      aria-live="polite"
      aria-hidden={done}
    >
      <div className="loader__spinner" aria-hidden="true" />
      <span className="loader__label wordmark">Loading</span>
    </div>
  )
}
