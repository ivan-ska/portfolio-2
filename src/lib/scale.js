import { useSyncExternalStore } from 'react'

// Все размеры на сайте взяты из макета при ширине 1440 и записаны в «единицах макета».
// На экране каждая единица = var(--u). При 3 колонках --u = ширина окна / 1440.
export const GRID = {
  colWidth: 464, // ширина колонки
  gap: 12, // между колонками
  pad: 12, // отступ страницы слева и справа
  top: 24, // отступ сетки сверху
  bottom: 24, // отступ сетки снизу
  rowGap: 24, // между карточками по вертикали
  caption: 36, // подпись под превью: 6 отступ + 30 строка
}

export const MIN_COLS = 2
export const MAX_COLS = 4

// Сколько колонок поставить и какой получится масштаб.
// Колонок столько, чтобы каждая была как можно ближе к 464 из макета:
// 2 колонки — до ~1190px, 3 — до ~1666px, дальше 4.
export function scaleFor(width) {
  const step = GRID.colWidth + GRID.gap
  const cols = Math.min(MAX_COLS, Math.max(MIN_COLS, Math.round(width / step)))
  const designWidth = cols * step - GRID.gap + GRID.pad * 2
  return { cols, u: width / designWidth }
}

function subscribe(callback) {
  window.addEventListener('resize', callback)
  return () => window.removeEventListener('resize', callback)
}

// Ширина окна без полосы прокрутки
function getWidth() {
  return document.documentElement.clientWidth
}

export function useScale() {
  return scaleFor(useSyncExternalStore(subscribe, getWidth))
}
