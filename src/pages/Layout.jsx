import { useLayoutEffect } from 'react'
import { Outlet, ScrollRestoration } from 'react-router'
import ProjectsProvider from '../data/ProjectsProvider'
import { useScale } from '../lib/scale'

// Общая обёртка для всех страниц. Сюда позже добавятся шапка и подвал.
export default function Layout() {
  const { cols, u, colWidth, heroU } = useScale()

  // --u, --hero-u, --cols и --col-width доступны в CSS на любой странице
  useLayoutEffect(() => {
    const root = document.documentElement.style
    root.setProperty('--u', `${u}px`)
    root.setProperty('--hero-u', `${heroU}px`)
    root.setProperty('--cols', cols)
    root.setProperty('--col-width', `${colWidth * u}px`)
  }, [cols, u, colWidth, heroU])

  return (
    <ProjectsProvider>
      <Outlet />
      {/* Возвращает прокрутку на место при «назад» / «вперёд» */}
      <ScrollRestoration />
    </ProjectsProvider>
  )
}
