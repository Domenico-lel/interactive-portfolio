import { useEffect, useState } from 'react'

/** Poster/still images that must be decoded before the page is shown. */
const IMAGE_ASSETS = [
  '/assets/figurine-poster.png',
  '/assets/fantacalcio-poster.jpg',
  '/assets/prompt-builder-poster.jpg',
]

/**
 * Videos that must be buffered enough to play before the page is shown. The
 * hero figurine is listed as its ordered source candidates so the browser
 * downloads the same file the <video> in Hero will use (WebM where supported,
 * MP4 otherwise) — the fetch is shared from cache, not duplicated.
 */
const VIDEO_ASSETS: string[][] = [
  ['/assets/figurine-packed.webm', '/assets/figurine-packed.mp4'],
  ['/assets/fantacalcio-demo.mp4'],
  ['/assets/prompt-builder-demo.mp4'],
]

/**
 * Hard ceiling on how long the loader may hold the page back. A flaky or slow
 * connection should never leave a visitor staring at the spinner forever, so we
 * reveal the page regardless once this elapses.
 */
const MAX_WAIT_MS = 9000

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => resolve() // never block reveal on a single failed asset
    img.src = src
  })
}

function preloadVideo(sources: string[]): Promise<void> {
  return new Promise((resolve) => {
    const video = document.createElement('video')
    video.muted = true
    video.preload = 'auto'
    // Enough buffered data to begin playback — we don't need the whole file, just
    // enough that the hero's first scrub/frame paints without a frozen gap.
    const done = () => {
      cleanup()
      resolve()
    }
    const cleanup = () => {
      video.removeEventListener('canplaythrough', done)
      video.removeEventListener('canplay', done)
      video.removeEventListener('error', done)
      video.removeAttribute('src')
      while (video.firstChild) video.removeChild(video.firstChild)
    }
    video.addEventListener('canplaythrough', done)
    video.addEventListener('canplay', done)
    video.addEventListener('error', done)
    for (const src of sources) {
      const el = document.createElement('source')
      el.src = src
      video.appendChild(el)
    }
    video.load()
  })
}

/**
 * Resolves to `true` once the web fonts and every hero/showcase asset are ready,
 * so the page can be revealed as a finished whole rather than assembling itself
 * (and playing a frozen-looking hero video) in front of the visitor.
 */
export function usePageReady(): boolean {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    const fontsReady = document.fonts?.ready ?? Promise.resolve()
    const assets = Promise.all([
      fontsReady,
      ...IMAGE_ASSETS.map(preloadImage),
      ...VIDEO_ASSETS.map(preloadVideo),
    ])

    const safety = new Promise<void>((resolve) => {
      setTimeout(resolve, MAX_WAIT_MS)
    })

    Promise.race([assets, safety]).then(() => {
      if (!cancelled) setReady(true)
    })

    return () => {
      cancelled = true
    }
  }, [])

  return ready
}
