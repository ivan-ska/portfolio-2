import IconClip from '../icons/IconClip'
import HeroLink from './HeroLink'

// Листок CV. При наведении загнутый уголок становится больше, скрепка наклоняется.
// Высота листка задаётся в Hero.css (на десктопе и мобиле она разная).
export default function CvSheet({ href }) {
  return (
    <HeroLink href={href} external className="cv-sheet">
      <span className="cv-sheet__paper" />
      <span className="cv-sheet__corner" />
      <span className="cv-sheet__label text-heading">
        <span className="text-trim">CV</span>
        <IconClip className="cv-sheet__clip" />
      </span>
    </HeroLink>
  )
}
