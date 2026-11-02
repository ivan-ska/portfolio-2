import { useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import Tag from '../components/Tag'
import { useProjects } from '../data/projectsContext'
import NotFound from './NotFound'
import './pages.css'

const SITE_TITLE = document.title

// ВРЕМЕННАЯ страница проекта: проверяем, что адрес меняется и «назад» работает.
// Настоящий дизайн появится позже.
export default function ProjectPage() {
  const { slug } = useParams()
  const { status, projects } = useProjects()
  const navigate = useNavigate()
  const location = useLocation()
  const project = projects.find((item) => item.slug === slug)

  useEffect(() => {
    if (!project) return
    document.title = `${project.title} — ${SITE_TITLE}`
    return () => {
      document.title = SITE_TITLE
    }
  }, [project])

  if (status === 'loading') return null
  if (!project) return <NotFound />

  // Если пришли с главной, возвращаемся по истории (прокрутка восстановится).
  // Если открыли ссылку на проект напрямую, просто идём на главную.
  const goBack = () => (location.key !== 'default' ? navigate(-1) : navigate('/'))

  return (
    <main className="project">
      <button type="button" className="text-button" onClick={goBack}>
        ← Все проекты
      </button>

      <h1 className="project__title">{project.title}</h1>

      <div className="project__meta">
        {project.tags.map((tag, i) => (
          <Tag key={`${tag}-${i}`} name={tag} />
        ))}
        {project.year && <span className="project__year">{project.year}</span>}
      </div>

      {project.image && <img className="project__cover" src={project.image} alt="" />}

      <p className="project__note">Страница проекта в разработке.</p>
    </main>
  )
}
