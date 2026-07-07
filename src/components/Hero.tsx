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
    let primed = false

    // iOS Safari (and some Android browsers) won't paint a frame of a muted,
    // never-played <video> just from setting currentTime — the poster clears and
    // nothing renders. Kicking off a muted play() and immediately pausing forces
    // the decoder to render the first frame, after which scrub seeks paint.
    const prime = () => {
      if (primed) return
      primed = true
      const p = video.play()
      if (p && typeof p.then === 'function') {
        p.then(() => {
          video.pause()
          seekToTarget()
        }).catch(() => {
          // Autoplay priming blocked — a user gesture (scroll/touch) will retry.
          primed = false
        })
      } else {
        video.pause()
        seekToTarget()
      }
    }

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

    const onScroll = () => {
      prime()
      update()
    }

    // Retry priming on the first real user gesture in case autoplay was blocked.
    const onGesture = () => prime()

    const onLoadedMeta = () => {
      prime()
      update()
    }

    video.addEventListener('seeked', onSeeked)
    video.addEventListener('loadedmetadata', onLoadedMeta)
    // canplay fires once the frame data is actually decodable — a more reliable
    // point to prime than loadedmetadata on mobile.
    video.addEventListener('canplay', prime)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('touchstart', onGesture, { passive: true })
    // set the initial frame once data is ready
    if (video.readyState >= 2) {
      prime()
      update()
    }

    return () => {
      video.removeEventListener('seeked', onSeeked)
      video.removeEventListener('loadedmetadata', onLoadedMeta)
      video.removeEventListener('canplay', prime)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('touchstart', onGesture)
    }
  }, [])

  return (
    <header className="hero" id="top">
      <h1 className="wordmark hero__wordmark">
        <span>Product</span>
        <span>Designer</span>
      </h1>
      {/* Figurine turntable. Its frame is scrubbed by scroll position (see effect
          above) instead of auto-playing, so scrolling spins the figurine — down one
          way, up the other. The clip has an opaque --bg background and is made to
          read as transparent via mix-blend-mode: darken (see .hero__figure); we use
          a plain H.264 MP4 that every browser can decode, since alpha video isn't
          portable (notably iOS Safari can't play alpha WebM). */}
      <video
        ref={videoRef}
        className="hero__figure"
        poster="/assets/figurine-poster.png"
        muted
        playsInline
        preload="auto"
        aria-label="3D figurine of Jay Brown that rotates as you scroll"
      >
        <source src="/assets/figurine-animation.mp4" type="video/mp4" />
      </video>
    </header>
  )
}
