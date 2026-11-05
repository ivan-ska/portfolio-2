import { useId, useState } from 'react'
import './icons.css'

const BUBBLE =
  'M16 0H38.8886C47.2344 0 54 6.76559 54 15.1114C54 23.4571 47.2344 30.2227 38.8886 30.2227H13.8961L0 42V16C0 7.16344 7.16344 0 16 0Z'

// Облачко сообщения. typing = true — внутри по очереди мигают три точки.
export default function IconTelegram({ typing = false, className = '' }) {
  const maskId = useId()

  // Каждый новый ховер начинает точки с начала: новый key пересоздаёт их
  const [runs, setRuns] = useState(0)
  const [wasTyping, setWasTyping] = useState(typing)
  if (typing !== wasTyping) {
    setWasTyping(typing)
    if (typing) setRuns(runs + 1)
  }

  return (
    <svg
      className={`icon icon-telegram${typing ? ' is-typing' : ''} ${className}`}
      viewBox="0 0 54 36"
      aria-hidden="true"
    >
      {/* Обводка внутрь контура, как в Figma: линия толщиной 8, обрезанная по форме */}
      <mask id={maskId}>
        <path d={BUBBLE} fill="#fff" stroke="none" />
      </mask>
      <path className="icon-telegram__bubble" d={BUBBLE} mask={`url(#${maskId})`} />
      <g key={runs} className="icon-telegram__dots">
        <path className="icon-telegram__dot" d="M13 20.16H17" />
        <path className="icon-telegram__dot" d="M21 20.16H25" />
        <path className="icon-telegram__dot" d="M29 20.16H33" />
      </g>
    </svg>
  )
}
