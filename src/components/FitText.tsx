import { useLayoutEffect, useRef, useState } from 'react'

type Props = {
  children: string
  /** Upper bound for the font size in px (won't grow past this on wide screens). */
  max?: number
  /** Lower bound for the font size in px. */
  min?: number
}

/**
 * Scales a single line of text so it exactly fills its container's width, so a
 * long string (e.g. an email wordmark) can't overflow the page and trigger
 * horizontal scroll. Fitting runs synchronously in useLayoutEffect (before
 * paint): it writes the font size imperatively and re-reads scrollWidth to force
 * a reflow, converging in a couple of iterations. No requestAnimationFrame, so
 * it also works while the tab is backgrounded. Refits on viewport resize and
 * once the web font's metrics are available.
 */
export default function FitText({ children, max = 260, min = 20 }: Props) {
  const boxRef = useRef<HTMLSpanElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const [fontSize, setFontSize] = useState(max)

  useLayoutEffect(() => {
    const box = boxRef.current
    const text = textRef.current
    if (!box || !text) return

    const fit = () => {
      let size = max
      text.style.fontSize = `${size}px`
      for (let i = 0; i < 12; i += 1) {
        const avail = box.clientWidth
        const width = text.scrollWidth // reading layout forces a reflow
        if (!avail || !width) break
        const target = Math.min(max, Math.max(min, (size * avail) / width))
        if (Math.abs(target - size) < 0.3) {
          size = target
          break
        }
        size = target
        text.style.fontSize = `${size}px`
      }
      setFontSize(size)
    }

    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(box)
    document.fonts?.ready.then(fit)

    return () => ro.disconnect()
  }, [children, max, min])

  return (
    <span ref={boxRef} style={{ display: 'block', width: '100%' }}>
      <span
        ref={textRef}
        style={{ display: 'inline-block', fontSize, lineHeight: 1, whiteSpace: 'nowrap' }}
      >
        {children}
      </span>
    </span>
  )
}
