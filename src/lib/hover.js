import { useState } from 'react'
import { useMediaQuery } from './media'

// Наведён ли курсор на элемент (или на нём фокус с клавиатуры).
// На тач-экранах всегда false: там после тапа ховер «залипает».
// Возвращает [active, props] — props надо разложить на элемент: <a {...props}>
export function useHover() {
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const canHover = useMediaQuery('(hover: hover)')

  const props = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    onFocus: (event) => setFocused(event.currentTarget.matches(':focus-visible')),
    onBlur: () => setFocused(false),
  }

  return [(canHover && hovered) || focused, props]
}
