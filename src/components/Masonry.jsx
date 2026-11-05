import { useMemo } from 'react'
import { useProjects } from '../data/projectsContext'
import { SESSION_SEED } from '../lib/decor'
import { computeLayout } from '../lib/masonry'
import { GRID, useScale } from '../lib/scale'
import Card from './Card'
import DecorRow from './DecorRow'
import './Masonry.css'

// Pinterest-сетка. Считает, куда поставить каждую карточку и блок с иконками
// (см. lib/masonry.js), и ставит их туда абсолютным позиционированием.
export default function Masonry({ projects }) {
  const { cols, u, colWidth } = useScale()
  const { images, reportImage } = useProjects()

  const layout = useMemo(
    () =>
      computeLayout(
        projects.map((project) => images[project.image]?.ratio ?? null),
        cols,
        colWidth,
        SESSION_SEED,
      ),
    [projects, images, cols, colWidth],
  )

  const nothingPlaced = !layout.positions.some(Boolean)
  const left = (col) => (GRID.pad + col * (colWidth + GRID.gap)) * u
  const top = (y) => (GRID.top + y) * u

  return (
    <div className="masonry" style={{ height: layout.height * u }}>
      {nothingPlaced && <Skeleton cols={cols} u={u} />}

      {projects.map((project, i) => {
        const position = layout.positions[i]
        const style = position && { left: left(position.col), top: top(position.y) }
        return (
          <Card
            key={project.slug}
            project={project}
            image={images[project.image]}
            onImage={reportImage}
            style={style}
          />
        )
      })}

      {layout.decors.map((decor, i) => (
        <DecorRow
          key={i}
          icons={decor.set.slice(0, decor.size)}
          style={{ left: left(decor.col), top: top(decor.y), height: decor.height * u }}
        />
      ))}
    </div>
  )
}

// Серые плашки, пока не загрузилась ни одна карточка
const SKELETON = [464, 310, 372, 203, 520, 275, 310, 464]

function Skeleton({ cols, u }) {
  return (
    <div className="masonry__skeleton" aria-hidden="true">
      {Array.from({ length: cols }, (_, col) => (
        <div key={col} className="masonry__skeleton-col">
          {[0, 1, 2].map((row) => (
            <div
              key={row}
              className="masonry__skeleton-card"
              style={{ height: SKELETON[(col * 3 + row) % SKELETON.length] * u }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
