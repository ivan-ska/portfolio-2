import './icons.css'

// Стрелка ↖ (рядом с More)
export default function IconArrow({ className = '' }) {
  return (
    <svg className={`icon icon-arrow ${className}`} viewBox="0 0 32 32" aria-hidden="true">
      <path d="M28.2128 2H2V28.2128" />
      <path d="M2 2L30 30" />
    </svg>
  )
}
