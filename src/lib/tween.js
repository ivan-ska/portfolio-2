import { useEffect, useRef, useState } from 'react'

// Быстрый старт и плавное замедление в конце, как --hero-ease в CSS
export const easeOut = (t) => 1 - (1 - t) ** 3

// Плавно ведёт число от 0 к 1 (on = true) или обратно (on = false).
// Нужен там, где CSS-переход не справляется, например когда меняется форма вектора.
// Если отпустить посередине, разворачивается с того места, где было.
export function useTween(on, duration = 350, easing = easeOut) {
  const [value, setValue] = useState(on ? 1 : 0)
  const valueRef = useRef(value)

  useEffect(() => {
    const from = valueRef.current
    const to = on ? 1 : 0
    if (from === to) return

    const set = (v) => {
      valueRef.current = v
      setValue(v)
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      set(to)
      return
    }

    // Чем меньше осталось пройти, тем короче анимация
    const time = duration * Math.abs(to - from)
    let start = null
    let frame = requestAnimationFrame(function step(now) {
      start ??= now
      const t = Math.min(1, (now - start) / time)
      set(from + (to - from) * easing(t))
      if (t < 1) frame = requestAnimationFrame(step)
    })
    return () => cancelAnimationFrame(frame)
  }, [on, duration, easing])

  return value
}
