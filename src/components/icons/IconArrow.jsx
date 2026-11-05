import './icons.css'

// Стрелка ↖ (рядом с More)
export default function IconArrow({ className = '' }) {
  return (
    <svg className={`icon icon-arrow ${className}`} viewBox="0 0 32 32" aria-hidden="true">
      <path d="M27.4681 5H5V27.4681" />
      <path d="M5 5L29 29" />
    </svg>
  )
}
