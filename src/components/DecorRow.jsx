import './DecorRow.css'

// Наклон по клику: на случайный угол 7–15° и сразу обратно. Плавность как у иконок в хиро.
// Сторона чередуется с каждым нажатием (на любую иконку): вправо, влево, вправо…
const TILT_MIN = 7
const TILT_MAX = 15
const TILT_OUT = 200 // мс на наклон
const TILT_BACK = 350 // мс на возврат
const EASE = 'cubic-bezier(0.33, 1, 0.68, 1)' // как --hero-ease

let clicks = 0

function tilt(element) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  // Если иконка ещё качается от прошлого клика, новый наклон начинается с того места, где она сейчас
  const { a, b } = new DOMMatrix(getComputedStyle(element).transform)
  const from = (Math.atan2(b, a) * 180) / Math.PI
  element.getAnimations().forEach((animation) => animation.cancel())

  const side = clicks++ % 2 === 0 ? 1 : -1 // 1 — по часовой, вправо
  const angle = side * (TILT_MIN + Math.random() * (TILT_MAX - TILT_MIN))
  element.animate(
    [
      { transform: `rotate(${from}deg)`, easing: EASE },
      { transform: `rotate(${angle}deg)`, offset: TILT_OUT / (TILT_OUT + TILT_BACK), easing: EASE },
      { transform: 'rotate(0deg)' },
    ],
    { duration: TILT_OUT + TILT_BACK },
  )
}

// Блок из 4–5 цветных иконок шириной в колонку. Только для красоты:
// скринридеры его пропускают. icons — [{ icon, color }], см. src/lib/decor.js
export default function DecorRow({ icons, style }) {
  return (
    <div className="decor-row" style={style} aria-hidden="true">
      {icons.map(({ icon, color }) => (
        <span
          key={icon.name}
          className="decor-row__icon"
          style={{ aspectRatio: icon.ratio, color }}
          onClick={(event) => tilt(event.currentTarget)}
          // Вектор из своих же файлов в src/assets/decor-icons
          dangerouslySetInnerHTML={{ __html: icon.svg }}
        />
      ))}
    </div>
  )
}
