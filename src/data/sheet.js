import Papa from 'papaparse'
import { SHEET_CSV_URL } from '../config'

// Скачивает таблицу и превращает строки в список проектов:
// { title, slug, image, year, tags }
export async function fetchProjects() {
  const response = await fetch(SHEET_CSV_URL, { cache: 'no-store' })
  if (!response.ok) throw new Error(`Таблица не ответила (${response.status})`)

  const { data } = Papa.parse(await response.text(), {
    header: true,
    skipEmptyLines: 'greedy',
    // Колонки ищутся по названию без учёта регистра и пробелов по краям
    transformHeader: (header) => header.trim().toLowerCase(),
  })

  const usedSlugs = new Set()

  return data
    .map((row) => {
      const title = cell(row, 'name')
      if (!title) return null

      return {
        title,
        slug: uniqueSlug(title, usedSlugs),
        image: directImageUrl(cell(row, 'thumbnail link')),
        year: cell(row, 'year'),
        tags: tagColumns(row)
          .map((column) => cell(row, column))
          .filter(Boolean),
      }
    })
    .filter(Boolean)
}

function cell(row, column) {
  return (row[column] ?? '').trim()
}

// Field 1, Field 2, Field 3 … в порядке номеров
function tagColumns(row) {
  return Object.keys(row)
    .filter((column) => /^field\s*\d+$/.test(column))
    .sort((a, b) => parseInt(a.match(/\d+/)) - parseInt(b.match(/\d+/)))
}

// Ссылку «Поделиться» из Dropbox превращаем в прямую ссылку на картинку
export function directImageUrl(link) {
  if (!link) return ''
  try {
    const url = new URL(link)
    if (url.hostname.endsWith('dropbox.com')) {
      url.searchParams.delete('dl')
      url.searchParams.set('raw', '1')
    }
    return url.toString()
  } catch {
    return link
  }
}

// «+Plus app interface» → «plus-app-interface»
function uniqueSlug(title, used) {
  const base =
    title
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9а-яё]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'project'

  let slug = base
  for (let n = 2; used.has(slug); n++) slug = `${base}-${n}`
  used.add(slug)
  return slug
}
