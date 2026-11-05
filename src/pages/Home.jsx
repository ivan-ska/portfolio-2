import Divider from '../components/Divider'
import Hero from '../components/hero/Hero'
import Masonry from '../components/Masonry'
import { useProjects } from '../data/projectsContext'
import './pages.css'

export default function Home() {
  return (
    <main>
      <Hero />
      <Divider />
      <Projects />
    </main>
  )
}

function Projects() {
  const { status, projects, error, reload } = useProjects()

  if (status === 'error') {
    return (
      <div className="message">
        <p>Не получилось загрузить проекты.</p>
        <p className="message__detail">{error.message}</p>
        <button type="button" className="text-button" onClick={reload}>
          Попробовать ещё раз
        </button>
      </div>
    )
  }

  if (status === 'ready' && projects.length === 0) {
    return (
      <div className="message">
        <p>В таблице пока нет проектов.</p>
      </div>
    )
  }

  return <Masonry projects={projects} />
}
