import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchProjects } from './sheet'
import { ProjectsContext } from './projectsContext'

const LOADING = { status: 'loading', projects: [], error: null }

function loadInto(setState) {
  fetchProjects()
    .then((projects) => setState({ status: 'ready', projects, error: null }))
    .catch((error) => setState({ status: 'error', projects: [], error }))
}

// Таблица скачивается один раз при открытии сайта и дальше хранится здесь.
// Поэтому при переходах между страницами и кнопке «назад» ничего не грузится заново.
export default function ProjectsProvider({ children }) {
  const [state, setState] = useState(LOADING)
  const [images, setImages] = useState({})

  useEffect(() => loadInto(setState), [])

  const reload = useCallback(() => {
    setState(LOADING)
    loadInto(setState)
  }, [])

  const reportImage = useCallback((src, info) => {
    setImages((prev) => {
      const old = prev[src]
      if (old && old.ratio === info.ratio && old.failed === info.failed) return prev
      return { ...prev, [src]: info }
    })
  }, [])

  const value = useMemo(
    () => ({ ...state, images, reportImage, reload }),
    [state, images, reportImage, reload],
  )

  return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>
}
