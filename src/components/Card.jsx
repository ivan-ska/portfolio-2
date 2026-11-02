import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import CardTitle from './CardTitle'
import Tag from './Tag'
import './Card.css'

const FALLBACK_RATIO = 3 / 2 // если превью не загрузилось
const IMAGE_TIMEOUT = 8000 // сколько мс ждать картинку, прежде чем поставить карточку без неё

// image — что уже известно о превью: { ratio, failed } или undefined, пока грузится.
// onImage — сообщает сетке пропорции превью, чтобы она расставила карточки.
// style — координаты от сетки; без них карточка спрятана и только грузит картинку.
export default function Card({ project, image, onImage, style }) {
  const [hovered, setHovered] = useState(false)
  const { image: src } = project
  const known = Boolean(image)

  useEffect(() => {
    if (!src) {
      onImage(src, { ratio: FALLBACK_RATIO, failed: true })
      return
    }
    if (known) return
    const timer = setTimeout(() => onImage(src, { ratio: FALLBACK_RATIO, failed: false }), IMAGE_TIMEOUT)
    return () => clearTimeout(timer)
  }, [src, known, onImage])

  const handleLoad = (event) => {
    const { naturalWidth, naturalHeight } = event.currentTarget
    onImage(src, { ratio: naturalWidth / naturalHeight, failed: false })
  }

  const classes = ['card']
  if (!style) classes.push('is-pending')
  if (image?.failed) classes.push('is-broken')

  return (
    <Link
      to={`/projects/${project.slug}`}
      className={classes.join(' ')}
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <div className="card__cover" style={{ aspectRatio: image?.ratio ?? FALLBACK_RATIO }}>
        {src && (
          <img
            src={src}
            alt=""
            draggable="false"
            onLoad={handleLoad}
            onError={() => onImage(src, { ratio: FALLBACK_RATIO, failed: true })}
          />
        )}
      </div>

      <div className="card__caption">
        <CardTitle text={project.title} active={hovered} />
        {project.tags.length > 0 && (
          <div className="card__tags">
            {project.tags.map((tag, i) => (
              <Tag key={`${tag}-${i}`} name={tag} />
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
