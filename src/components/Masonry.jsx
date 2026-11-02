import { useMemo } from 'react'
import { useProjects } from '../data/projectsContext'
import { computeLayout } from '../lib/masonry'
import { GRID, useScale } from '../lib/scale'
import Card from './Card'
import './Masonry.css'

// Pinterest-сетка. Считает, куда поставить каждую карточку (см. lib/masonry.js),
// и ставит её туда абсолютным позиционированием.
export default function Masonry({ projects }) {
  const { cols, u } = useScale()
  const { images, reportImage } = useProjects()

  const layout = useMemo(
    () => computeLayout(projects.map((project) => images[project.image]?.ratio ?? null), cols),
    [projects, images, cols],
  )

  const nothingPlaced = !layout.positions.some(Boolean)

  return (
    <div className="masonry" style={{ height: layout.height * u }}>
      {nothingPlaced && <Skeleton cols={cols} u={u} />}

      {projects.map((project, i) => {
        const position = layout.positions[i]
        const style = position && {
          left: (GRID.pad + position.col * (GRID.colWidth + GRID.gap)) * u,
          top: (GRID.top + position.y) * u,
        }
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
