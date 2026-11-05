import { useState } from 'react'
import './icons.css'

// Облачко сообщения. typing = true — внутри по очереди мигают три точки.
export default function IconTelegram({ typing = false, className = '' }) {
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
      <path d="M2 2H52V26.22H13.16L2 35.68Z" />
      <g key={runs} className="icon-telegram__dots">
        <path className="icon-telegram__dot" d="M13 18H17" />
        <path className="icon-telegram__dot" d="M21 18H25" />
        <path className="icon-telegram__dot" d="M29 18H33" />
      </g>
    </svg>
  )
}
