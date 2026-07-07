import { useEffect, useRef } from 'react'

/** Pixels of scrolling that map to one full 360° turn of the figurine. */
const PIXELS_PER_ROTATION = 700
/** Cap the composite buffer height (source is 640px tall; keeps buffers lean). */
const MAX_CANVAS_HEIGHT = 720

/** Recombines the packed [colour | alpha-matte] video into a transparent frame. */
interface Compositor {
  draw: (w: number, h: number) => boolean
}

/**
 * Reads the packed frame back and shuffles the matte's luminance into the alpha
 * channel. A 2D canvas is used deliberately: a WebGL shader is faster but its
 * output composites unreliably over the page on iOS Safari (the transparent
 * colour plane leaked as a light veil that washed out the wordmark behind), so
 * we keep the straight-alpha 2D path the browser handles correctly everywhere.
 */
function create2DCompositor(canvas: HTMLCanvasElement, video: HTMLVideoElement): Compositor | null {
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  const off = document.createElement('canvas')
  const offctx = off.getContext('2d', { willReadFrequently: true })
  if (!offctx) return null
  return {
    draw(w, h) {
      if (off.width !== w * 2 || off.height !== h) {
        off.width = w * 2
        off.height = h
      }
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
      offctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, w * 2, h)
      const src = offctx.getImageData(0, 0, w * 2, h).data
      const out = ctx.createImageData(w, h)
      const o = out.data
      const stride = w * 2 * 4
      for (let y = 0; y < h; y++) {
        const row = y * stride
        for (let x = 0; x < w; x++) {
          const ci = row + x * 4
          const mi = row + (x + w) * 4 // matte pixel in the right half
          const di = (y * w + x) * 4
          o[di] = src[ci]
          o[di + 1] = src[ci + 1]
          o[di + 2] = src[ci + 2]
          o[di + 3] = src[mi] // matte luminance drives the alpha channel
        }
      }
      ctx.putImageData(out, 0, 0)
      return true
    },
  }
}

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const posterRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    // The clip packs colour on its left half and the alpha matte (grayscale) on
    // its right; a shader (or CPU fallback) recombines them so the figurine is
    // genuinely transparent and stands *in front* of the wordmark. Real alpha
    // video isn't portable (iOS can't play alpha WebM/HEVC), hence the matte trick.
    const compositor = create2DCompositor(canvas, video)
    if (!compositor) return

    // Scrubbed, not auto-played: scroll position drives the rotation.
    video.pause()

    let target = 0
    let pending = false
    let primed = false
    let painted = false
    let raf = 0

    const composite = () => {
      raf = 0
      const vw = video.videoWidth
      const vh = video.videoHeight
      if (!vw || !vh) return
      const scale = Math.min(1, MAX_CANVAS_HEIGHT / vh)
      const w = Math.round((vw / 2) * scale)
      const h = Math.round(vh * scale)
      if (!compositor.draw(w, h)) return
      if (!painted) {
        painted = true
        if (posterRef.current) posterRef.current.style.opacity = '0'
      }
    }

    // Coalesce redraws to one per frame — a fast scroll fires many seeks.
    const requestComposite = () => {
      if (!raf) raf = requestAnimationFrame(composite)
    }

    // iOS Safari (and some Android browsers) won't decode a frame of a muted,
    // never-played <video> just from setting currentTime. A muted play() then an
    // immediate pause() forces the decoder to render, after which scrub seeks —
    // and our reads of them — work.
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
      requestComposite()
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
      if (raf) cancelAnimationFrame(raf)
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
      {/* Transparent poster shown until the first video frame is composited, so the
          figurine is visible immediately without a flash of empty space. */}
      <img
        ref={posterRef}
        className="hero__figure hero__figure-poster"
        src="/assets/figurine-poster.png"
        alt=""
        aria-hidden="true"
      />
      {/* Figurine turntable. This <canvas> recombines the packed colour+alpha video
          (see effect above) into a truly transparent frame, so the figurine floats
          in front of the wordmark — the letters stay visible around it — and it
          renders identically on desktop and mobile. */}
      <canvas
        ref={canvasRef}
        className="hero__figure"
        role="img"
        aria-label="3D figurine of Jay Brown that rotates as you scroll"
      />
      {/* Hidden decode source: packed [colour | alpha matte] frames, encoded
          all-intra so every scroll seek lands on a keyframe (instant, no stutter).
          Kept in the DOM (not display:none) so it still decodes and seeks on iOS. */}
      <video
        ref={videoRef}
        className="hero__figure-src"
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        {/* Both sources are opaque containers with the alpha baked into the matte
            half, so there's no alpha-codec portability problem: VP9 WebM for
            Chrome/Firefox/Android, H.264 MP4 for Safari/iOS. */}
        <source src="/assets/figurine-packed.webm" type="video/webm" />
        <source src="/assets/figurine-packed.mp4" type="video/mp4" />
      </video>
    </header>
  )
}
