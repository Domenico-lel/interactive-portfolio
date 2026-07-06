import { useEffect, useRef } from 'react'

/** Pixels of scrolling that map to one full 360° turn of the figurine. */
const PIXELS_PER_ROTATION = 700

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Scrubbed, not auto-played: scroll position drives the rotation.
    video.pause()

    let target = 0
    let pending = false

    const seekToTarget = () => {
      if (video.readyState < 1 || !video.duration) return
      if (video.seeking) {
        pending = true
        return
      }
      video.currentTime = target
    }

    const onSeeked = () => {
      if (pending) {
        pending = false
        seekToTarget()
      }
    }

    const update = () => {
      const dur = video.duration
      if (!dur) return
      // Scroll down advances time (spins one way); scroll up rewinds it (spins
      // the other way). Wraps seamlessly because the clip is a 360° loop.
      const raw = (window.scrollY / PIXELS_PER_ROTATION) * dur
      target = ((raw % dur) + dur) % dur
      seekToTarget()
    }

    const onScroll = () => update()

    video.addEventListener('seeked', onSeeked)
    video.addEventListener('loadedmetadata', update)
    window.addEventListener('scroll', onScroll, { passive: true })
    // set the initial frame once data is ready
    if (video.readyState >= 1) update()

    return () => {
      video.removeEventListener('seeked', onSeeked)
      video.removeEventListener('loadedmetadata', update)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <header className="hero" id="top">
      <h1 className="wordmark hero__wordmark">
        <span>Product</span>
        <span>Designer</span>
      </h1>
      {/* Transparent (alpha) figurine turntable. Its frame is scrubbed by scroll
          position (see effect above) instead of auto-playing, so scrolling spins
          the figurine — down one way, up the other. */}
      <video
        ref={videoRef}
        className="hero__figure"
        poster="/assets/figurine-poster.png"
        muted
        playsInline
        preload="auto"
        aria-label="3D figurine of Jay Brown that rotates as you scroll"
      >
        <source src="/assets/figurine-animation.webm" type="video/webm" />
        <source src="/assets/figurine-animation.mp4" type="video/mp4" />
      </video>
    </header>
  )
}
