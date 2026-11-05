import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useMediaQuery } from '../lib/media'
import './CardTitle.css'

const SPEED = 70 // скорость бегущей строки, px в секунду при ширине 1440
const RETURN_TIME = 300 // за сколько мс текст возвращается на место, когда курсор ушёл

function currentX(element) {
  return new DOMMatrixReadOnly(getComputedStyle(element).transform).m41
}

function reducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Название в одну строку. Если не помещается, конец растворяется и текст едет
// как бегущая строка: с мышью — при наведении на карточку (active),
// на тач-экранах — всегда, пока название видно на экране.
export default function CardTitle({ text, active }) {
  const boxRef = useRef(null)
  const trackRef = useRef(null)
  const textRef = useRef(null)
  const [overflowing, setOverflowing] = useState(false)
  const [textWidth, setTextWidth] = useState(0)
  const [inView, setInView] = useState(false)
  const canHover = useMediaQuery('(hover: hover)')

  // Проверяем, влезает ли текст. Повторяем при изменении ширины и после загрузки шрифта.
  useLayoutEffect(() => {
    const box = boxRef.current
    // Точные дробные ширины: даже «чуть-чуть не влезает» считается как не влезает
    const measure = () => {
      const width = textRef.current.getBoundingClientRect().width
      setTextWidth(width)
      setOverflowing(width > box.getBoundingClientRect().width + 0.01)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(box)
    document.fonts?.ready.then(measure)
    return () => observer.disconnect()
  }, [text])

  // Тач-экран: следим, видно ли название, чтобы не гонять анимацию за экраном
  useEffect(() => {
    if (canHover || !overflowing) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting))
    observer.observe(boxRef.current)
    return () => observer.disconnect()
  }, [canHover, overflowing])

  const running = overflowing && (canHover ? active : inView)

  useEffect(() => {
    if (!running || reducedMotion()) return

    const box = boxRef.current
    const track = trackRef.current
    const u = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--u')) || 1
    // Текст повторяется дважды; сдвиг на «текст + промежуток» даёт бесшовный круг
    const distance = textWidth + parseFloat(getComputedStyle(track).columnGap)

    const loop = track.animate(
      [{ transform: 'translateX(0)' }, { transform: `translateX(${-distance}px)` }],
      { duration: (distance / (SPEED * u)) * 1000, iterations: Infinity },
    )
    box.classList.add('is-running')

    return () => {
      const x = currentX(track)
      loop.cancel()
      box.classList.remove('is-running')
      track.animate([{ transform: `translateX(${x}px)` }, { transform: 'translateX(0)' }], {
        duration: RETURN_TIME,
        easing: 'ease-out',
      })
    }
  }, [running, textWidth])

  return (
    <div ref={boxRef} className={`card-title text-title${overflowing ? ' is-overflowing' : ''}`}>
      <div ref={trackRef} className="card-title__track">
        <span ref={textRef}>{text}</span>
        {overflowing && <span aria-hidden="true">{text}</span>}
      </div>
    </div>
  )
}
