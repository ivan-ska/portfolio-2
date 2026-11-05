import { DECOR_ENABLED, DECOR_SIZES, decorHeight, makeDecorSets, random } from './decor'
import { GRID } from './scale'

// Сколько последних карточек можно переставить между собой,
// чтобы колонки закончились примерно на одной высоте.
const MAX_TAIL = 7

// Блоки с иконками в соседних колонках не должны стоять рядом:
// между ними по вертикали минимум столько (в единицах макета)
const DECOR_SPACING = 160

// За нарушение правила выше раскладка получает такой штраф
const CLASH_PENALTY = 10000

// Высота карточки в единицах макета. ratio = ширина / высота картинки.
function cardHeight(ratio, colWidth) {
  return colWidth / ratio + GRID.caption
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

// ---------- План блоков с иконками ----------

// Решает заранее (случайно, но одинаково при каждом пересчёте):
// после какой по счёту карточки в каждой колонке встанет её первый блок
// и из скольких он иконок. Соседние колонки получают разные номера,
// чтобы блоки не выстраивались в ряд.
function makePlan(count, cols, colWidth, seed) {
  if (!DECOR_ENABLED || count === 0) return null
  const rand = random(seed + cols * 7919)
  const perColumn = count / cols
  const last = Math.max(1, Math.round(perColumn) - 1) // чтобы под блоком ещё были карточки

  const after = []
  for (let col = 0; col < cols; col++) {
    let pick = 1 + Math.floor(rand() * last)
    for (let tries = 0; tries < 5 && last > 1 && pick === after[col - 1]; tries++) {
      pick = 1 + Math.floor(rand() * last)
    }
    after.push(pick)
  }
  const sizes = after.map(() => DECOR_SIZES[Math.floor(rand() * DECOR_SIZES.length)])

  // Наборы иконок: первые cols — для блоков внутри колонок (по порядку появления),
  // следующие cols — для блоков в конце колонок (по номеру колонки)
  const sets = makeDecorSets(cols * 2, rand)
  return { after, sizes, sets, colWidth }
}

// ---------- Раскладка ----------

// Состояние сетки: где заканчивается каждая колонка, сколько в ней карточек,
// какие блоки с иконками уже стоят и чем кончается колонка
function emptyState(cols) {
  return {
    ends: new Array(cols).fill(0),
    cards: new Array(cols).fill(0),
    decors: [],
    endsWithDecor: new Array(cols).fill(false),
  }
}

function copyState(state) {
  return {
    ends: [...state.ends],
    cards: [...state.cards],
    decors: [...state.decors],
    endsWithDecor: [...state.endsWithDecor],
  }
}

// Будет ли блок в колонке col на высоте y слишком близко к блокам в соседних колонках
function clashes(decors, col, y, height) {
  return decors.some(
    (d) =>
      Math.abs(d.col - col) === 1 &&
      y < d.y + d.height + DECOR_SPACING &&
      d.y < y + height + DECOR_SPACING,
  )
}

function decorsIn(state, col) {
  return state.decors.filter((d) => d.col === col).length
}

function addDecor(state, col, set, size, height) {
  state.decors.push({ col, y: state.ends[col], height, size, set })
  state.ends[col] += height + GRID.rowGap
  state.endsWithDecor[col] = true
}

// Ставит карточки по очереди, каждую в самую короткую колонку (при равенстве в левую).
// Если в колонке набралось нужное по плану число карточек, под последней встаёт блок
// с иконками. Если рядом в соседней колонке уже есть блок, ждём следующую карточку.
function place(state, heights, order, positions, plan) {
  for (const i of order) {
    const { ends } = state
    let col = 0
    for (let c = 1; c < ends.length; c++) {
      if (ends[c] < ends[col]) col = c
    }
    positions[i] = { col, y: ends[col] }
    ends[col] += heights[i] + GRID.rowGap
    state.cards[col] += 1
    state.endsWithDecor[col] = false

    if (plan && state.cards[col] >= plan.after[col] && decorsIn(state, col) === 0) {
      const set = plan.sets[state.decors.length]
      const size = plan.sizes[col]
      const height = decorHeight(set, size, plan.colWidth)
      if (!clashes(state.decors, col, ends[col], height)) addDecor(state, col, set, size, height)
    }
  }
}

// Варианты для конца колонки: без блока или блок из 4 / 5 иконок.
// В колонке должен быть хотя бы 1 блок и не больше 2, и два блока не встают подряд.
function endOptions(state, col, plan) {
  const count = decorsIn(state, col)
  const none = { height: 0 }
  if (count >= 2 || (count === 1 && state.endsWithDecor[col])) return [none]

  const set = plan.sets[state.ends.length + col]
  const options = DECOR_SIZES.map((size) => {
    const height = decorHeight(set, size, plan.colWidth)
    const y = state.ends[col]
    return { size, set, height, y, clash: clashes(state.decors, col, y, height) }
  })
  return count === 0 ? options : [none, ...options]
}

// Перебирает все сочетания блоков в концах колонок и выбирает то,
// где колонки заканчиваются ровнее всего и блоки не стоят рядом.
function bestEnding(state, plan) {
  const cols = state.ends.length
  const options = range(0, cols).map((col) => endOptions(state, col, plan))
  let best = null
  const picked = []

  const visit = (col) => {
    if (col === cols) {
      let penalty = 0
      let max = -Infinity
      let min = Infinity
      for (let c = 0; c < cols; c++) {
        const option = picked[c]
        const end = state.ends[c] + (option.height && option.height + GRID.rowGap)
        max = Math.max(max, end)
        min = Math.min(min, end)
        if (!option.height) continue
        if (option.clash) penalty += CLASH_PENALTY
        const left = picked[c - 1]
        if (
          left?.height &&
          option.y < left.y + left.height + DECOR_SPACING &&
          left.y < option.y + option.height + DECOR_SPACING
        ) {
          penalty += CLASH_PENALTY
        }
      }
      const score = max - min + penalty
      if (!best || score < best.score) best = { score, picked: [...picked] }
      return
    }
    for (const option of options[col]) {
      picked[col] = option
      visit(col + 1)
    }
  }
  visit(0)
  return best
}

function finish(state, plan) {
  if (!plan) return { state, score: Math.max(...state.ends) - Math.min(...state.ends) }
  const ending = bestEnding(state, plan)
  const result = copyState(state)
  ending.picked.forEach((option, col) => {
    if (option.height) addDecor(result, col, option.set, option.size, option.height)
  })
  return { state: result, score: ending.score }
}

// ratios — пропорции превью в порядке строк таблицы (null, если картинка ещё грузится).
// colWidth — ширина колонки в единицах макета (см. scaleFor в scale.js).
// seed — «зерно» случайности для блоков с иконками.
// Возвращает позицию каждой карточки ({ col, y } или null, если её пока рано показывать),
// блоки с иконками ({ col, y, height, size, set }) и общую высоту сетки.
// Всё в единицах макета.
//
// 1. Карточки идут по порядку таблицы, каждая в самую короткую колонку.
//    В каждой колонке после случайной по счёту карточки встаёт блок с иконками,
//    но не рядом с блоком в соседней колонке.
// 2. Последние несколько карточек перебираются во всех порядках. Для каждого порядка
//    в концы колонок пробуются блоки из 4 или 5 иконок (или ничего), чтобы в каждой
//    колонке было 1–2 блока. Выбирается вариант, где колонки кончаются ровнее всего.
// 3. Пока картинки грузятся, показываются только карточки, чьё место уже точно известно.
//    Верх сетки от загрузки остальных не меняется.
export function computeLayout(ratios, cols, colWidth, seed = 0) {
  const count = ratios.length
  const heights = ratios.map((ratio) => (ratio ? cardHeight(ratio, colWidth) : 0))
  const firstUnknown = ratios.findIndex((ratio) => !ratio)
  const allKnown = firstUnknown === -1
  const plan = makePlan(count, cols, colWidth, seed)

  const tailSize = Math.min(MAX_TAIL, Math.max(0, count - cols))
  const fixedCount = count - tailSize
  const readyCount = allKnown ? fixedCount : Math.min(firstUnknown, fixedCount)

  const positions = new Array(count).fill(null)
  let state = emptyState(cols)
  place(state, heights, range(0, readyCount), positions, plan)

  if (allKnown) {
    let best = null
    for (const order of permutations(range(fixedCount, count))) {
      const tryState = copyState(state)
      const tryPositions = []
      place(tryState, heights, order, tryPositions, plan)
      const result = finish(tryState, plan)
      // Первым проверяется исходный порядок; меняем его, только если стало заметно ровнее
      if (!best || result.score < best.score - 1) {
        best = { ...result, positions: tryPositions }
      }
    }
    for (const i of range(fixedCount, count)) positions[i] = best.positions[i]
    state = best.state
  }

  const anyPlaced = positions.some(Boolean)
  const contentHeight = anyPlaced ? Math.max(...state.ends) - GRID.rowGap : 0

  return { positions, decors: state.decors, height: GRID.top + contentHeight + GRID.bottom }
}
