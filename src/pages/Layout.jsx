import { useLayoutEffect } from 'react'
import { Outlet, ScrollRestoration } from 'react-router'
import ProjectsProvider from '../data/ProjectsProvider'
import { useScale } from '../lib/scale'

// Общая обёртка для всех страниц. Сюда позже добавятся шапка и подвал.
export default function Layout() {
  const { cols, u } = useScale()

  // --u и --cols доступны в CSS на любой странице
  useLayoutEffect(() => {
    const root = document.documentElement.style
    root.setProperty('--u', `${u}px`)
    root.setProperty('--cols', cols)
  }, [cols, u])

  return (
    <ProjectsProvider>
      <Outlet />
      {/* Возвращает прокрутку на место при «назад» / «вперёд» */}
      <ScrollRestoration />
    </ProjectsProvider>
  )
}
