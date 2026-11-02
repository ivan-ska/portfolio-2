import { createContext, useContext } from 'react'

export const ProjectsContext = createContext(null)

// Данные из таблицы, доступные на любой странице:
// status: 'loading' | 'ready' | 'error'
// images: { [ссылка на картинку]: { ratio, failed } } — пропорции уже загруженных превью
export function useProjects() {
  return useContext(ProjectsContext)
}
