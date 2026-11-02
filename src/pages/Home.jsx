import Masonry from '../components/Masonry'
import { useProjects } from '../data/projectsContext'
import './pages.css'

export default function Home() {
  const { status, projects, error, reload } = useProjects()

  if (status === 'error') {
    return (
      <main className="message">
        <p>Не получилось загрузить проекты.</p>
        <p className="message__detail">{error.message}</p>
        <button type="button" className="text-button" onClick={reload}>
          Попробовать ещё раз
        </button>
      </main>
    )
  }

  if (status === 'ready' && projects.length === 0) {
    return (
      <main className="message">
        <p>В таблице пока нет проектов.</p>
      </main>
    )
  }

  return (
    <main>
      <Masonry projects={projects} />
    </main>
  )
}
