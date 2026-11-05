import { useTween } from '../../lib/tween'
import './icons.css'

// Клапан конверта: закрытый смотрит вниз, открытый откинут вверх над конвертом
const CLOSED = { tip: 21.6, corner: 3.6, edge: 3.6 }
const OPEN = { tip: -17, corner: 2, edge: 0.45 }

const mix = (a, b, t) => a + (b - a) * t

// Конверт. open = true — клапан откидывается вверх, как будто конверт открыли.
export default function IconMail({ open = false, className = '' }) {
  // Та же длительность и плавность, что у наклона, чтобы двигались вместе
  const progress = useTween(open, 350)

  // Клапан поворачивается вокруг верхнего края (y = 2)
  const tip = mix(CLOSED.tip, OPEN.tip, progress)
  const left = mix(CLOSED.corner, OPEN.corner, progress)
  const right = 54 - left
  const edge = mix(CLOSED.edge, OPEN.edge, progress)

  return (
    <svg className={`icon icon-mail ${className}`} viewBox="0 0 54 36" aria-hidden="true">
      <path d="M2 2H52V34H2V2Z" />
      {/* Внутренняя сторона клапана: видна, когда конверт открыт */}
      <path className="icon__fill" d="M27 21.6L3.6 3.6V2H50.4V3.6L27 21.6Z" />
      {/* Нижний треугольник */}
      <path className="icon__fill" d="M27 15L4 32.45V34H50V32.45L27 15Z" />
      {/* Клапан */}
      <path
        className="icon__fill"
        d={`M27 ${tip}L${left} ${edge}V2H${right}V${edge}L27 ${tip}Z`}
      />
    </svg>
  )
}
