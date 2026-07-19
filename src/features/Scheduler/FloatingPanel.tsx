import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface FloatingPanelProps {
  x: number
  y: number
  onClose: () => void
  children: ReactNode
}

/** Portals a popup to document.body, clamped inside the viewport, and closes on outside click / Escape. */
export function FloatingPanel({ x, y, onClose, children }: FloatingPanelProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState<{ top: number; left: number; visibility: 'hidden' | 'visible' }>({
    top: y,
    left: x,
    visibility: 'hidden',
  })

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const margin = 8
    const left = Math.min(Math.max(margin, x), window.innerWidth - rect.width - margin)
    const top = Math.min(Math.max(margin, y), window.innerHeight - rect.height - margin)
    setStyle({ top, left, visibility: 'visible' })
  }, [x, y])

  useEffect(() => {
    function handlePointerDown(e: MouseEvent) {
      const target = e.target as Node
      if (ref.current && ref.current.contains(target)) return
      // DateField 등 내부 필드가 여는 캘린더/드롭다운도 document.body에 별도로 포탈되므로
      // ref 안에 없더라도 그 포탈 안의 클릭이면 바깥 클릭으로 취급하지 않는다.
      if (target instanceof Element && target.closest('[data-popover-portal]')) return
      onClose()
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return createPortal(
    <div ref={ref} style={{ position: 'fixed', top: style.top, left: style.left, visibility: style.visibility }} className="z-[80]">
      {children}
    </div>,
    document.body,
  )
}
