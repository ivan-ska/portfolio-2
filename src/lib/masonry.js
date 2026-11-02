import { GRID } from './scale'

// Сколько последних карточек можно переставить между собой,
// чтобы колонки закончились примерно на одной высоте.
const MAX_TAIL = 7

// Высота карточки в единицах макета. ratio = ширина / высота картинки.
function cardHeight(ratio, colWidth) {
  return colWidth / ratio + GRID.caption
}

// Ставит карточки по очереди, каждую в самую короткую колонку (при равенстве в левую).
function place(columns, heights, order, positions) {
  for (const i of order) {
    let col = 0
    for (let c = 1; c < columns.length; c++) {
      if (columns[c] < columns[col]) col = c
    }
    positions[i] = { col, y: columns[col] }
    columns[col] += heights[i] + GRID.rowGap
  }
}

function range(from, to) {
  return Array.from({ length: Math.max(0, to - from) }, (_, k) => from + k)
}

function* permutations(items) {
  if (items.length <= 1) {
    yield items
    return
  }
  for (let i = 0; i < items.length; i++) {
    const rest = [...items.slice(0, i), ...items.slice(i + 1)]
    for (const perm of permutations(rest)) yield [items[i], ...perm]
  }
}

// ratios — пропорции превью в порядке строк таблицы (null, если картинка ещё грузится).
// colWidth — ширина колонки в единицах макета (см. scaleFor в scale.js).
// Возвращает позицию каждой карточки ({ col, y } или null, если её пока рано показывать)
// и общую высоту сетки. Всё в единицах макета.
//
// 1. Карточки идут по порядку таблицы, каждая в самую короткую колонку.
// 2. Последние несколько карточек перебираются во всех порядках, и выбирается тот,
//    где колонки заканчиваются ровнее всего. Верх сетки при этом не меняется.
// 3. Пока картинки грузятся, показываются только карточки, чьё место уже точно известно.
export function computeLayout(ratios, cols, colWidth) {
  const count = ratios.length
  const heights = ratios.map((ratio) => (ratio ? cardHeight(ratio, colWidth) : 0))
  const firstUnknown = ratios.findIndex((ratio) => !ratio)
  const allKnown = firstUnknown === -1

  const tailSize = Math.min(MAX_TAIL, Math.max(0, count - cols))
  const fixedCount = count - tailSize
  const readyCount = allKnown ? fixedCount : Math.min(firstUnknown, fixedCount)

  const positions = new Array(count).fill(null)
  let columns = new Array(cols).fill(0)
  place(columns, heights, range(0, readyCount), positions)

  if (allKnown && tailSize > 0) {
    let best = null
    for (const order of permutations(range(fixedCount, count))) {
      const tryColumns = [...columns]
      const tryPositions = []
      place(tryColumns, heights, order, tryPositions)
      const spread = Math.max(...tryColumns) - Math.min(...tryColumns)
      // Первым проверяется исходный порядок; меняем его, только если стало заметно ровнее
      if (!best || spread < best.spread - 1) {
        best = { spread, columns: tryColumns, positions: tryPositions }
      }
    }
    for (const i of range(fixedCount, count)) positions[i] = best.positions[i]
    columns = best.columns
  }

  const anyPlaced = positions.some(Boolean)
  const contentHeight = anyPlaced ? Math.max(...columns) - GRID.rowGap : 0

  return { positions, height: GRID.top + contentHeight + GRID.bottom }
}
