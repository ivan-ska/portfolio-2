// Декоративные блоки с иконками между проектами.
// Иконки берутся из папки src/assets/decor-icons: любой .svg, положенный туда,
// сразу попадает в набор. Цвет в файле не важен — сайт перекрашивает иконки сам
// (белые детали остаются белыми).

const files = import.meta.glob('../assets/decor-icons/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
})

// Цвета иконок. В одном блоке цвета не повторяются.
export const DECOR_COLORS = ['#dcdf53', '#e46f86', '#7dafda', '#c2c3b2', '#4b9c88', '#dbca49']

// В блоке 4 или 5 иконок. Блок всегда шириной с колонку, поэтому из 4 иконок
// он выше, из 5 — ниже. Две высоты помогают выровнять колонки.
export const DECOR_SIZES = [4, 5]

// Промежуток между иконками — доля их высоты (в Figma 20 при высоте 151)
export const DECOR_GAP = 20 / 151

const WHITE = /^(#fff|#ffffff|white)$/i

// Каждая иконка: { name, ratio (ширина / высота), svg }
export const DECOR_ICONS = Object.keys(files)
  .sort()
  .map((path) => parseIcon(path, files[path]))
  .filter(Boolean)

function parseIcon(path, raw) {
  const viewBox = raw.match(/viewBox="([^"]+)"/)
  if (!viewBox) return null
  const [, , width, height] = viewBox[1].trim().split(/[\s,]+/).map(Number)
  if (!(width > 0 && height > 0)) return null

  const svg = raw
    .replace(/<\?xml[^>]*>/, '')
    // Белая подложка фрейма из Figma не нужна: при наклоне она закрыла бы соседей
    .replace(
      new RegExp(`<rect width="${width}" height="${height}" fill="(#fff|#ffffff|white)"\\s*/>`, 'i'),
      '',
    )
    // Размер задаёт сайт, а не файл
    .replace(/<svg\b[^>]*>/, (tag) => tag.replace(/\s(width|height)="[^"]*"/g, ''))
    // Все цвета, кроме белого, становятся цветом блока
    .replace(/\b(fill|stroke)="([^"]*)"/g, (match, attr, value) =>
      value === 'none' || WHITE.test(value) ? match : `${attr}="currentColor"`,
    )

  return { name: path.split('/').pop().replace(/\.svg$/, ''), ratio: width / height, svg }
}

// Генератор случайных чисел с «зерном»: при одном зерне выдаёт одну и ту же
// последовательность. Так раскладка не скачет при каждом пересчёте сетки,
// но при каждом заходе на сайт получается новой.
export function random(seed) {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const SESSION_SEED = Math.floor(Math.random() * 2 ** 32)

function shuffle(items, rand) {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

// Готовит count наборов по 5 иконок: [{ icon, color }].
// В наборе иконки и цвета не повторяются. Иконки берутся из перемешанной «колоды»,
// поэтому все встречаются примерно одинаково часто, а соседние наборы
// по возможности не делят иконки.
export function makeDecorSets(count, rand) {
  const size = Math.max(...DECOR_SIZES)
  const indices = DECOR_ICONS.map((_, i) => i)
  const deck = []
  const sets = []
  let previous = []

  for (let s = 0; s < count; s++) {
    const picked = []
    while (picked.length < size) {
      if (!deck.length) deck.push(...shuffle(indices, rand))
      let at = deck.findIndex((i) => !picked.includes(i) && !previous.includes(i))
      if (at === -1) at = deck.findIndex((i) => !picked.includes(i))
      if (at === -1) {
        deck.length = 0 // в колоде остались только уже взятые — тасуем заново
        continue
      }
      picked.push(deck.splice(at, 1)[0])
    }
    const colors = shuffle(DECOR_COLORS, rand)
    sets.push(picked.map((i, k) => ({ icon: DECOR_ICONS[i], color: colors[k] })))
    previous = picked
  }
  return sets
}

// Высота блока из size иконок набора set при ширине width (в единицах макета)
export function decorHeight(set, size, width) {
  const icons = set.slice(0, size)
  const row = icons.reduce((sum, { icon }) => sum + icon.ratio, 0) + DECOR_GAP * (size - 1)
  return width / row
}

// Хватает ли иконок, чтобы собрать блок без повторов
export const DECOR_ENABLED = DECOR_ICONS.length >= Math.max(...DECOR_SIZES)
